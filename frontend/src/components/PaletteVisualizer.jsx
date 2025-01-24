import React from 'react';
import './styles/PaletteVisualizer.css';

// Combined PaletteVisualizerPage and PaletteVisualizer components in one file

const PaletteVisualizer = ({ palette }) => { // <-- This is now just PaletteVisualizer component
  if (!palette || palette.length < 5) {
    return <div className="paletteVisualizerContainer">Palette is missing or incomplete.</div>;
  }

  const color1 = palette[0];
  const color2 = palette[1];
  const color3 = palette[2];
  const color4 = palette[3];
  const color5 = palette[4];

  return (
    <div className="paletteVisualizerContainer dashboardLayout"> {/* Added dashboardLayout class */}
            <header className="visualizerHeader dashboardHeader" style={{ backgroundColor: color1, color: color5 }}> {/* Header BG from palette */}
                <div className="logo" style={{ color: color5 }}>NexaVerse</div> {/* Logo Text */}
            </header>

            <main className="visualizerMainContent dashboardMainContent"> {/* Added dashboardMainContent class */}
                <div className="cardRow"> {/* Row 1: Dashboard Card + Placeholder */}
                    <section className="dashboardCard card" style={{ backgroundColor: 'white' }}> {/* Card BG from palette */}
                        <h2 style={{ color: color3 }}>Dashboard</h2> {/* Dark Text for Dashboard Title */}
                        <div className="dashboardMetrics">
                            <div className="metricBox" style={{ backgroundColor: color2, color: color5 }}> {/* Accent Color Boxes */}
                                <h3>Current MRR</h3>
                                <span className="metricValue" style={{ color: color4 }}>$12.4k</span> {/* Highlight Color for Value */}
                            </div>
                            <div className="metricBox" style={{ backgroundColor: color2, color: color5 }}>
                                <h3>Current Customers</h3>
                                <span className="metricValue" style={{ color: color4 }}>16,601</span>
                            </div>
                            <div className="metricBox" style={{ backgroundColor: color2, color: color5 }}>
                                <h3>Active Customers</h3>
                                <span className="metricValue" style={{ color: color4 }}>33%</span>
                            </div>
                            <div className="metricBox" style={{ backgroundColor: color2, color: color5 }}>
                                <h3>Churn Rate</h3>
                                <span className="metricValue" style={{ color: color4 }}>2%</span>
                            </div>
                        </div>

                        <div className="trendChart"> {/* Placeholder Chart */}
                            <h3 style={{ color: color3 }}>Trend</h3>
                            {/* Simple Bar Chart Representation - can be replaced with a charting library */}
                            <div className="chartBars">
                                <div className="chartBar" style={{ height: '60%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '75%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '40%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '90%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '65%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '80%', backgroundColor: color3 }} />
                                <div className="chartBar" style={{ height: '50%', backgroundColor: color3 }} />
                            </div>
                        </div>
                    </section>

                    <section className="placeholderCard card" style={{ backgroundColor: 'white' }}>
                        <h2 style={{ color: color3 }}>Card Placeholder 1</h2>
                        <p style={{ color: color3 }}>Content for card 1 will go here.</p>
                    </section>
                </div>

                <div className="cardRow"> {/* Row 2: Two Placeholder Cards */}
                    <section className="placeholderCard card" style={{ backgroundColor: color5 }}>
                        <h2 style={{ color: color3 }}>Card Placeholder 2</h2>
                        <p style={{ color: color3 }}>Content for card 2 will go here.</p>
                    </section>
                    <section className="placeholderCard card" style={{ backgroundColor: color5 }}>
                        <h2 style={{ color: color3 }}>Card Placeholder 3</h2>
                        <p style={{ color: color3 }}>Content for card 3 will go here.</p>
                    </section>
                </div>
            </main>

            <footer className="visualizerFooter dashboardFooter" style={{ backgroundColor: color1, color: color5 }}> {/* Footer BG from palette */}
                <p style={{ color: color5 }}>© 2025 NexaVerse Dashboard Preview</p> {/* Light Text for Footer */}
            </footer>
        </div>
  );
};


const PaletteVisualizerPage = () => { // <-- PaletteVisualizerPage is now just a wrapper
  const params = new URLSearchParams(window.location.search);
  const paletteString = params.get('palette');
  const palette = paletteString ? paletteString.split(',') : [];

  console.log({ paletteString, palette }); // <----- KEEP THIS CONSOLE LOG FOR DEBUGGING

  return <PaletteVisualizer palette={palette} />; // <-- Renders the PaletteVisualizer component
};

export default PaletteVisualizerPage; // <-- Export PaletteVisualizerPage (the wrapper)
