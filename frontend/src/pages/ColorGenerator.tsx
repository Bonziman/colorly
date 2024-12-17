// src/pages/ColorGenerator.tsx
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import ColorVariations from "../components/ColorVariations";

interface ColorGeneratorProps {
  setNotification: (notification: { message: string; duration: number }) => void;
}

const ColorGenerator: React.FC<ColorGeneratorProps> = ({ setNotification }) => {
  const [selectedColor, setSelectedColor] = useState<string>("#FF5733");

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setNotification({ message: `Color Copied: ${color.toUpperCase()}`, duration: 3000 });
  };

  return (
    <div className="color-generator">
      <h1>Color Tints, Tones, and Shades Generator</h1>
      <div className="main-container">
        <div className="color-picker-section">
          <label>Select Color: </label>
          <ChromePicker color={selectedColor} onChange={handleColorChange} />
        </div>
        <div className="color-variations-section">
          <ColorVariations color={selectedColor} onColorCopy={handleCopyColor} />
        </div>
      </div>
    </div>
  );
};

export default ColorGenerator;
