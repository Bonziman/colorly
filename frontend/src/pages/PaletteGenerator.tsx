import React, { useState, useEffect } from "react";
import randomColor from "randomcolor";
import copy from "copy-to-clipboard";
import namer from "color-namer";
import "../components/styles/PaletteGenerator.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faCopy,
  faHeart,
  faBars,
  faEye,
  faSun,
  faShareAlt,
  faSave,
  faGripHorizontal,
  faSync,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";



type Color = {
  hex: string;
  name: string;
  textColor: string; // Text color for contrast
};

// Function to calculate luminance and determine text color
const getContrastColor = (hex: string): string => {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;

  // Formula for relative luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128 ? "#000000" : "#FFFFFF"; // Black or white text
};

// Function to fetch the color name from The Color API
const fetchColorNameFromAPI = async (hex: string): Promise<string> => {
  try {
    const response = await fetch(`https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`);
    if (!response.ok) throw new Error("API response not OK");
    const data = await response.json();
    return data.name?.value || "Unknown Color";
  } catch (error) {
    console.error("Error fetching color name from API:", error);
    return "Unknown Color"; // Fallback if API fails
  }
};

// Function to get the nearest color name using the API or fallback to `namer`
const getNearestColorName = async (hex: string): Promise<string> => {
  const apiName = await fetchColorNameFromAPI(hex);
  if (apiName !== "Unknown Color") return apiName;

  // Fallback to `namer` library if API fails
  const fallbackName = namer(hex).basic[0];
  return fallbackName ? fallbackName.name : "Unknown Color";
};

const PaletteGenerator = ({ setNotification }: { setNotification: any }) => {
  const [palette, setPalette] = useState<Color[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [paletteName, setPaletteName] = useState<string>("");

  // Generate a random color palette
  const generatePalette = async () => {
    const colors = await Promise.all(
      Array.from({ length: 5 }, async () => {
        const hex = randomColor();
        const name = await getNearestColorName(hex);
        const textColor = getContrastColor(hex);
        return { hex, name, textColor };
      })
    );
    setPalette(colors);
  };

  // Add a new color to the palette
  const addColor = async () => {
    const newColorHex = randomColor();
    const newColorName = await getNearestColorName(newColorHex);
    const textColor = getContrastColor(newColorHex);
    setPalette([...palette, { hex: newColorHex, name: newColorName, textColor }]);
  };

  // Remove a color from the palette
  const removeColor = (index: number) => {
    setPalette(palette.filter((_, i) => i !== index));
  };

  // Copy the color hex value to clipboard
  const copyColor = (hex: string) => {
    copy(hex);
    setNotification({ message: `Copied: ${hex}`, duration: 3000 });
  };

  // Save individual color
  const handleSaveColor = async (hexValue: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://localhost:5000/colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hex_value: hexValue }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Color saved successfully! ID: ${data.id}`);
      } else {
        alert(`Error saving color: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving color:", error);
      alert("There was an error saving the color.");
    }
  };

  // Save the entire palette
  const handleSavePalette = async () => {
    if (!paletteName) {
      alert("Please provide a name for the palette.");
      return;
    }

    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch("http://localhost:5000/palettes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: paletteName,
          colors: palette.map((color) => color.hex), // Save hex values of all colors
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Palette saved successfully! ID: ${data.id}`);
        setShowModal(false); // Close modal after saving
      } else {
        alert(`Error saving palette: ${data.error}`);
      }
    } catch (error) {
      console.error("Error saving palette:", error);
      alert("There was an error saving the palette.");
    }
  };

  // Effect to generate a palette on component mount
  useEffect(() => {
    generatePalette();
  }, []);

  // Effect to handle Spacebar key press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        generatePalette();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="palette-generator">
      {/* Toolbar replacing the title */}
      <div className="toolbar">
        <div class="toolbar-button">
          <i class="icon-camera"></i>
          <span class="button-label">Camera</span>
        </div>
        <div className="toolbar-button">
          <FontAwesomeIcon icon={faCamera} className="toolbar-icon" />
        </div>
        <FontAwesomeIcon icon={faSync} className="toolbar-icon" />
        <FontAwesomeIcon icon={faGripHorizontal} className="toolbar-icon" />
        <FontAwesomeIcon icon={faSun} className="toolbar-icon" />
        <FontAwesomeIcon icon={faEye} className="toolbar-icon" />
        <span className="toolbar-text">View</span>
        <FontAwesomeIcon icon={faShareAlt} className="toolbar-icon" />
        <span className="toolbar-text">Export</span>

        <div className="toolbar-button">
          <span> <FontAwesomeIcon icon={faHeart} className="toolbar-icon" onClick={() => setShowModal(true)} /> <span className="toolbar-icon tooltip">Save Palette</span></span>


        </div>
        <FontAwesomeIcon icon={faBars} className="toolbar-icon" />
      </div>

      {/* Palette display */}
      <div className="palette">
        {palette.map((color, index) => (
          <div
            key={index}
            className="palette-color-box"
            style={{ backgroundColor: color.hex }}
          >
            <div className="icons">
              <span
                className="pallc-copy-button"
                onClick={() => copyColor(color.hex)}
                style={{ color: color.textColor }}
              >
                <FontAwesomeIcon icon={faCopy} size="lg" />
              </span>
              <span
                className="pallc-delete-button"
                onClick={() => removeColor(index)}
                style={{ color: color.textColor }}
              >
                <FontAwesomeIcon icon={faTrash} size="lg" />
              </span>
              <span
                className="pallc-save-button"
                onClick={() => handleSaveColor(color.hex)}
                style={{ color: color.textColor }}
              >
                <FontAwesomeIcon icon={faHeart} size="lg" />
              </span>
            </div>
            <p
              className="color-info"
              style={{ color: color.textColor }}
            >
              <strong>{color.hex.replace("#", "").toUpperCase()}</strong>
              <br />
              {color.name}
            </p>
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button onClick={addColor}>Add Color</button>
        <button onClick={generatePalette}>Regenerate Palette</button>
        <button onClick={() => setShowModal(true)}>Save Palette</button>
      </div>

      {/* Modal for saving the palette */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save Palette</h3>
            <input
              type="text"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="Enter palette name"
            />
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleSavePalette}>Save Palette</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;
