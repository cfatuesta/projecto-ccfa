import React, { forwardRef } from 'react';
import '../../style/city-washington-green.css';

const Washington = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="dc-container">
            <main className="dc-main">

                {/* 1. Header Section */}
                <header className="dc-header-section">
                    <span className="dc-subtitle">CITY SPOTLIGHT</span>
                    <h1 className="dc-title">Washington</h1>
                    <span className="dc-tagline">Community & Social</span>
                    <a href="#" className="dc-btn-top-cta">
                        Join the Community <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                </header>

                {/* 2. Bento Grid Layout */}
                <section className="dc-bento-grid">

                    {/* Hero Card: Weekly Long Run */}
                    <div className="dc-card dc-card-hero">
                        <img src="https://images.unsplash.com/photo-1617581629397-a72507c3de9e?q=80&w=2670&auto=format&fit=crop" alt="Monuments Run" className="dc-card-bg" />
                        <div className="dc-card-overlay"></div>
                        <div className="dc-card-content">
                            <span className="dc-label-small">WEEKLY LONG RUN</span>
                            <h2 className="dc-card-title">Monuments at Midnight</h2>
                        </div>
                    </div>

                    {/* Side Column: Social & Map */}
                    <div className="dc-col-side">

                        {/* Location Card */}
                        <div className="dc-card dc-card-social">
                            <span className="material-symbols-outlined dc-icon-tree">forest</span>
                            <h3 className="dc-card-sub">Potomac Trail Social</h3>
                            <p className="dc-card-text">
                                A scenic 10K trail run followed by coffee in Georgetown.
                            </p>
                            <div className="dc-loc-row">
                                <span className="material-symbols-outlined">location_on</span>
                                <span className="dc-coords">38.9072° N, 77.0369° W</span>
                            </div>
                            <div className="dc-next-row">
                                <span>NEXT: SAT 8:00 AM</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </div>
                        </div>

                        {/* Mockup Card (Image/Video placeholder) */}
                        <div className="dc-card dc-card-visual">
                            <img src="https://images.unsplash.com/photo-1599557672200-e22830f7bdf7?q=80&w=2574&auto=format&fit=crop" alt="Runner" />
                            <div className="dc-play-btn">
                                <span className="material-symbols-outlined">play_arrow</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Wide Card: Hill Sprints */}
                    <div className="dc-card dc-card-wide">
                        <img src="https://images.unsplash.com/photo-1557160854-e1e11f691d84?q=80&w=2574&auto=format&fit=crop" alt="Lincoln Memorial" className="dc-card-bg" />
                        <div className="dc-card-overlay"></div>
                        <div className="dc-card-content">
                            <h2 className="dc-card-title">Hill Sprints</h2>
                            <p className="dc-card-text-lg">Conquering the steps of the Lincoln Memorial together.</p>
                        </div>
                    </div>

                </section>

                {/* 3. Stats Section */}
                <section className="dc-stats-section">
                    <div className="dc-stat-box">
                        <span className="dc-stat-val">450+</span>
                        <span className="dc-stat-lbl">MEMBERS</span>
                    </div>
                    <div className="dc-stat-box">
                        <span className="dc-stat-val">12</span>
                        <span className="dc-stat-lbl">WEEKLY RUNS</span>
                    </div>
                    <div className="dc-stat-box">
                        <span className="dc-stat-val">100%</span>
                        <span className="dc-stat-lbl">PURA VIDA</span>
                    </div>
                    <div className="dc-stat-box">
                        <span className="dc-stat-val">24</span>
                        <span className="dc-stat-lbl">SOCIAL EVENTS</span>
                    </div>
                </section>

                {/* 4. Footer RSVP */}
                <section className="dc-footer-rsvp">
                    <h3 className="dc-rsvp-title">Next DC Community Run</h3>
                    <div className="dc-rsvp-details">
                        <div className="dc-detail-col">
                            <span className="dc-dt-lbl">LOCATION</span>
                            <span className="dc-dt-val">National Mall</span>
                        </div>
                        <div className="dc-detail-col">
                            <span className="dc-dt-lbl">TIME</span>
                            <span className="dc-dt-val">Sat, 7:00 AM</span>
                        </div>
                        <div className="dc-detail-col">
                            <span className="dc-dt-lbl">DISTANCE</span>
                            <span className="dc-dt-val">10K Monument Loop</span>
                        </div>
                    </div>
                    <button className="dc-btn-rsvp">RSVP FOR THE RUN</button>
                </section>

            </main>
        </div>
    );
});

export default Washington;
