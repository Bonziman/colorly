import React from 'react';
import SubscriptionForm from './SubscriptionForm';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const tools = [
    { name: "Color Generator", path: "/color-generator" },
    { name: "Palette Generator", path: "/palette-generator" },
    { name: "Image Palette", path: "/image-palette" },
  ];
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.sectionContainer}>
        {/* Logo & Subscription */}
        <div style={styles.column}>
          <img src="/src/assets/Colorly Logo.svg" alt="Logo" style={styles.logo} />
          <h3>Subscribe Now</h3>
          <SubscriptionForm />
        </div>

        

        {/* Helpful Links */}
        <div className='tools' style={styles.column}>
          <h3>Tools</h3>
          <ul tools-list>
            {tools.map(tool => (
              <li key={tool.name}>
                <Link to={tool.path} style={{textDecoration: "none", color:"#555", fontSize: "0.95rem"}}>{tool.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        

        {/* Contact */}
        <div style={styles.column}>
          <h3>Contact Us</h3>
          <p>+212 6 53 8593 72</p>
          <p>eloirdiwi@gmail.com</p>
          <div style={styles.socialIcons}>
       
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <p>2025 © Colorly | Made By <a style={styles.hyper} href="https://www.eloirdiwi.me" target="_blank" rel="noopener noreferrer">Aymane Eloirdiwi</a></p>
        <div>
         
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footerContainer: {
    backgroundColor: '#ffffff',
    padding: '30px 0px',
    margin: '80px 0px 0px 0px',
    color: '#333',
    fontFamily: 'Inter, Arial, sans-serif',
    borderTop: '1px solid #ccc',
  },
  sectionContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as 'wrap',
    gap: '30px',
  },
  column: {
    flex: '1',
    minWidth: '200px',
    marginBottom: '20px',
  },
  logo: {
    margin: '0 0 10px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    lineHeight: '1.8',
  },
  socialIcons: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  footerBottom: {
    borderTop: '1px solid #ccc',
    marginTop: '20px',
    paddingTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#666',
  },
  hyper: {
    color: '#4629EF',
    textDecoration: 'none',
  },
};

export default Footer;
