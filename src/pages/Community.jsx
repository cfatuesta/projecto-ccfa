import React from 'react';
import '../style/community.css';
import communityImg from '../images/community image.JPEG';

export default function Community() {
    return (
        <div className="community-page">
            {/* 1. Large Header Group Image */}
            <div className="community-hero-container">
                <img
                    src={communityImg}
                    alt="Latin Run Club Community Group"
                    className="community-hero-img"
                />
            </div>

            {/* 2. Brand Color Stripe Divider */}
            <div className="color-bar-divider">
                <div className="divider-stripe bg-teal"></div>
                <div className="divider-stripe bg-orange"></div>
                <div className="divider-stripe bg-purple"></div>
                <div className="divider-stripe bg-raspberry"></div>
                <div className="divider-stripe bg-olive"></div>
            </div>

            {/* 3. Our Values Section */}
            <section className="community-values-section">
                <h1 className="values-main-title">Our Values</h1>

                <div className="community-values-grid">
                    {/* Comunidad */}
                    <div className="value-card">
                        <div className="value-header">
                            <div className="value-accent-line bg-teal"></div>
                        </div>
                        <h2 className="value-card-title">COMUNIDAD</h2>
                        <p className="value-card-desc">
                            No one runs alone. We build bridges between neighborhoods, generations, and skill levels.
                        </p>
                    </div>

                    {/* Cultura */}
                    <div className="value-card">
                        <div className="value-header">
                            <div className="value-accent-line bg-orange"></div>
                        </div>
                        <h2 className="value-card-title">CULTURA</h2>
                        <p className="value-card-desc">
                            Every step honors those who came before us. We carry our heritage in our stride and our music in our ears.
                        </p>
                    </div>

                    {/* Resiliencia */}
                    <div className="value-card">
                        <div className="value-header">
                            <div className="value-accent-line bg-purple"></div>
                        </div>
                        <h2 className="value-card-title">RESILIENCIA</h2>
                        <p className="value-card-desc">
                            The finish line is just the beginning. We find strength in the struggle and joy in the endurance.
                        </p>
                    </div>

                    {/* Legado */}
                    <div className="value-card">
                        <div className="value-header">
                            <div className="value-accent-line bg-olive"></div>
                        </div>
                        <h2 className="value-card-title">LEGADO</h2>
                        <p className="value-card-desc">
                            We run for the future. Inspiring the next generation of Latin athletes to take up space and break records.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
