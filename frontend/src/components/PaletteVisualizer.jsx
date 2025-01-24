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
    <div className="paletteVisualizerContainer dashboardLayout">
            <aside className="dashSidebar" style={{ backgroundColor: color1, color: color5 }}> {/* Sidebar BG from palette */}
                <button className="dashItem userProfile" style={{ color: color5 }}> {/* User Profile Button */}
                    <MdAccountCircle /> Cool User <MdVisibility className="moreIcon" />
                </button>
                <button className="dashItem selected" style={{ color: color5 }}> {/* Selected "Overview" Button */}
                    <MdDashboard /> Overview
                </button>
                <button className="dashItem" style={{ color: color5 }}> {/* Other Navigation Buttons */}
                    <MdVisibility /> Palettes
                </button>
                <button className="dashItem" style={{ color: color5 }}>
                    <MdSettings /> Settings
                </button>
                {/* Add more sidebar items as needed */}
            </aside>

            <main className="visualizerMainContent dashboardMainContent">
                <div className="cardRow">
                    <section className="dashboardCard tileFirstRowCol1 card secondaryColorBox" style={{ backgroundColor: color5, borderColor: color2 }}> {/* Card BG and Accent Border */}
                        <p className="dashRow" style={{ color: color3 }}>New palettes <MdVisibility className="moreIcon" /></p> {/* Dark Text, Icon */}
                        <h4 style={{ color: color4 }}>150,040</h4> {/* Highlight Color for Number */}
                        <p className="dashRow trendUp" style={{ color: color3 }}><MdVisibility /> +40%</p> {/* Dark Text, Icon */}
                    </section>

                    <section className="dashboardCard tileFirstRowCol2 card secondaryColorBox" style={{ backgroundColor: color5, borderColor: color2 }}>
                        <p className="dashRow" style={{ color: color3 }}>Palette Views <MdVisibility className="moreIcon" /></p>
                        <h4 style={{ color: color4 }}>300</h4>
                        <p className="dashRow trendUp" style={{ color: color3 }}><MdVisibility /> +30%</p>
                    </section>

                    <section className="dashboardCard tileFirstRowCol3 card secondaryColorBox" style={{ backgroundColor: color5, borderColor: color2 }}>
                        <p className="dashRow" style={{ color: color3 }}>Saved Palettes <MdImage className="moreIcon" /></p>
                        <h4 style={{ color: color4 }}>$2,340</h4>
                        <p className="dashRow trendUp" style={{ color: color3 }}><MdVisibility /> +25%</p>
                    </section>

                    <section className="dashboardCard tileFirstRowCol4 card secondaryColorBox" style={{ backgroundColor: color5, borderColor: color2 }}>
                        <p className="dashRow" style={{ color: color3 }}>Exported palettes <MdSaveAlt className="moreIcon" /></p>
                        <h4 style={{ color: color4 }}>42%</h4>
                        <p className="dashRow trendUp" style={{ color: color3 }}><MdVisibility /> +12%</p>
                    </section>
                </div>

                <div className="cardRow">
                    <section className="chartTile tileSecondRowCol1 fadeColorBox card" style={{ backgroundColor: color5, borderColor: color2 }}> {/* Faded BG Card */}
                        <p className="dashRow" style={{ color: color3 }}>Palette Views / Exports <MdVisibility className="moreIcon" /></p>
                        {/* Placeholder Chart - Using Color Blocks */}
                        <div className="chartBars">
                            <div className="chartBar" style={{ height: '60%', backgroundColor: color2 }} /> {/* Accent Color for Bars */}
                            <div className="chartBar" style={{ height: '75%', backgroundColor: color2 }} />
                            <div className="chartBar" style={{ height: '40%', backgroundColor: color2 }} />
                            <div className="chartBar" style={{ height: '90%', backgroundColor: color2 }} />
                            <div className="chartBar" style={{ height: '65%', backgroundColor: color2 }} />
                            <div className="chartBar" style={{ height: '80%', backgroundColor: color2 }} />
                            <div className="chartBar" style={{ height: '50%', backgroundColor: color2 }} />
                        </div>
                    </section>

                    <section className="submitTemplateTile gradientColorBox primaryTextContrast card" style={{ backgroundImage: `linear-gradient(135deg, ${color2} 0%, ${color3} 100%)`, color: color5 }}> {/* Gradient BG Card */}
                        <p style={{ color: color5 }}><span style={{ fontWeight: 700 }}>New:</span> Palette Visualizer Templates are here!</p>
                        <a href="#" className="primaryButton primaryTextContrast" style={{ backgroundColor: color4, color: color5 }}>Submit Template Idea!</a> {/* Highlight Button & Light Text */}
                    </section>
                </div>

                <div className="cardRow">
                    <section className="recentTicketsTile fadeColorBox card" style={{ backgroundColor: color5, borderColor: color2 }}> {/* Faded BG Card */}
                        <p className="dashRow" style={{ color: color3 }}>Recent Tickets <MdVisibility className="moreIcon" /></p>
                        <div className="ticketRow">
                            <p style={{ fontWeight: 700, color: color3 }}>Feature Request: More Color Export Options</p>
                            <p className="status" style={{ color: color3 }}><span className="statusLight" style={{ backgroundColor: color2 }}></span> Open</p> {/* Accent Color for Status Light */}
                        </div>
                        <div className="ticketRow">
                            <p style={{ fontWeight: 700, color: color3 }}>Bug Report: Slider not working in Firefox</p>
                            <p className="status" style={{ color: color3 }}><span className="statusLight" style={{ backgroundColor: color3 }}></span> Pending</p> {/* Dark Text Color for Status Light */}
                        </div>
                        <div className="ticketRow">
                            <p style={{ fontWeight: 700, color: color3 }}>Improve Dot Drag Performance</p>
                            <p className="status" style={{ color: color3 }}><span className="statusLight" style={{ backgroundColor: color2 }}></span> Closed</p> {/* Accent Color for Status Light */}
                        </div>
                    </section>

                    <section className="topCategoriesTile fadeColorBox card" style={{ backgroundColor: color5, borderColor: color2 }}> {/* Faded BG Card */}
                        <h2 style={{ color: color3 }}>Top Categories</h2>
                        <div className="categoryRow">
                            <p style={{ borderBottomColor: color2 }}>Development</p> {/* Accent Color for Category Bars */}
                        </div>
                        <div className="categoryRow">
                            <p style={{ borderBottomColor: color3, width: '80%' }}>Web Design</p> {/* Dark Text Color for Category Bars */}
                        </div>
                        <div className="categoryRow">
                            <p style={{ borderBottomColor: color2, width: '60%' }}>Graphic Design</p> {/* Accent Color for Category Bars */}
                        </div>
                    </section>
                </div>
            </main>

            <footer className="visualizerFooter dashboardFooter" style={{ backgroundColor: color1, color: color5 }}>
                <p style={{ color: color5 }}>© 2025 Colorly Dashboard - Palette Visualization</p>
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
