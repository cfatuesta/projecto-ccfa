import React, { forwardRef } from 'react';
import '../../style/city-boston.css';

const Boston = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="boston-container">
            <main className="boston-main">

                {/* 1. Header Section */}
                <header className="boston-header-section">
                    <span className="boston-subtitle">CITY SPOTLIGHT</span>
                    <h1 className="boston-title">Boston</h1>
                    <div className="boston-title-lines">
                        <span className="line"></span>
                        <span className="boston-tagline">The Heart of the Marathon</span>
                        <span className="line"></span>
                    </div>
                </header>

                {/* 2. Spotlight Section (Hero + Cards) */}
                <section className="boston-spotlight-grid">

                    {/* Left: Main Hero Image */}
                    <div className="boston-hero-card">
                        <img src="https://images.unsplash.com/photo-1506199326888-0f305f2424b9?q=80&w=2670&auto=format&fit=crop" alt="Boston Crew" className="boston-hero-bg" />
                        <div className="boston-hero-overlay"></div>

                        <div className="boston-hero-content">
                            <h2 className="b-hero-title">The Boston Crew</h2>
                            <p className="b-hero-desc">
                                Capturing the energy of our weekly Charles River tempo sessions.
                            </p>
                            <button className="b-btn-gallery">
                                View Gallery <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>

                        <div className="b-location-pin">
                            <span className="material-symbols-outlined">location_on</span>
                            <div className="b-loc-text">
                                <span className="b-loc-label">LOCATION</span>
                                <span className="b-loc-coords">42.3601° N, 71.0589° W</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Cards Column */}
                    <div className="boston-cards-col">

                        {/* Next Meetup Card (Pink) */}
                        <div className="boston-card b-card-meetup">
                            <span className="b-card-label">NEXT MEETUP</span>
                            <h3 className="b-card-title">Marathon Preparation Run</h3>
                            <p className="b-card-desc">
                                20 Miles through the historic Newton Hills. Pacers for all levels.
                            </p>
                            <div className="b-card-date">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>April 14, 07:00 AM</span>
                            </div>
                        </div>

                        {/* Weather Card (White) */}
                        <div className="boston-card b-card-weather">
                            <span className="b-weather-label">CURRENT TEMP</span>
                            <div className="b-weather-val">48°F</div>
                            <span className="b-weather-sub">Perfect Running Weather</span>
                        </div>

                    </div>
                </section>

                {/* 3. Stats Row */}
                <section className="boston-stats-row">
                    <div className="b-stat-pill">
                        <span className="b-stat-val">1.2k</span>
                        <span className="b-stat-label">ACTIVE RUNNERS</span>
                    </div>
                    <div className="b-stat-pill">
                        <span className="b-stat-val">26.2</span>
                        <span className="b-stat-label">MILES FOCUSED</span>
                    </div>
                    <div className="b-stat-pill">
                        <span className="b-stat-val">15</span>
                        <span className="b-stat-label">WEEKLY ROUTES</span>
                    </div>
                    <div className="b-stat-pill">
                        <span className="b-stat-val">4.8</span>
                        <span className="b-stat-label">AVG RATING</span>
                    </div>
                </section>

                {/* 4. Best of Boston Gallery (Polaroids) */}
                <section className="boston-polaroid-section">
                    {/* Background text "BEST OF BOSTON" handled via CSS or absolute elements if needed, 
                         or simpler header here overlaying. */}
                    <div className="b-gallery-bg-text">
                        <span>BEST OF BOSTON</span>
                    </div>

                    <div className="b-polaroid-grid">

                        {/* Polaroid 1 (Left Tilted) */}
                        <div className="b-polaroid p-1">
                            <div className="b-polaroid-frame">
                                <img src="https://images.unsplash.com/photo-1547844286-9a2c38d4baee?q=80&w=2670&auto=format&fit=crop" alt="Bridge Run" />
                            </div>
                            <span className="b-polaroid-caption">CHARLES RIVER SUNRISE • 06:15 AM</span>
                        </div>

                        {/* Polaroid 2 (Center - The Energy) */}
                        <div className="b-polaroid p-2">
                            <div className="b-polaroid-frame">
                                <img src="https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=2574&auto=format&fit=crop" alt="The Energy" />
                            </div>
                            <span className="b-polaroid-caption">THE ENERGY</span>
                        </div>

                        {/* Polaroid 3 (Right - Detail) */}
                        <div className="b-polaroid p-3">
                            <div className="b-polaroid-frame">
                                <img src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2674&auto=format&fit=crop" alt="Footwear Detail" />
                            </div>
                            <span className="b-polaroid-caption">FOOTWEAR DETAIL</span>
                        </div>

                        {/* CTA Card (Top Right floating or integrated) */}
                        <div className="b-cta-card">
                            <h4 className="b-cta-title">GOT THE SHOT?</h4>
                            <p className="b-cta-desc">SUBMIT YOUR PHOTOS FROM THE LAST CREW RUN.</p>
                            <button className="b-btn-submit">SUBMIT YOUR SHOT <span className="material-symbols-outlined">upload</span></button>
                        </div>

                    </div>

                    <div className="b-gallery-footer">
                        <span className="b-captures-val">842</span>
                        <span className="b-captures-label">CAPTURES THIS MONTH</span>
                    </div>

                </section>

                <section className="boston-footer-nav">
                    <span className="b-footer-label">COLLECTION 2024 • VOL. 1</span>
                </section>

            </main>
        </div>
    );
});

export default Boston;
