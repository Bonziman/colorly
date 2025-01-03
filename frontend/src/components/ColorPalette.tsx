import React, { useState } from "react";
import chroma from "chroma-js";
import ntc from "ntc"; // Name that color library
import { FaSave, FaTrash, FaCopy, FaLock, FaLockOpen } from "react-icons/fa";

type PaletteColor = {
  hex: string;
  name: string;
  locked: boolean; // New property to track lock state
};

const ColorPalette = ({
  setNotification,
}: {
  setNotification: (message: { message: string; duration: number }) => void;
}) => {
  // Function to generate a color palette based on locked colors
  const generateRandomPalette = (currentPalette: PaletteColor[]): PaletteColor[] => {
    // Extract locked colors
    const lockedColors = currentPalette.filter((color) => color.locked).map((color) => color.hex);

    // Generate a cohesive palette using the locked colors
    let scale = lockedColors.length > 0
      ? chroma.scale(lockedColors).colors(5) // Generate new palette based on locked colors
      : chroma.scale("Set3").colors(5); // Default palette generation

    // Create new palette while preserving locked colors
    return scale.map((hex, i) => {
      const existingLockedColor = currentPalette.find(
        (color) => color.locked && color.hex === hex
      );

      return existingLockedColor || {
        hex,
        name: ntc.name(hex)[1],
        locked: false,
      };
    });
  };

  const [palette, setPalette] = useState<PaletteColor[]>(generateRandomPalette([]));

  // Toggle lock state of a color
  const toggleLock = (index: number) => {
    setPalette((prev) =>
      prev.map((color, i) =>
        i === index ? { ...color, locked: !color.locked } : color
      )
    );
  };

  // Copy to clipboard
  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setNotification({ message: `Copied: ${hex}`, duration: 3000 });
  };

  // Delete a color
  const deleteColor = (hex: string) => {
    setPalette((prev) => prev.filter((color) => color.hex !== hex));
  };

  // Save palette
  const savePalette = () => {
    setNotification({ message: "Palette saved!", duration: 3000 });
  };

  // Regenerate palette
  const regeneratePalette = () => {
    setPalette((prev) => generateRandomPalette(prev));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <button
        onClick={regeneratePalette}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          marginBottom: "10px",
          alignSelf: "center",
        }}
      >
        Regenerate Palette
      </button>
      {palette.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color.hex,
            color: chroma.contrast(color.hex, "white") > 4.5 ? "white" : "black",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            position: "relative",
            borderRadius: "4px",
          }}
        >
          {/* Action Icons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              position: "absolute",
              top: "10px",
            }}
          >
            {/* Lock Icon */}
            {color.locked ? (
              <FaLock
                onClick={() => toggleLock(index)}
                style={{ cursor: "pointer", color: "gold" }}
              />
            ) : (
              <FaLockOpen
                onClick={() => toggleLock(index)}
                style={{ cursor: "pointer" }}
              />
            )}
            <FaCopy
              onClick={() => copyToClipboard(color.hex)}
              style={{ cursor: "pointer" }}
            />
            <FaTrash
              onClick={() => deleteColor(color.hex)}
              style={{ cursor: "pointer" }}
            />
            <FaSave onClick={savePalette} style={{ cursor: "pointer" }} />
          </div>
          {/* Color Information */}
          <div style={{ marginTop: "auto", textAlign: "center" }}>
            <p style={{ fontSize: "18px", margin: "0" }}>{color.hex}</p>
            <p style={{ fontSize: "12px", margin: "0" }}>{color.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorPalette;
