import React, { useState } from "react";
import "./styles/ColorVariations.css";
import { getContrastColor } from '../utils/setTextContrast';
import Slider from './Slider';
import { FaHeart } from 'react-icons/fa';

interface ColorVariationsProps {
  color: string;
  onColorCopy: (color: string) => void;
}



const ColorVariations: React.FC<ColorVariationsProps> = ({ color, onColorCopy }) => {
  const [numSteps, setNumSteps] = useState(10);

  const generateColorSteps = (targetColor: string) => {
    const steps = [];
    for (let i = 0; i < numSteps; i++) {
      const ratio = i / (numSteps - 1);
      const blendedColor = blendColors(color, targetColor, ratio);
      steps.push(blendedColor);
    }
    return steps;
  };

  const blendColors = (c1: string, c2: string, ratio: number): string => {
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (rgb: number[]) =>
      `#${rgb.map((val) => val.toString(16).padStart(2, "0")).join("")}`;

    const rgb1 = hexToRgb(c1);
    const rgb2 = hexToRgb(c2);
    const blended = rgb1.map((val, i) => Math.round(val + (rgb2[i] - val) * ratio));
    return rgbToHex(blended);
  };

  const tints = generateColorSteps("#FFFFFF");
  const shades = generateColorSteps("#000000");
  const tones = generateColorSteps("#808080");

  // Function to handle Save button click
  const handleSaveColor = async (hexValue: string) => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await fetch('http://localhost:5000/colors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

  return (
    <div className="color-variations">
      <Slider numSteps={numSteps} setNumSteps={setNumSteps} />

      <div className="row-container">
        <h3>Tints</h3>
        <p>Lighter variations of the selected color.</p>
        <div className="row">
          {tints.map((tint, index) => (
            <div
              key={index}
              className="color-box"
              style={{ backgroundColor: tint }}
              onClick={() => onColorCopy(tint)}
            >
              <div className="copy-icon-box">
                <img className="copy-icon" src="../../images/copy-icon.png" alt="" />
              </div>
              <span>{tint}</span>
              
              <button className="save-button" onClick={() => handleSaveColor(tint)}>
                <FaHeart />
              </button>
              
            </div>
          ))}
        </div>
      </div>

      <div className="row-container">
        <h3>Shades</h3>
        <p>Darker variations of the selected color.</p>
        <div className="row">
          {shades.map((shade, index) => (
            <div
              key={index}
              className="color-box"
              style={{ backgroundColor: shade }}
              onClick={() => onColorCopy(shade)}
            >
              <div className="copy-icon-box">
                <img className="copy-icon" src="../../images/copy-icon.png" alt="" />
              </div>
              <span>{shade}</span>
              <button className="save-button" onClick={() => handleSaveColor(shade)}>
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="row-container">
        <h3>Tones</h3>
        <p>Muted variations of the selected color.</p>
        <div className="row">
          {tones.map((tone, index) => (
            <div
              key={index}
              className="color-box"
              style={{ backgroundColor: tone }}
              onClick={() => onColorCopy(tone)}
            >
              <div className="copy-icon-box">
                <img className="copy-icon" src="../../images/copy-icon.png" alt="" />
              </div>
              <span>{tone}</span>
              <button className="save-button" onClick={() => handleSaveColor(tone)}>
                <FaHeart />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorVariations;
