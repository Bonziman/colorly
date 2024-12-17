import React, { useState } from 'react';
import colorNameList from 'color-name-list'; // Import a color name library
import './styles/ColorPicker.css'; // Custom styles

const getColorName = (hex) => {
  // Find the closest color name from the library
  const color = colorNameList.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
  return color ? color.name : "Unknown";
};

const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#dca1ed');

  // Update color when the user picks a new one
  const handleChange = (e) => setSelectedColor(e.target.value);

  return (
    <div className="color-picker-container">
      {/* Left: Color Picker */}
      <div className="picker">
        <input
          type="color"
          value={selectedColor}
          onChange={handleChange}
        />
      </div>

      {/* Right: Color Information */}
      <div className="color-info">
        <h2>Color Conversions</h2>
        <p>
          <strong>Hex:</strong> {selectedColor}
        </p>
        <p>
          <strong>RGB:</strong> {hexToRgb(selectedColor)}
        </p>
        <p>
          <strong>HSL:</strong> {hexToHsl(selectedColor)}
        </p>
        <p>
          <strong>Name:</strong> {getColorName(selectedColor)}
        </p>
      </div>
    </div>
  );
};

// Utility: Convert hex to RGB
const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

// Utility: Convert hex to HSL
const hexToHsl = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: break;
    }
    h /= 6;
  }
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  h = Math.round(360 * h);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default ColorPicker;
