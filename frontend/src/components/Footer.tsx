import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footerContainer}>
      <div style={styles.sectionContainer}>
        {/* Logo & Subscription */}
        <div style={styles.column}>
            <img src="/src/assets/Colorly Logo.svg" alt="Logo" style={styles.logo} />
          <h3>Subscribe Now</h3>
          <div style={styles.subscribeContainer}>
            <input
              className='subscribeinput'
              type="email"
              placeholder="Enter your Email"
              style={styles.input}
            />
            <button style={styles.button}>Subscribe</button>
          </div>
        </div>

        {/* Information Links */}
        <div style={styles.column}>
          <h3>Information</h3>
          <ul style={styles.linkList}>
            <li>About Us</li>
            <li>More Search</li>
            <li>Blog</li>
            <li>Testimonials</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Helpful Links */}
        <div style={styles.column}>
          <h3>Helpful Links</h3>
          <ul style={styles.linkList}>
            <li>Services</li>
            <li>Supports</li>
            <li>Terms & Condition</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Our Services */}
        <div style={styles.column}>
          <h3>Our Services</h3>
          <ul style={styles.linkList}>
            <li>Brands List</li>
            <li>Order</li>
            <li>Return & Exchange</li>
            <li>Fashion List</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Contact */}
        <div style={styles.column}>
          <h3>Contact Us</h3>
          <p>+91 9999 999 999</p>
          <p>youremailid.com</p>
          <div style={styles.socialIcons}>
            <span>FB</span> <span>G+</span> <span>TW</span> <span>IN</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div style={styles.footerBottom}>
        <p>2025 &copy; Colorly | Made By <a style={styles.hyper} href="https://www.eloirdiwi.me" target="_blank" rel="noopener noreferrer">Aymane Eloirdiwi</a></p>
        <div>
          <span>FAQ</span> | <span>Privacy</span> | <span>Terms & Condition</span>
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
  subscribeContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
    flexDirection: 'column',
  },
  subscribeinput: {
    width: '50%',
  },
  input: {
    flex: '1',
    padding: '5px',
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
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
