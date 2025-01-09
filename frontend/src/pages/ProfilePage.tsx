import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [colors, setColors] = useState([]);
  const [palettes, setPalettes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');

        // Fetch Colors
        const colorsResponse = await axios.get("http://localhost:5000/user/colors", { // Correct URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(colorsResponse.data)) {
          setColors(colorsResponse.data);
        } else {
          setError('Colors response is not an array');
          console.error('Error: Colors response is not an array');
        }

        // Fetch Palettes
        const palettesResponse = await axios.get("http://localhost:5000/user/palettes", { // Correct URL
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(palettesResponse.data)) {
          setPalettes(palettesResponse.data);
        } else {
          setError('Palettes response is not an array');
           console.error('Error: Palettes response is not an array');
        }

      } catch (err) {
        setError('Error fetching data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>User Colors</h1>
      <ul>
        {colors.map((color) => (
          <li key={color.id}>
            {color.name}: <span style={{ 
                backgroundColor: color.hex_value, 
                padding: "5px 10px",
                margin: "0 5px",
                color: "white",
            }}>
              {color.hex_value}
            </span>
          </li>
        ))}
      </ul>

      <h1>User Palettes</h1>
      <ul>
        {palettes.map((palette) => (
          <li key={palette.id}>
            {palette.name}
            <ul>
              {palette.colors.map((color, index) => (
                <li key={index} style={{ backgroundColor: color, padding: "5px", margin: "2px" }}>
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
