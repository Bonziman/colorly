import React, { useState, useEffect, useRef } from "react";
import "../components/styles/ImagePalette.css";
import ColorThief from "colorthief";
import copy from "copy-to-clipboard";
import { MdImage, MdSaveAlt } from "react-icons/md";
import chroma from "chroma-js";

const ImagePalette = ({ setNotification }) => {
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1502691876148-a84978e59af8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );
  const [palette, setPalette] = useState([]);
  const [dots, setDots] = useState([]);
  const [sliderValue, setSliderValue] = useState(0);
  const imageRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDotIndex, setActiveDotIndex] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
    // Create Web Worker on component mount
    workerRef.current = new Worker(new URL("../workers/imageWorker.js", import.meta.url));

    workerRef.current.onmessage = (event) => {
      const { type, palette, dots } = event.data;

      if (type === "result") {
        setPalette(palette);
        setDots(dots);
        setLoading(false);
      }
    };

    return () => {
      // Terminate Web Worker on component unmount
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    if (image && !loading) {
      extractColors();
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColors = async () => {
    if (!imageRef.current) return;
    setLoading(true);

    const img = imageRef.current;

    // Downsample the image before sending to the worker
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const MAX_DIMENSION = 256; // Adjust as needed

    let newWidth = img.width;
    let newHeight = img.height;

    if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
      if (img.width > img.height) {
        newWidth = MAX_DIMENSION;
        newHeight = (img.height * MAX_DIMENSION) / img.width;
      } else {
        newHeight = MAX_DIMENSION;
        newWidth = (img.width * MAX_DIMENSION) / img.height;
      }
    }

    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.drawImage(img, 0, 0, newWidth, newHeight);

    const imageData = canvas.toDataURL(); // Get base64 encoded image data

    workerRef.current.postMessage({
      type: "extract",
      imageData: imageData,
      imageWidth: newWidth, // Pass new dimensions
      imageHeight: newHeight,
    });
  };

  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value));
  };

  const updatePaletteFromSlider = () => {
    if (palette.length > 0) {
      const baseColors = palette;
      const sliderModifiedPalette = baseColors.map((color) => {
        return chroma(color)
          .luminance(Math.random() * (1.3 - 0.7) + 0.7 + sliderValue * 0.01)
          .hex();
      });
      setPalette(sliderModifiedPalette);
    }
  };

  useEffect(() => {
    updatePaletteFromSlider();
  }, [sliderValue]);

  const handleMouseDown = (e, index) => {
    e.stopPropagation();
    setIsDragging(true);
    setActiveDotIndex(index);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    setActiveDotIndex(null);
  };

  const handleMouseMove = (e) => {
    e.stopPropagation();
    if (isDragging && activeDotIndex !== null && imageRef.current) {
      const imgElement = imageRef.current;
      const imgRect = imgElement.getBoundingClientRect();
      const imageWidth = imgElement.offsetWidth;
      const imageHeight = imgElement.offsetHeight;

      const newDots = [...dots];
      let x = e.clientX - imgRect.left - dragStart.x;
      let y = e.clientY - imgRect.top - dragStart.y;

      x = Math.max(0, Math.min(x, imageWidth));
      y = Math.max(0, Math.min(y, imageHeight));

      newDots[activeDotIndex].x = x;
      newDots[activeDotIndex].y = y;

      setDots(newDots);

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = imgElement.naturalWidth;
      canvas.height = imgElement.naturalHeight;
      context.drawImage(imgElement, 0, 0);
      const xPos = Math.floor((newDots[activeDotIndex].x / imageWidth) * canvas.width);
      const yPos = Math.floor((newDots[activeDotIndex].y / imageHeight) * canvas.height);

      if (xPos >= 0 && yPos >= 0) {
        const pixelData = context.getImageData(xPos, yPos, 1, 1).data;
        const newColor = chroma([
          pixelData[0],
          pixelData[1],
          pixelData[2],
        ]).hex();
        const newPalette = [...palette];
        newPalette[activeDotIndex] = newColor;
        setPalette(newPalette);
      }
    }
  };

  const handleExport = () => {
    copy(palette.join(", "));
    setNotification({
      message: `Palette Copied: ${palette.join(", ")}`,
      duration: 3000,
    });
  };

  return (
    <div
      className="imagePaletteContainer"
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="sliderContainer">
        <span className="sliderLabel">Picked palettes</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          className="colorSlider"
          onChange={handleSliderChange}
        />
      </div>
      <div className="imageContainer">
        <img
          ref={imageRef}
          src={image}
          alt="uploaded or default"
          crossOrigin="anonymous"
          onLoad={() => setLoading(false)}
        />
        {dots.map((dot, index) => (
          <div
            key={index}
            className="colorDot"
            style={{
              backgroundColor: palette[index],
              left: dot.x,
              top: dot.y,
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          />
        ))}
      </div>
      <div className="paletteContainer">
        {palette.map((color, index) => (
          <div
            key={index}
            className="colorBox"
            style={{ backgroundColor: color }}
          />
        ))}
        <button className="browseImageButton">
          <span>
            <MdImage /> Browse image
          </span>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </button>
      </div>
      <button onClick={handleExport} className="exportButton">
        <span>
          <MdSaveAlt /> Export palette
        </span>
      </button>
    </div>
  );
};

export default ImagePalette;
