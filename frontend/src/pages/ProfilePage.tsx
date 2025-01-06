import React, { useEffect, useState } from 'react';

const ProfilePage = () => {
  const [colors, setColors] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        
        const colorsResponse = await fetch('/colors', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        const colorsData = await colorsResponse.json();
        
        if (Array.isArray(colorsData)) {
          setColors(colorsData);
        } else {
          setError('Colors response is not an array');
        }

        const palettesResponse = await fetch('/user/palettes', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const palettesData = await palettesResponse.json();
        
        if (Array.isArray(palettesData)) {
          setPalettes(palettesData);
        } else {
          setError('Palettes response is not an array');
        }
        
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Colors</h1>
      <ul>
        {colors.map((color) => (
          <li key={color.id}>{color.name}: {color.hex_value}</li>
        ))}
      </ul>

      <h1>User Palettes</h1>
      <ul>
        {palettes.map((palette) => (
          <li key={palette.id}>
            {palette.name}
            <ul>
              {palette.colors.map((color, index) => (
                <li key={index} style={{ backgroundColor: color }}>
                  {color}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfilePage;
