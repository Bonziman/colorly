import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import "../components/styles/Profile.css";
import { FaShareAlt } from 'react-icons/fa';

interface Color {
    id: number;
    hex_code: string;
    name?: string | null;
}

interface Palette {
    id: number;
    name: string;
    colors: string[];
}

interface ColorResponse {
    colors: Color[];
}

interface PaletteResponse {
    palettes: Palette[];
}

interface Notification {
    message: string;
    duration: number;
}

interface ProfileProps {
    setNotification: (notification: Notification) => void;
}


const handleFetchError = async (response: Response) => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
        } catch (e) {
            throw new Error(`HTTP error! status: ${response.status}, Could not parse JSON error message`);
        }
    }
    return response;
};

// Function to determine contrasting color for text
function getContrastColor(hexcolor: string): string {
    if (!hexcolor) {
        return '#000'; // Default to black for undefined color
    }
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000' : '#fff';
}

const Profile: React.FC<ProfileProps> = ({ setNotification }) => {
    const { user } = useContext(AuthContext);
    const [userData, setUserData] = useState<any>(null);
    const [userColors, setUserColors] = useState<Color[]>([]);
    const [userPalettes, setUserPalettes] = useState<Palette[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
     const [activeExportMenu, setActiveExportMenu] = useState<number | null>(null);




    const handleColorClick = (hexValue: string) => {
        navigator.clipboard.writeText(hexValue);
        setNotification({ message: `Color Copied: ${hexValue.toUpperCase()}`, duration: 3000 });
    };


  const handleExportClick = (event: React.MouseEvent<HTMLDivElement>, paletteId: number) => {
     event.stopPropagation(); // Prevent the palette click event from firing
    setActiveExportMenu(activeExportMenu === paletteId ? null : paletteId);

  };

  const generateTailwindCode = (colors: string[]) => {
        const code = colors.reduce((acc, hex, index) => {
          const colorName = `color_${index + 1}`; // generate color names
          return `${acc}'${colorName}': { DEFAULT: '${hex}', 100: '${hex}', 200: '${hex}', 300: '${hex}', 400: '${hex}', 500: '${hex}', 600: '${hex}', 700: '${hex}', 800: '${hex}', 900: '${hex}' },`;
        }, "{");
        return `${code}}`;
  };

    const generateCSV = (colors: string[]) => {
        return colors.join(",");
    };

    const generateCSVwithHashes = (colors: string[]) => {
        return colors.map(color => `#${color}`).join(", ");
    };

     const generateArray = (colors: string[]) => {
        return JSON.stringify(colors);
    };


      const generateObject = (colors: string[], paletteName: string) => {
           return JSON.stringify(colors.reduce((acc, color, index) => {
             const key = `color_${index+1}`;
            acc[key] = color;
            return acc;
          }, {} as Record<string, string>));
     };



    const downloadAseFile = (colors: string[], paletteName: string) => {
            const aseContent = `#ASE palette file\nColors: ${colors.length}\n`
           + colors.map(hex =>  `${hex.replace("#", "")} 100 100 100\n` ).join("");


          const blob = new Blob([aseContent], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${paletteName}.ase`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
    };
    const generateCssCode = (colors: string[]) => {
       const hexVars = colors.map((hex, index) => `--color-${index + 1}: ${hex}ff;`).join('\n')
       const hslVars = colors.map((hex, index) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const hsl = rgbToHsl(r,g,b);
           return `--color-hsl-${index + 1}: hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1);`;
       }).join('\n')


      const scssHexVars = colors.map((hex, index) => `$color-${index + 1}: ${hex}ff;`).join('\n')
      const scssHslVars = colors.map((hex, index) => {
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const hsl = rgbToHsl(r,g,b);
          return `$color-hsl-${index + 1}: hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1);`;
      }).join('\n')

      const scssRgbVars = colors.map((hex, index) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `$color-rgb-${index + 1}: rgba(${r}, ${g}, ${b}, 1);`;
    }).join('\n')


        const gradientVars = colors.map((hex) => hex + 'ff').join(", ")
       const scssGradientVars =  `
        $gradient-top: linear-gradient(0deg, ${gradientVars});
        $gradient-right: linear-gradient(90deg, ${gradientVars});
        $gradient-bottom: linear-gradient(180deg, ${gradientVars});
        $gradient-left: linear-gradient(270deg, ${gradientVars});
        $gradient-top-right: linear-gradient(45deg, ${gradientVars});
        $gradient-bottom-right: linear-gradient(135deg, ${gradientVars});
        $gradient-top-left: linear-gradient(225deg, ${gradientVars});
        $gradient-bottom-left: linear-gradient(315deg, ${gradientVars});
        $gradient-radial: radial-gradient(${gradientVars});
       `;

    return `
      /* CSS HEX */\n${hexVars}
      \n/* CSS HSL */\n${hslVars}
      \n/* SCSS HEX */\n${scssHexVars}
      \n/* SCSS HSL */\n${scssHslVars}
      \n/* SCSS RGB */\n${scssRgbVars}
      \n/* SCSS Gradient */\n${scssGradientVars}

    `

  }

      const generateExtendedArray = async (colors: string[]) => {
          return await Promise.all(colors.map(async (hex) => {
              const apiResponse = await fetch(`https://www.thecolorapi.com/id?hex=${hex.replace("#", "")}`);
              if (!apiResponse.ok) {
                  return null;
              }
              const colorData = await apiResponse.json();

                const {name, rgb, cmyk, hsb, hsl, lab} = colorData;
              return {name: name.value, hex, rgb: [rgb.r, rgb.g, rgb.b], cmyk: [cmyk.c, cmyk.m, cmyk.y, cmyk.k], hsb: [hsb.h, hsb.s, hsb.b], hsl: [hsl.h, hsl.s, hsl.l], lab: [lab.l, lab.a, lab.b]};

          }))
      }

    const generateXml = async (colors: string[], paletteName:string) => {

        const extendedArray = await generateExtendedArray(colors)
          const xml = `<palette>\n${extendedArray.filter(x => x !== null).map(color => {
            return  `<color name="${color?.name}" hex="${color?.hex}" r="${color?.rgb[0]}" g="${color?.rgb[1]}" b="${color?.rgb[2]}" />`
            }).join("\n")}\n</palette>`
          return xml;

    }


    const handleExportOptionClick = async (format: string, paletteId: number, paletteName:string , colors: string[]) => {
        event?.stopPropagation();
        setActiveExportMenu(null);


      let exportData: any
       if(format === 'tailwind'){
          exportData = generateTailwindCode(colors);
      }else if (format === 'csv') {
           exportData = generateCSV(colors)
      }else if (format === 'csv-with-hashes') {
             exportData = generateCSVwithHashes(colors);
      }else if (format === 'array') {
            exportData = generateArray(colors)
      }else if(format === 'object'){
           exportData = generateObject(colors, paletteName)
      }else if(format === 'ase'){
           downloadAseFile(colors, paletteName)
           return;
       } else if(format === "css") {
             exportData = generateCssCode(colors);
      } else if(format === "xml"){
        exportData = await generateXml(colors, paletteName);
       }

      if(exportData){
       navigator.clipboard.writeText(exportData);
        setNotification({ message: `${format} Code Copied`, duration: 3000 });
       }


    };

    const rgbToHsl = (r:number,g:number,b:number) => {
        r /= 255;
        g /= 255;
        b /= 255;

        let h: number, s: number, l: number;
        let min = Math.min(r, g, b);
        let max = Math.max(r, g, b);
        let delta = max - min;

        if (delta === 0) {
           h = 0;
        } else if (max === r) {
          h = ((g - b) / delta) % 6;
        } else if (max === g) {
          h = (b - r) / delta + 2;
        } else {
           h = (r - g) / delta + 4;
        }

        h = Math.round(h * 60);
        if(h < 0){
         h+=360;
        }


        l = (max + min) / 2;


        if (delta === 0) {
           s = 0
        } else {
            s = delta / (1 - Math.abs(2 * l - 1));
          }
            s= Math.round(s * 100);
            l= Math.round(l * 100)
          return [h, s, l];
        }



    useEffect(() => {
        const fetchData = async () => {
            if (!user || typeof user !== 'object' || !user.id) {
                setIsLoading(false);
                return; // Do not proceed if user is not valid
            }

            try {
                setIsLoading(true);
                const token = localStorage.getItem('jwt_token');
                const userResponse = await fetch(`http://localhost:5000/api/users/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const handledUserResponse = await handleFetchError(userResponse);
                const userData = await handledUserResponse.json();
                setUserData(userData);

                const token2 = localStorage.getItem('jwt_token');
                const colorsResponse = await fetch(`http://localhost:5000/api/users/${user.id}/colors`, {
                    headers: {
                        'Authorization': `Bearer ${token2}`
                    }
                });
                const handledColorsResponse = await handleFetchError(colorsResponse);
                const colorsData: ColorResponse = await handledColorsResponse.json();
                setUserColors(colorsData.colors);

                const token3 = localStorage.getItem('jwt_token');
                const palettesResponse = await fetch(`http://localhost:5000/api/users/${user.id}/palettes`, {
                    headers: {
                        'Authorization': `Bearer ${token3}`
                    }
                });
                const handledPalettesResponse = await handleFetchError(palettesResponse);
                const palettesData: PaletteResponse = await handledPalettesResponse.json();
                setUserPalettes(palettesData.palettes);

            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();

    }, [user]);


    if (isLoading) {
        return <div className='laoder-container'> <img className='loader' src="/src/assets/Loading Gif.gif" alt="" /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!user) {
        window.location.href = '/login';
        return null;
    }


    return (
        <div className="profile-container">
            <h2>Profile</h2>

            {/* User Info Section */}
            <div className="user-info">
                <p><strong>Username:</strong> {userData?.username}</p>
                <p><strong>Email:</strong> {userData?.email}</p>
                {/* Add other basic user info here */}
            </div>

            {/* Saved Colors Section */}
            <div className="saved-colors">
                <h3>Saved Colors</h3>
                {userColors.length > 0 ? (
                    <ul className="color-list">
                        {userColors.map((color) => (
                            <li key={color.id} className="color-item">
                                <div
                                    className="color-swatch"
                                    style={{ backgroundColor: color.hex_code }}
                                    onClick={() => handleColorClick(color.hex_code)}
                                >
                                    <div className="copy-icon-box">
                                        <img className="copy-icon" src="../../images/copy-icon.png" alt="" />
                                    </div>
                                    <p className="hex-value" style={{ color: getContrastColor(color.hex_code) }}>
                                        {color.hex_code.replace("#", "").toUpperCase()}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No saved colors yet.</p>
                )}
            </div>

            {/* Saved Palettes Section */}
            <div className="saved-palettes">
                <h3>Saved Palettes</h3>
                <div className="palettes-container">
                    {userPalettes.length > 0 ? (
                        <ul className="palette-list">
                            {userPalettes.map((palette) => (
                                <li key={palette.id} className="palette-item">
                                    <div className="palette-container"  onClick={() => setActiveExportMenu(null)}>
                                        <h4 >{palette.name}
                                         <div className="export-icon" onClick={(e) => handleExportClick(e, palette.id)}>
                                            <FaShareAlt />
                                             {activeExportMenu === palette.id && (
                                                 <div className="export-menu">
                                                     <button onClick={() => handleExportOptionClick('tailwind', palette.id, palette.name, palette.colors)}>Tailwind</button>
                                                    <button onClick={() => handleExportOptionClick('csv', palette.id, palette.name, palette.colors)}>CSV</button>
                                                    <button onClick={() => handleExportOptionClick('csv-with-hashes', palette.id, palette.name, palette.colors)}>CSV with #</button>
                                                   <button onClick={() => handleExportOptionClick('array', palette.id, palette.name, palette.colors)}>Array</button>
                                                     <button onClick={() => handleExportOptionClick('object', palette.id, palette.name, palette.colors)}>Object</button>
                                                     <button onClick={() => handleExportOptionClick('extended-array', palette.id, palette.name, palette.colors)}>Extended Array</button>
                                                    <button onClick={() => handleExportOptionClick('xml', palette.id, palette.name, palette.colors)}>XML</button>
                                                     <button onClick={() => handleExportOptionClick('ase', palette.id, palette.name, palette.colors)}>ASE</button>
                                                     <button onClick={() => handleExportOptionClick('css', palette.id, palette.name, palette.colors)}>CSS</button>

                                                 </div>
                                            )}
                                        </div>

                                        </h4>

                                        <div className="palette-colors">
                                            {palette.colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="palette-color-swatch"
                                                    style={{ backgroundColor: color }}
                                                    onClick={() => handleColorClick(color)}
                                                >
                                                    <div className="copy-icon-box">
                                                        <img className="copy-icon" src="../../images/copy-icon.png" alt="" />
                                                    </div>
                                                    <p className="hex-value" style={{ color: getContrastColor(color) }}>
                                                        {color.replace("#", "").toUpperCase()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No saved palettes yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
