import React, { useState, useEffect, useRef } from "react";
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
    faGripHorizontal,
    faSync,
    faCamera,
    faLock,
    faLockOpen,
    faPalette
} from "@fortawesome/free-solid-svg-icons";
import chroma from 'chroma-js';

type Color = {
    hex: string;
    name: string;
    textColor: string;
    locked: boolean;
};

const getContrastColor = (hex: string): string => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminance > 128 ? "#000000" : "#FFFFFF";
};

const PaletteGenerator = ({ setNotification }: { setNotification: any }) => {
    const [palette, setPalette] = useState<Color[]>([
        { hex: "#FF5733", name: "Vivid Red", textColor: "#FFFFFF", locked: false },
        { hex: "#33FF57", name: "Emerald Green", textColor: "#FFFFFF", locked: false },
        { hex: "#3357FF", name: "Bright Blue", textColor: "#FFFFFF", locked: false },
        { hex: "#FF33A8", name: "Vivid Pink", textColor: "#FFFFFF", locked: false },
        { hex: "#F4C542", name: "Golden Yellow", textColor: "#000000", locked: false },
    ]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [paletteName, setPaletteName] = useState<string>("");
    const [showGenerationModal, setShowGenerationModal] = useState(false);
    const [selectedGenerationMethod, setSelectedGenerationMethod] = useState(localStorage.getItem("generationMethod") || "Auto")
    const canvasRef = useRef<HTMLCanvasElement>(null);


    const handleLockToggle = (index: number) => {
        setPalette((prevPalette) =>
            prevPalette.map((color, i) =>
                i === index ? { ...color, locked: !color.locked } : color
            )
        );
    };
    const fetchColorNameFromAPI = async (hex: string): Promise<string> => {
        try {
            const response = await fetch(
                `https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`
            );
            if (!response.ok) throw new Error("API response not OK");
            const data = await response.json();
            return data.name?.value || "Unknown Color";
        } catch (error) {
            console.error("Error fetching color name from API:", error);
            return "Unknown Color";
        }
    };

    const getNearestColorName = async (hex: string): Promise<string> => {
        const apiName = await fetchColorNameFromAPI(hex);
        if (apiName !== "Unknown Color") return apiName;
        const fallbackName = namer(hex).basic[0];
        return fallbackName ? fallbackName.name : "Unknown Color";
    };
    // Get hue from a HEX color
    const getHueFromHex = (hex: string): number => {
        const rgb = parseInt(hex.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        let hue = 0;
        if (max === min) {
            return hue
        }
        if (max === r) {
            hue = (g - b) / (max - min)
        } else if (max === g) {
            hue = 2 + (b - r) / (max - min);
        } else {
            hue = 4 + (r - g) / (max - min)
        }

        hue = hue * 60
        if (hue < 0) {
            hue += 360;
        }

        return Math.round(hue); // returns the hue in degrees
    };

    const generateMonochromatic = (baseColor, modifier) => {
        const base = chroma(baseColor);
        return chroma.hsl(base.get('hsl.h'), base.get('hsl.s'), (Math.random() * (0.9 - 0.1) + 0.1) + modifier * 0.05).hex()
    };

    const generateAnalogous = (baseColor, modifier) => {
        const base = chroma(baseColor);
        const hue = base.get('hsl.h') + (Math.random() * (1 - -1) + -1) * 30 * modifier;
        return chroma.hsl(hue, base.get('hsl.s'), base.get('hsl.l')).hex()
    };

    const generateComplementary = (baseColor, modifier) => {
        const base = chroma(baseColor);
        const hue = base.get('hsl.h') + (modifier % 2 === 0 ? 0 : 180)
        return chroma.hsl(hue, base.get('hsl.s'), base.get('hsl.l')).hex()

    };

    const generateSplitComplementary = (baseColor, modifier) => {
        const base = chroma(baseColor);
        const hue = base.get('hsl.h') + (modifier % 3 === 0 ? 0 : modifier % 3 === 1 ? 150 : 210);
        return chroma.hsl(hue, base.get('hsl.s'), base.get('hsl.l')).hex()
    };

    const generateTriadic = (baseColor, modifier) => {
        const base = chroma(baseColor);
        const hue = base.get('hsl.h') + (modifier * 120);
        return chroma.hsl(hue, base.get('hsl.s'), base.get('hsl.l')).hex()
    };

    const generateTetradic = (baseColor, modifier) => {
        const base = chroma(baseColor);
        const hue = base.get('hsl.h') + (modifier * 90);
        return chroma.hsl(hue, base.get('hsl.s'), base.get('hsl.l')).hex()
    };


    const generatePalette = async () => {
        const lockedColors = palette.filter((color) => color.locked);
        const newPalette = await Promise.all(
            palette.map(async (color, index) => {
                if (color.locked) {
                    return color;
                } else {
                    let hex = undefined;
                    if (selectedGenerationMethod === "Auto") {
                        let hue = undefined;
                        if (lockedColors.length > 0) {
                            const lockedColorsHues = lockedColors.map(color => chroma(color.hex).get('hsl.h'));
                            const randomHueIndex = Math.floor(Math.random() * lockedColorsHues.length);
                            hue = lockedColorsHues[randomHueIndex]
                            const modifier = (Math.random() * (60 - -60) + -60)
                            hue = hue + modifier
                        }
                        if (hue) {
                            hex = chroma.hsl(hue, chroma(randomColor()).get('hsl.s'), chroma(randomColor()).get('hsl.l')).hex();
                        } else {
                            hex = randomColor()
                        }
                    } else {
                        const baseColor = lockedColors.length > 0 ? lockedColors[0].hex : randomColor();
                        let modifier = (Math.random() * (1 - -1) + -1)
                        switch (selectedGenerationMethod) {
                            case 'Monochromatic':
                                hex = generateMonochromatic(baseColor, modifier)
                                break;
                            case 'Analogous':
                                hex = generateAnalogous(baseColor, modifier);
                                break;
                            case 'Complementary':
                                hex = generateComplementary(baseColor, index);
                                break;
                            case 'Split Complementary':
                                hex = generateSplitComplementary(baseColor, index);
                                break;
                            case 'Triadic':
                                hex = generateTriadic(baseColor, index);
                                break;
                            case 'Tetradic':
                                hex = generateTetradic(baseColor, index);
                                break;
                            default:
                                hex = randomColor()
                        }
                    }

                    const name = await getNearestColorName(hex);
                    const textColor = getContrastColor(hex);
                    return { hex, name, textColor, locked: false };
                }
            })
        );
        setPalette(newPalette);
    };


    useEffect(() => {
        console.log("Palette updated:", palette);
        localStorage.setItem("generationMethod", selectedGenerationMethod)

    }, [palette, selectedGenerationMethod]);

    const addColor = async () => {
        const newColorHex = randomColor();
        const newColorName = await getNearestColorName(newColorHex);
        const textColor = getContrastColor(newColorHex);
        setPalette([...palette, { hex: newColorHex, name: newColorName, textColor, locked: false }]);
    };

    const removeColor = (index: number) => {
        setPalette(palette.filter((_, i) => i !== index));
    };

    const copyColor = (hex: string) => {
        copy(hex);
        setNotification({ message: `Color Copied: ${hex}`, duration: 3000 });
    };

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
                setNotification({
                    message: `Color saved: ${hexValue}`,
                    duration: 3000,
                });
            } else {
                setNotification({
                    message: `Error saving color: ${data.error}`,
                    duration: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving color:", error);
            setNotification({
                message: "There was an error saving the color.",
                duration: 3000,
            });
        }
    };

    const handleViewPalette = () => {
        if (palette.length > 0) {
            const hexPalette = palette.map(color => color.hex);
            const paletteString = hexPalette.join(',');
            const encodedPaletteString = encodeURIComponent(paletteString);
            const visualizerUrl = `/palette-visualizer?palette=${encodedPaletteString}`;
            window.open(visualizerUrl, '_blank');
        } else {
            setNotification({ message: `Generate a palette first!`, duration: 3000 });
        }
    };

    const handleSharePalette = () => {
        if (palette.length > 0) {
            const hexPalette = palette.map(color => color.hex);
            const paletteString = hexPalette.join(',');
            const encodedPaletteString = encodeURIComponent(paletteString);
            const currentUrl = window.location.href;
            const visualizerUrl = `${currentUrl.split('/').slice(0, 3).join('/')}/palette-visualizer?palette=${encodedPaletteString}`;
            copy(visualizerUrl);
            setNotification({ message: `Palette URL Copied`, duration: 3000 });
        } else {
            setNotification({ message: `Generate a palette first!`, duration: 3000 });
        }

    }

    const downloadPaletteImage = () => {
        if (!canvasRef.current || palette.length <= 0) {
            setNotification({ message: `Generate a palette first!`, duration: 3000 });
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const height = 250;
        const barWidth = Math.max(150, 1000 / palette.length); // ensures min bar width of 150

        const width = barWidth * palette.length;
        console.log("Canvas dimensions:", { width, height });

        canvas.width = width;
        canvas.height = height;

          console.log("Canvas actual dimensions:", { width: canvas.width, height: canvas.height });


        const textColor = "#000"
        const backgroundColor = "#fff"
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height)
        ctx.font = '14px sans-serif';
        ctx.fillStyle = textColor


        for (let i = 0; i < palette.length; i++) {
            const color = palette[i];
            const colorStart = i * barWidth;
               console.log(`Drawing color ${i}:`, {
                color,
                colorStart,
                 barWidth
            });
            ctx.fillStyle = color.hex;
            ctx.fillRect(colorStart, 0, barWidth, height / 2);

            // Calculate the RGB value and convert to string
            const rgb = chroma(color.hex).rgb();
            const rgbText = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

            // Text styling
            let fontSize = 14;
            if (palette.length > 6) {
                fontSize = 10;
                ctx.font = `${fontSize}px sans-serif`;
            } else {
                ctx.font = `${fontSize}px sans-serif`;
            }

            // Calculate the text y position based on font size
          const textYStart = height/2 + fontSize + 5;  // use fontSize as reference
            ctx.fillStyle = getContrastColor(color.hex);
            ctx.fillText(color.name, colorStart + 5, textYStart + 0); //0 margin for color name
            ctx.fillText(color.hex.replace("#", "").toUpperCase(), colorStart + 5, textYStart + fontSize * 1.5); // offset for the hex
            ctx.fillText(rgbText, colorStart + 5, textYStart + fontSize * 3);  // offset for the rgb text
        }

        // Download the image
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'palette.png';
        link.click();

    };


    const handleSavePalette = async () => {
        if (!paletteName) {
            setNotification({ message: `Please provide a name for the palette.`, duration: 3000 });
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
                    colors: palette.map((color) => color.hex),
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setNotification({ message: `Palette saved successfully! ID: ${data.id}`, duration: 3000 });
                setShowModal(false);
            } else {
                setNotification({ message: `Error saving palette: ${data.error}`, duration: 3000 });
            }
        } catch (error) {
            console.error("Error saving palette:", error);
            setNotification({ message: "There was an error saving the palette.", duration: 3000 });
        }
    };

    useEffect(() => {
        generatePalette();
    }, []);

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
    }, [palette]);

    const toolbarItems = [
        {
            icon: faCamera,
            tooltip: "Camera",
            action: downloadPaletteImage
        },
        {
            icon: faSync,
            tooltip: "Generate",
            action: generatePalette
        },
        {
            icon: faGripHorizontal,
            tooltip: "Grip",
            action: () => alert("implementing grip...")
        },
        {
            icon: faSun,
            tooltip: "Sun",
            action: () => alert("implementing sun...")
        },
        {
            icon: faEye,
            tooltip: "View",
            action: handleViewPalette
        },
        {
            icon: faShareAlt,
            tooltip: "Share",
            action: handleSharePalette
        },
        {
            icon: faPalette,
            tooltip: "Generation method",
            action: () => setShowGenerationModal(true)
        },
        {
            icon: faBars,
            tooltip: "Settings",
            action: () => alert("implementing settings...")
        },
    ];
    const generationMethods = [
        "Auto",
        "Monochromatic",
        "Analogous",
        "Complementary",
        "Split Complementary",
        "Triadic",
        "Tetradic"
    ];

    return (
        <div className="palette-generator">
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
            <div className="toolbar">
                {toolbarItems.map((item, index) => (
                    <div key={index} className="toolbar-button" onClick={item.action}>
                        <FontAwesomeIcon icon={item.icon} className="toolbar-icon" />
                        <span className="tooltip">{item.tooltip}</span>
                    </div>
                ))}
            </div>
            <div className="palette">
                {palette.map((color, index) => (
                    <div
                        key={index}
                        className={`palette-color-box`}
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
                            <span
                                className="pallc-lock-button"
                                onClick={() => handleLockToggle(index)}
                                style={{ color: color.textColor }}
                            >
                                <FontAwesomeIcon
                                    icon={faLock}
                                    size="lg"
                                    className={`locked`}
                                    style={{ display: color.locked ? 'inline-flex' : 'none' }}
                                />
                                <FontAwesomeIcon
                                    icon={faLockOpen}
                                    size="lg"
                                    className={`unlocked`}
                                    style={{ display: color.locked ? 'none' : 'inline-flex' }}
                                />
                            </span>
                        </div>
                        <p className="color-info" style={{ color: color.textColor }}>
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
            {/* Modal for changing generation method */}
            {showGenerationModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Generate Method</h3>
                        {generationMethods.map(method => (
                            <div style={{ padding: 10, display: "flex", alignItems: 'center', cursor: 'pointer', backgroundColor: selectedGenerationMethod === method ? '#f0f0f0' : 'white' }} onClick={() => {
                                setSelectedGenerationMethod(method)
                                setShowGenerationModal(false)
                            }} key={method}>
                                {method}
                                {selectedGenerationMethod === method ?
                                    <FontAwesomeIcon icon={faHeart} size="xs" style={{ color: 'red', marginLeft: 5 }} />
                                    : null}
                            </div>
                        ))}
                        <div className="modal-actions">
                            <button onClick={() => setShowGenerationModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaletteGenerator;
