import React, { forwardRef } from 'react';
import '../../style/city-new-york.css';

const NewYork = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="nyc-container">
            {/* Background Faint Text */}
            <div className="nyc-bg-text">LRC</div>

            <main className="nyc-main-content">
                <div className="nyc-header">
                    <span className="nyc-top-label">CITY SPOTLIGHT</span>

                    <div className="nyc-title-wrapper">
                        {/* Silver Gradient Text */}
                        <h1 className="nyc-hero-text">NYC</h1>
                        <h2 className="nyc-sub-hero">NEW YORK CITY</h2>
                    </div>

                    <p className="nyc-description">
                        Experience the raw energy of the concrete jungle through our high-fashion editorial lens. This is where style meets the pavement.
                    </p>

                    <div className="nyc-actions">
                        <button className="nyc-btn btn-white">VIEW GALLERY</button>
                        <button className="nyc-btn btn-outline">ROUTE MAP</button>
                    </div>
                </div>

                {/* Scattered Collage Section from Reference */}
                <div className="nyc-collage-section relative w-full max-w-6xl mx-auto h-[1200px] my-20">

                    {/* Chapter 01: Top Left (Soft Gradient/Blur) */}
                    <div className="nyc-collage-item absolute top-0 left-0 w-[400px] h-[500px] z-10">
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-2xl"></div>
                        <div className="mt-4">
                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest block mb-1">Chapter 01</span>
                            <h3 className="text-white font-black uppercase text-xl leading-none">Brooklyn Haze</h3>
                        </div>
                    </div>

                    {/* Chapter 02: Top Right (Bridge) */}
                    <div className="nyc-collage-item absolute top-10 right-0 w-[500px] h-[400px] z-20">
                        <img src="https://images.unsplash.com/photo-1496871455396-14e56815f1f4?q=80&w=2570&auto=format&fit=crop"
                            alt="Bridge" className="w-full h-full object-cover grayscale contrast-125 shadow-2xl" />
                        <div className="mt-4">
                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest block mb-1">Chapter 02</span>
                            <h3 className="text-white font-black uppercase text-xl leading-none">Lower East Side Sprints</h3>
                        </div>
                    </div>

                    {/* Chapter 03: Middle Left (Shoes) */}
                    <div className="nyc-collage-item absolute top-[600px] left-20 w-[600px] h-[350px] z-30">
                        <img src="https://images.unsplash.com/photo-1534430480872-3498386e7856?q=80&w=2568&auto=format&fit=crop"
                            alt="Shoes" className="w-full h-full object-cover grayscale contrast-125 shadow-2xl" />
                        <div className="mt-4">
                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest block mb-1">Chapter 03</span>
                            <h3 className="text-white font-black uppercase text-xl leading-none">Concrete Cadence</h3>
                        </div>
                    </div>

                    {/* Chapter 04: Middle Right (Detail) */}
                    <div className="nyc-collage-item absolute top-[700px] right-20 w-[300px] h-[450px] z-10">
                        <img src="https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2668&auto=format&fit=crop"
                            alt="Urban" className="w-full h-full object-cover grayscale contrast-125 shadow-2xl" />
                        <div className="mt-4">
                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest block mb-1">Chapter 04</span>
                            <h3 className="text-white font-black uppercase text-xl leading-none">Williamsburg Social</h3>
                        </div>
                    </div>

                    {/* Chapter 05: Bottom Center (Map/Grid) */}
                    <div className="nyc-collage-item absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] z-20">
                        <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop"
                            alt="Grid" className="w-full h-full object-cover grayscale contrast-125 shadow-2xl" />
                        <div className="mt-4">
                            <span className="text-cyan-400 font-bold uppercase text-xs tracking-widest block mb-1">Chapter 05</span>
                            <h3 className="text-white font-black uppercase text-xl leading-none">The Grid Pattern</h3>
                        </div>
                    </div>

                </div>

                <div className="nyc-stats-footer">
                    <div className="nyc-stat-item">
                        <span className="nyc-stat-label">ACTIVE MEMBERS</span>
                        <div className="nyc-stat-value">1,200+</div>
                        <span className="nyc-stat-sub">NYC Chapter</span>
                    </div>
                    <div className="nyc-stat-item">
                        <span className="nyc-stat-label">NEXT RUN</span>
                        <div className="nyc-stat-value">Sun, 8:00 AM</div>
                        <span className="nyc-stat-sub">CENTRAL PARK LOOP</span>
                    </div>
                    <div className="nyc-stat-item">
                        <span className="nyc-stat-label">TOP ROUTE</span>
                        <div className="nyc-stat-value">West Side Hwy</div>
                        <span className="nyc-stat-sub">5.2 MILES • HIGH ELEVATION</span>
                    </div>
                </div>
            </main>
        </div>
    );
});

export default NewYork;
