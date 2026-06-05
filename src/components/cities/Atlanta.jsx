import React, { forwardRef } from 'react';
import '../../style/city-atlanta.css';

const Atlanta = forwardRef(({ city, onClose }, ref) => {
    return (
        <div ref={ref} className="atlanta-container">
            {/* Close/Back Button can be added if needed, or rely on scroll/UI */}

            <main className="atlanta-main relative overflow-hidden">
                <div className="atl-header-section px-6 lg:px-12 pt-12 pb-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="atl-chapter-label text-xs font-bold uppercase tracking-[0.5em] mb-4 block">
                                Chapter 04 — The Altitude
                            </span>
                            <h1 className="atl-city-title text-[12vw] leading-[0.8] font-black uppercase tracking-tighter">
                                Atlanta
                            </h1>
                        </div>
                        <div className="max-w-md pb-4">
                            <p className="atl-intro-text text-lg font-medium leading-tight uppercase italic">
                                Gritty. High-Energy. Modern. <br />The skyline is our stadium.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="atl-gallery-scroll w-full overflow-x-auto hide-scrollbar flex gap-4 px-6 lg:px-12 py-10">
                    <div className="atl-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="atl-gallery-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4rkR2RtD9rbZXOBaAQEUhofj-spx9XYUH9xk7SkqJbPFy_7KC1LrQAuVr3F-TaNwG2coOHUkPr51gVlGy4GPnQNZ3a3lkSYn-UKdkE4NqkkXQe1zvJq12qg0iehHydAhUhEKvflkmMsW7Kf5J105MwruTU9tv2a0RgHZ8fp-RC1KJWsEv_IMGyeu0nNK-FHVwZEdcxM4EEtBCiY3bUwiAWpgz5PQQ6s8T1DeA6gBuOaVq0HyzNq5x96Tb8YM7zNUzt7X0e3x_WT4')`,
                                filter: 'grayscale(100%) contrast(150%)'
                            }}>
                        </div>
                        <div className="atl-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="atl-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Rise Up
                            </h3>
                        </div>
                    </div>

                    <div className="atl-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="atl-gallery-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCs_1x5S3IHANOuxuGezH0-M7VRdA2eRdolfHAABawV9YuMOw3xCevNPyh7Ubpp8LPSUL5ud_80fHZluVLPxjCZ1DO6JObCS8Qdnp7LakfkpXgXzRx2w181AUF0KMMoNxIDFRqwSMj5pfCz8NBjuzc6XvWSJB49UNwciLi3pEnG6nP6BjeNpGChpEkhaUg358mAFxb8q33F-Vl6BPemduBOh0iFQO_MoQ8EKH9O4SzrA7ikYLrGLtx5xZDTZ7K_tF0D2osgL7MHpDY')` }}>
                        </div>
                        <div className="atl-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="atl-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Concrete Jungle
                            </h3>
                        </div>
                    </div>

                    <div className="atl-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="atl-gallery-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{
                                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAe_NsHGNOHYmX7Pr56PBrx1pkQjQs5nR1bDodpHMdOZThSFDwtsyRi1m6DB-zx_bkazISu-ZRxRc5AnzdwrtlTUnkj3fMX-9XuqwZMzoaplztdrLc6wBBfMw_Dc1zi3uU4VIZEFSugHbDMtFhDBRtjUz3awQesUruOMc-T8hw0jSXkmSDy-dW52IGD6pwONWth6-7kmI0CzFI-5QJPp5GlFCOVTdf-qgK7hoT-RQB-ecsSoA-25ig3ompyY0MMl4psoO0KBmDnf_I')`,
                                filter: 'grayscale(100%) contrast(150%)'
                            }}>
                        </div>
                        <div className="atl-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="atl-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Pure Speed
                            </h3>
                        </div>
                    </div>

                    <div className="atl-gallery-item relative aspect-[16/9] overflow-hidden group">
                        <div className="atl-gallery-img absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB0RxUdKDjx_4xfRqQiaBQglUIDBv3QuvddzjsdAdUfIL5ew2wVt3rHgA7NAeh4V6v4U7LK6lk7PPkzBlKLKOSFkNmGYTQlCBZDTqNx-T_vNeF-p4DOKmzzH3yaSFpIhkLFkHRahbr6ucSE-yCicy4Erz0qMnBrQmY_ZdDMWDefVvm_RgdrOJEmDkaWgXeAaHd3xvRddL818iO40HJKeKu-El2ZasbspjyYTvyc9zAsieXmzlxFu6cP2lDBE_xRsu89lfabA4bKOdU')` }}>
                        </div>
                        <div className="atl-overlay absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
                            <h3 className="atl-card-title text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                Night Runs
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="px-6 lg:px-12 py-24 border-t-2 border-black/10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                        <div>
                            <h2 className="text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                                The <br />Altitude <br />Chapter
                            </h2>
                            <div className="h-2 w-32 bg-black mb-8"></div>
                            <p className="text-2xl font-bold uppercase leading-tight max-w-lg">
                                Elevating the urban running experience. From the Beltline to the Piedmont, we redefine the city's pace.
                            </p>
                        </div>
                        <div className="flex flex-col justify-between items-start">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">01</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">High-Contrast Editorial</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">02</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Unfiltered Perspective</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black italic">03</span>
                                    <p className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1">Collective Motion</p>
                                </div>
                            </div>
                            <button className="group mt-16 bg-black text-white flex items-center justify-between w-full md:w-64 px-6 py-10 transition-transform active:scale-95 atl-load-more">
                                <span className="text-xl font-black uppercase tracking-tighter">Load More</span>
                                <span className="material-symbols-outlined text-4xl group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <section className="bg-black text-white py-20 px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Base Elevation</span>
                        <p className="text-6xl font-black italic">1,050 FT</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Active Crew</span>
                        <p className="text-6xl font-black italic">420+</p>
                    </div>
                    <div className="border-l border-white/20 pl-6">
                        <span className="text-[0.6rem] font-bold uppercase tracking-[0.5em] text-white/40 block mb-4">Avg Temp</span>
                        <p className="text-6xl font-black italic">72°F</p>
                    </div>
                </div>
            </section>

            {/* Community Pulse Bento Grid Section */}
            <section className="atl-community-pulse-section py-24 px-6 lg:px-12 bg-[#F5F5F0]">
                <div className="atl-bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">

                    {/* 1. Morning Glow (Tall/Vertical) */}
                    <div className="atl-bento-card relative row-span-2 overflow-hidden rounded-3xl group bg-white">
                        <img src="https://images.unsplash.com/photo-1552674605-46f5383f6171?q=80&w=2670&auto=format&fit=crop"
                            alt="Morning Glow" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-6 left-6">
                            <span className="text-orange-500 font-bold uppercase text-[0.65rem] tracking-widest block mb-1">06:00 AM / Urban Pace</span>
                            <h3 className="text-black font-black uppercase text-xl leading-none">Morning Glow</h3>
                        </div>
                    </div>

                    {/* 2. Stone Mountain Peak (Small/Vertical) */}
                    <div className="atl-bento-card relative row-span-2 overflow-hidden rounded-3xl group bg-white">
                        <img src="https://images.unsplash.com/photo-1623789578825-992a7620248c?q=80&w=2574&auto=format&fit=crop"
                            alt="Stone Mountain" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-xl">
                            <span className="text-orange-500 font-bold uppercase text-[0.65rem] tracking-widest block mb-1">Weekend / Trail</span>
                            <h3 className="text-black font-black uppercase text-xl leading-none">Stone Mountain <br />Peak</h3>
                        </div>
                    </div>

                    {/* 3. Community Pulse Hero (Large/Wide) - Spans 2 cols */}
                    <div className="atl-bento-card relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-3xl group bg-[#E85D36]">
                        <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop"
                            alt="Community Pulse" className="w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#E85D36] via-transparent to-transparent opacity-90"></div>
                        <div className="absolute bottom-8 left-8 right-8">
                            <h2 className="text-white text-6xl lg:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter mb-4">
                                Community <br />Pulse
                            </h2>
                            <p className="text-white text-lg font-medium leading-tight max-w-md">
                                Building a legacy of health, style, and heritage in every stride across the 404.
                            </p>
                        </div>
                    </div>

                    {/* 4. Equipment / Fashion (Square) */}
                    <div className="atl-bento-card relative row-span-2 overflow-hidden rounded-3xl group bg-black">
                        <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2664&auto=format&fit=crop"
                            alt="Shoe" className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl w-[calc(100%-3rem)]">
                            <span className="text-orange-600 font-bold uppercase text-[0.65rem] tracking-widest block mb-1">Equipment / Fashion</span>
                            <h3 className="text-black font-black uppercase text-xl leading-none">High Performance</h3>
                        </div>
                    </div>

                    {/* 5. The Speed Philosophy (Text Card) - Spans 2 cols */}
                    <div className="atl-bento-card relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-3xl bg-[#F4EAE6] flex flex-col items-center justify-center text-center p-8">
                        <div className="text-orange-500 text-5xl mb-4">
                            <span className="material-symbols-outlined" style={{ fontSize: '4rem' }}>bolt</span>
                        </div>
                        <h3 className="text-black text-3xl font-black uppercase mb-4 tracking-tight">The Speed Philosophy</h3>
                        <p className="text-gray-600 text-sm font-medium leading-relaxed max-w-md">
                            We believe that running is the purest form of movement. In Atlanta, we fuse the rhythm of the city with the precision of elite athletes.
                        </p>
                        <button className="mt-8 border-b-2 border-orange-500 text-black font-bold uppercase tracking-widest text-xs pb-1 hover:text-orange-500 transition-colors">
                            Read The Manifesto
                        </button>
                    </div>

                    {/* 6. Downtown Glow (Runner) */}
                    <div className="atl-bento-card relative row-span-2 overflow-hidden rounded-3xl group bg-white">
                        <img src="https://images.unsplash.com/photo-1551972251-12070d63502a?q=80&w=2574&auto=format&fit=crop"
                            alt="Runner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl w-[calc(100%-3rem)]">
                            <span className="text-orange-600 font-bold uppercase text-[0.65rem] tracking-widest block mb-1">08:00 PM / Night Run</span>
                            <h3 className="text-black font-black uppercase text-xl leading-none">Downtown Glow</h3>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
});

export default Atlanta;
