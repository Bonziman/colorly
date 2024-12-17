// src/utils/setTextContrast.js

function getContrastColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white depending on luminance
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

// Apply to all color boxes
document.querySelectorAll(".color-box").forEach((box) => {
  const bgColor = box.style.backgroundColor; // Get the background color of the box
  const hexColor = rgbToHex(bgColor); // Convert to hex if it's in RGB format
  const contrastColor = getContrastColor(hexColor);
  box.style.color = contrastColor; // Set the text color dynamically
});

// Utility function to convert RGB to Hex (if needed)
function rgbToHex(rgb) {
  const rgbArray = rgb.match(/\d+/g).map(Number); // Extract RGB values
  return `#${rgbArray.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
