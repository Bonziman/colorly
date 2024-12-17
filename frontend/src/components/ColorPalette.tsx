import React, { useState, useEffect } from "react";
import chroma from "chroma-js";
import ntc from "ntc"; // Name that color library
import { FaSave, FaTrash, FaCopy } from "react-icons/fa";

type PaletteColor = {
  hex: string;
  name: string;
};


const ColorPalette = ({ setNotification }: { setNotification: (message: { message: string; duration: number }) => void }) => {
  const generateRandomPalette = (): PaletteColor[] => {
    return chroma.scale("Set3").colors(5).map((hex) => ({
      hex,
      name: ntc.name(hex)[1], // Get the name of the color
    }));
  };

  const [palette, setPalette] = useState<PaletteColor[]>(generateRandomPalette());

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setNotification({ message: `Copied: ${hex}`, duration: 3000 });
  };

  const deleteColor = (hex: string) => {
    setPalette((prev) => prev.filter((color) => color.hex !== hex));
  };

  const savePalette = () => {
    // Implement save functionality here
    setNotification({ message: "Palette saved!", duration: 3000 });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
          <div style={{ display: "flex", gap: "10px", position: "absolute", top: "10px" }}>
            <FaCopy onClick={() => copyToClipboard(color.hex)} style={{ cursor: "pointer" }} />
            <FaTrash onClick={() => deleteColor(color.hex)} style={{ cursor: "pointer" }} />
            <FaSave onClick={savePalette} style={{ cursor: "pointer" }} />
          </div>
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
