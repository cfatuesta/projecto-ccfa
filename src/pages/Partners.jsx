import React from 'react';
import { Link } from 'react-router-dom';
import '../style/partners.css';

export default function Partners() {
    return (
        <div className="partners-page">
            <div className="partners-container">
                {/* 1. Centered Intro Text */}
                <div className="partners-intro-section">
                    <div className="partners-intro-container">
                        <p className="partners-intro-text">
                            Running unites, empowers, and transforms. By partnering with the Latin Run Club, you invest in our communities, elevate diverse athletes, and carry a legacy of culture and resilience forward.
                        </p>
                        <div className="partners-intro-bar"></div>
                    </div>
                </div>

                {/* 2. Main Title */}
                <h1 className="partners-section-title">Ways to Partner</h1>

                {/* 3. Ways to Partner Rows */}
                <div className="ways-list">
                    {/* Sponsor Row */}
                    <div className="way-row">
                        <span className="way-name">Sponsor</span>
                        <a href="mailto:partnerships@latinrunclub.com?subject=Become%20a%20Sponsor" className="btn-way purple-btn">
                            BECOME A SPONSOR
                        </a>
                    </div>

                    {/* Donor Row */}
                    <div className="way-row">
                        <span className="way-name">Donor</span>
                        <a href="mailto:donate@latinrunclub.com?subject=Become%20a%20Donor" className="btn-way purple-btn">
                            BECOME A DONOR
                        </a>
                    </div>

                    {/* Leader Row */}
                    <div className="way-row">
                        <span className="way-name">Leader</span>
                        <a href="mailto:leadership@latinrunclub.com?subject=Become%20a%20Leader" className="btn-way purple-btn">
                            BECOME A LEADER
                        </a>
                    </div>
                </div>

                {/* 4. Bottom Member CTA */}
                <div className="member-cta-container">
                    <Link to="/signup" className="btn-way member-btn">
                        BECOME A MEMBER
                    </Link>
                </div>
            </div>
        </div>
    );
}
