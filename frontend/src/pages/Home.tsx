// src/pages/Home.tsx
import React, { useState } from "react";
import "../components/styles/Home.css";
import { Link } from "react-router-dom";

interface HomeProps {
  user: { username: string } | null;
}

const Home: React.FC<HomeProps> = ({ user }) => {
  const [formData, setFormData] = useState<{ name: string; email: string; message: string }>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulating API call here; replace with actual form submission logic
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmissionStatus("Your message has been sent successfully!");
    } catch (error) {
      setSubmissionStatus("Oops! Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="main-slogan">
            Your Colors, <br /> Your Masterpiece
          </h1>
          <p>
            Effortlessly pick and apply colors to bring your pixel art to life.
            <br />
            With Colorly, selecting and customizing your perfect hue has never <br />
            been easier. Explore your creativity with a powerful yet simple tool <br />
            designed for artists of all levels.
          </p>
          <div className="double-Cta">
            <button className="Cta-but primary">
              <Link
                to="/palette-generator"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Explore Palettes
              </Link>
            </button>
            <button className="Cta-but secondary">Master your color</button>
          </div>
        </div>
        <div className="hero-right">
          
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="feature">
          <img src="/src/assets/Color Explorer.svg" alt="Color Explorer" />
          <h2>Color Explorer</h2>
          <p>Select and adjust your perfect color by exploring shades, tones, and variations.</p>
        </div>
        <div className="feature">
          <img src="/src/assets/Palette Generator.svg" alt="Palette Generator" />
          <h2>Palette Generator</h2>
          <p>Create harmonious color palettes with complementary, analogous, or triadic schemes.</p>
        </div>
        <div className="feature">
          <img src="/src/assets/Color Contrast.svg" alt="Color Contrast" />
          <h2>Color Contrast</h2>
          <p>Check accessibility and contrast ratios for better readability and design clarity.</p>
        </div>
        <div className="feature">
          <img src="/src/assets/Color Preview.svg" alt="Color Preview" />
          <h2>Color Preview</h2>
          <p>Visualize your color in mockups and real-world design elements.</p>
        </div>
      </div>

      {/* Contact Section */}
      <section className="contact">
        
        <div className="contact-image">
          <img src="/src/assets/Contact us.png" alt="Contact Us" />
        </div>
        <div className="contact-form">
          <h2>Contact Us</h2>
          <p>Have any questions or feedback? We'd love to hear from you!</p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          {submissionStatus && <p className="status-message">{submissionStatus}</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;
