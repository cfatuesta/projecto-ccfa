import { useState, useEffect } from 'react';
import '../style/gallery.css';
import '../style/city-new-york.css'; // Reusing the detail styles

// City Data
const cities = [
    {
        id: 'new-york',
        name: 'New York',
        color: 'rgb(0, 151, 178)', // Teal
        bgId: 'bg-teal',
        image: 'https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subtitle: 'The Concrete Jungle',
        description: 'Run through the veins of the city that never sleeps. From Central Park loops to the West Side Highway, experience the energy of the world\'s greatest metropolis.',
        stats: { runners: '12.5k', routes: '42', events: '150+' }
    },
    {
        id: 'washington',
        name: 'Washington',
        color: '#3A4D39', // Green
        bgId: 'bg-green',
        image: 'https://images.unsplash.com/photo-1501466044931-62695aada8e9?q=80&w=1987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subtitle: 'Capital Strides',
        description: 'History in motion. Navigate the monuments, the Mall, and the hidden trails of Rock Creek Park. A running experience monumental in scale.',
        stats: { runners: '8.2k', routes: '28', events: '95' }
    },
    {
        id: 'boston',
        name: 'Boston',
        color: '#D12A5E', // Red/Pink
        bgId: 'bg-navy',
        image: 'https://images.unsplash.com/photo-1714321363628-d65f68f3e2f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subtitle: 'The Marathon City',
        description: 'Where running is religion. Trace the Charles River, conquer Heartbreak Hill, and feel the spirit of the world\'s oldest annual marathon.',
        stats: { runners: '10.1k', routes: '35', events: '112' }
    },
    {
        id: 'atlanta',
        name: 'Atlanta',
        color: '#FD844A', // Orange
        bgId: 'bg-orange',
        image: 'https://images.unsplash.com/photo-1675449672066-db3b9a6cd717?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subtitle: 'The Running City',
        description: 'Southern hospitality meets urban endurance. From loop of the BeltLine to the hills of Buckhead, find your pace in the city in a forest.',
        stats: { runners: '7.8k', routes: '24', events: '88' }
    },
    {
        id: 'london',
        name: 'London',
        color: '#8C77AB', // Purple
        bgId: 'bg-purple',
        image: 'https://images.unsplash.com/photo-1634240085173-5e65c4096299?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        subtitle: 'Royal Parks & River Runs',
        description: 'Timeless routes through historic streets. Dash along the Thames, weave through Royal Parks, and sprint past landmarks that have stood for centuries.',
        stats: { runners: '15.2k', routes: '55', events: '200+' }
    }
];

export default function Gallery() {
    const [activeCityColor, setActiveCityColor] = useState(null);

    // Entrance animation trigger
    useEffect(() => {
        const timer = setTimeout(() => {
            const bars = document.querySelectorAll('.logo-bar');
            bars.forEach((bar, index) => {
                bar.classList.add('animate-entrance');
                setTimeout(() => {
                    bar.style.opacity = '1';
                    bar.style.transform = 'translateX(0)';
                }, 500 + (index * 120));
            });
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const showGallery = (cityId) => {
        setActiveCityColor(cityId);
    };

    const hideGallery = () => {
        setActiveCityColor(null);
    };

    return (
        <div className="gallery-container">
            {/* Background Images Layer */}
            <div className="bg-container">
                {cities.map((city) => (
                    <div
                        key={city.bgId}
                        className={`gallery-bg ${activeCityColor === city.id ? 'active' : ''}`}
                        style={{ backgroundImage: `url('${city.image}')` }}
                    ></div>
                ))}
            </div>

            <main className="gallery-main relative z-40 flex items-center justify-center p-8 min-h-screen">
                <div className="content-wrapper flex items-center gap-0 lg:gap-12 max-w-screen-xl w-full justify-center">

                    {/* SVG Line Section */}
                    <div className="svg-section w-[220px] lg:w-[400px] flex justify-end">
                        <svg className="w-full h-auto text-gray-900 fill-none city-svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 400 800">
                            <path
                                className="line-logo-path"
                                d="M20,40 C140,80 180,120 200,200 C220,280 180,320 220,380 C260,440 320,480 280,560 C240,640 220,700 240,760"
                                stroke="#1a1a1a"
                                strokeLinecap="square"
                                strokeLinejoin="miter"
                                strokeWidth="24"
                            ></path>
                        </svg>
                    </div>

                    {/* Bars Section */}
                    <div className="bars-section flex flex-col gap-6 lg:gap-8 flex-1 max-w-2xl ml-[-20px] lg:ml-[-60px]">
                        {cities.map((city) => (
                            <div
                                key={city.id}
                                className="group relative flex items-center city-bar-row"
                                onMouseEnter={() => showGallery(city.id)}
                                onMouseLeave={hideGallery}
                            >
                                <div
                                    className={`logo-bar bar-${city.id}`}
                                    style={{
                                        backgroundColor: city.color,
                                        height: '3.5rem', /* approx h-14 */
                                        '--city-color': city.color // Pass color for CSS hover shadow
                                    }}
                                >
                                    <span className="city-label">
                                        {city.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
}
