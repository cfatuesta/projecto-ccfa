import React, { forwardRef } from 'react';
import '../../style/city-london.css';

const London = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="london-container">
            <main className="london-main">

                {/* 1. Header Section */}
                <header className="london-header-section">
                    <span className="london-subtitle">CITY SPOTLIGHT</span>
                    <h1 className="london-title">LONDON</h1>
                </header>

                {/* 2. Spotlight Section (Graph + Route) */}
                <section className="london-spotlight-grid">

                    {/* Left: Interactive Graph / Stats Overlay */}
                    <div className="london-graph-card">
                        <div className="london-graph-bg" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2670&auto=format&fit=crop')` }}></div>
                        <div className="london-graph-overlay"></div>

                        {/* Stats Floating */}
                        <div className="l-stat-floating l-stat-dist">
                            <span className="l-stat-label">CITY DISTANCE</span>
                            <span className="l-stat-val">42.2 <small>KM</small></span>
                        </div>

                        <div className="l-stat-floating l-stat-elev">
                            <span className="l-stat-label">ELEVATION MAX</span>
                            <span className="l-stat-val">124 <small>M</small></span>
                        </div>

                        <div className="l-stat-floating l-stat-hubs">
                            <span className="l-stat-label">LRC HUBS</span>
                            <div className="l-hub-val">
                                <span>04</span>
                                <div className="l-hub-circles"></div>
                            </div>
                        </div>

                        {/* Dashed Line SVG representation */}
                        <svg className="l-elevation-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
                            <path d="M0,150 Q100,50 200,100 T400,120" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8,8" className="l-path-anim" />
                            <circle cx="100" cy="100" r="4" fill="white" />
                            <circle cx="200" cy="100" r="6" fill="#333" stroke="white" strokeWidth="2" />
                            <circle cx="300" cy="110" r="4" fill="white" />
                        </svg>
                    </div>

                    {/* Right: Route Card */}
                    <div className="london-route-card">
                        <div className="l-route-header">
                            <span className="material-symbols-outlined l-star-icon">stars</span>
                            <span className="l-route-label">ROUTE OF THE MONTH</span>
                        </div>

                        <h2 className="l-route-title">Thames Path Circuit</h2>
                        <p className="l-route-desc">
                            A panoramic 12km loop starting from Tower Bridge, traversing the historic South Bank and returning via Blackfriars. Ideal for sunrise sessions.
                        </p>

                        <div className="l-route-meta">
                            <div className="l-meta-row">
                                <span>Surface Type</span>
                                <span>Paved / Urban</span>
                            </div>
                            <div className="l-meta-row">
                                <span>Difficulty</span>
                                <span>Moderate</span>
                            </div>
                        </div>

                        <button className="l-btn-download">
                            <span className="material-symbols-outlined">download</span>
                            Download GPX
                        </button>
                    </div>
                </section>

                {/* 3. Movement Gallery Section */}
                <section className="london-gallery-section">
                    <header className="l-gallery-header">
                        <span className="l-gallery-sub">CITY MOVEMENT GALLERY</span>
                        <h2 className="l-gallery-title">LONDON</h2>
                    </header>

                    <div className="l-bento-grid">
                        {/* Item 1: Large Image Top Left */}
                        <div className="l-bento-item l-item-1">
                            <img src="https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=2670&auto=format&fit=crop" alt="London Run" />
                            <div className="l-bento-overlay">
                                <span className="l-bento-tag">EXHIBITION</span>
                                <span className="l-bento-name">Movement 03: LDN</span>
                            </div>
                        </div>

                        {/* Item 2: Portrait Right */}
                        <div className="l-bento-item l-item-2">
                            <div className="l-frame-mockup">
                                <img src="https://images.unsplash.com/photo-1533644084346-609804b72620?q=80&w=2670&auto=format&fit=crop" alt="Poster Mockup" />
                            </div>
                            <div className="l-bento-caption">
                                <span className="l-cap-num">CHAPTER 02</span>
                                <span className="l-cap-title">CONCRETE CANYONS</span>
                            </div>
                        </div>

                        {/* Item 3: Square Bottom Left */}
                        <div className="l-bento-item l-item-3">
                            <img src="https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=2668&auto=format&fit=crop" alt="South Bank" />
                            <div className="l-bento-caption">
                                <span className="l-cap-num">CHAPTER 01</span>
                                <span className="l-cap-title">SOUTH BANK SPRINT</span>
                            </div>
                        </div>

                        {/* Item 4: Wide Bottom Right */}
                        <div className="l-bento-item l-item-4">
                            <img src="https://images.unsplash.com/photo-1513026705753-bc3fffca8bf4?q=80&w=2670&auto=format&fit=crop" alt="Regent's Park" />
                            <div className="l-bento-caption">
                                <span className="l-cap-num">CHAPTER 03</span>
                                <span className="l-cap-title">REGENT'S PARK</span>
                            </div>
                        </div>
                        {/* Item 5: Wide Bottom Center */}
                        <div className="l-bento-item l-item-5">
                            <img src="https://images.unsplash.com/photo-1449824913929-2b3a3e36cd72?q=80&w=2670&auto=format&fit=crop" alt="Thames Path" />
                            <div className="l-bento-caption">
                                <span className="l-cap-num">CHAPTER 04</span>
                                <span className="l-cap-title">THAMES PATH RHYTHM</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Footer Stats */}
                <section className="london-footer-stats">
                    <span className="l-footer-label">EXPERIENCE THE FULL CITY SERIES</span>
                    <div className="l-nav-buttons">
                        <button className="l-nav-btn"><span className="material-symbols-outlined">arrow_back</span></button>
                        <button className="l-nav-btn"><span className="material-symbols-outlined">arrow_forward</span></button>
                    </div>
                </section>

            </main>
        </div>
    );
});

export default London;
