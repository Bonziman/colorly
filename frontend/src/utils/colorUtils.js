// Function to generate tints (lighten color by adding white)
export function generateTints(hex) {
  const tints = [];
  for (let i = 0; i <= 9; i++) {
    tints.push(generateTint(hex, i * 0.1));
  }
  return tints;
}

// Function to generate shades (darken color by adding black)
export function generateShades(hex) {
  const shades = [];
  for (let i = 0; i <= 9; i++) {
    shades.push(generateShade(hex, i * 0.1));
  }
  return shades;
}

// Function to generate tones (adjust saturation without changing lightness)
export function generateTones(hex) {
  const tones = [];
  for (let i = 0; i <= 9; i++) {
    tones.push(generateTone(hex, i * 0.1));
  }
  return tones;
}

// Helper to adjust the color by adding white (for tints)
function generateTint(hex, factor) {
  const color = hexToRgb(hex);
  const r = Math.round(color.r + (255 - color.r) * factor);
  const g = Math.round(color.g + (255 - color.g) * factor);
  const b = Math.round(color.b + (255 - color.b) * factor);
  return rgbToHex(r, g, b);
}

// Helper to adjust the color by adding black (for shades)
function generateShade(hex, factor) {
  const color = hexToRgb(hex);
  const r = Math.round(color.r * (1 - factor));
  const g = Math.round(color.g * (1 - factor));
  const b = Math.round(color.b * (1 - factor));
  return rgbToHex(r, g, b);
}

// Helper to adjust saturation (for tones)
function generateTone(hex, factor) {
  // Simplified tone generation (not perfectly accurate to HSL)
  const color = hexToRgb(hex);
  const r = Math.round(color.r * (1 - factor));
  const g = Math.round(color.g * (1 - factor));
  const b = Math.round(color.b * (1 - factor));
  return rgbToHex(r, g, b);
}

// Helper to convert hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// Helper to convert RGB to hex
function rgbToHex(r, g, b) {
  return `#${(1 << 24) | (r << 16) | (g << 8) | b.toString(16).slice(1)}`;
}


// Convert HEX to RGB
export const hexToRgb = (hex: string) => {
  const match = /^#([a-fA-F0-9]{6})$/.exec(hex);
  if (!match) return { r: 0, g: 0, b: 0 };

  const [r, g, b] = match[1].match(/.{2}/g)?.map((x) => parseInt(x, 16)) || [0, 0, 0];
  return { r, g, b };
};

// Convert RGB to HEX
export const rgbToHex = (rgb: { r: number; g: number; b: number }) => {
  return `#${(1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b
    .toString(16)
    .slice(1)}`.toUpperCase();
};

// Function to generate color steps
export const calculateColorSteps = (startColor: string, endColor: string, steps: number) => {
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  const stepSize = 1 / (steps - 1);
  const stepsArray = [];

  for (let i = 0; i < steps; i++) {
    const r = Math.round(startRgb.r + (endRgb.r - startRgb.r) * stepSize * i);
    const g = Math.round(startRgb.g + (endRgb.g - startRgb.g) * stepSize * i);
    const b = Math.round(startRgb.b + (endRgb.b - startRgb.b) * stepSize * i);
    stepsArray.push(rgbToHex({ r, g, b }));
  }

  return stepsArray;
};
