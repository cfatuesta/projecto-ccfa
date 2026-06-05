import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../style/about.css";

// Testimonials Data for the auto-scrolling marquee
const ROW1_TESTIMONIALS = [
  {
    id: "t1",
    text: "It's the perfect combination of running and socializing — I get to be myself and feel loved by kind individuals.",
    author: "Jashe Vieluf",
    bgClass: "bg-teal",
  },
  {
    id: "t2",
    text: "Sharing my experience as a runner and coach with new running enthusiasts undoubtedly fills my heart... even more so when I contribute to them achieving their goals and personal records.",
    author: "Yesid Nieto",
    bgClass: "bg-peach",
  },
  {
    id: "t3",
    text: "LRC changed my view from running and in the process I met incredible people that now I can call friends, it's such a nice journey and so excited for everything that's coming for the group.",
    author: "Isabella Saab",
    bgClass: "bg-white",
  },
];

const ROW2_TESTIMONIALS = [
  {
    id: "t4",
    text: "I am beyond grateful for this decision, it's been an very special way to meet new people, share my passion, and bring something different to look forward to in the weekends.",
    author: "Esteban Sánchez",
    bgClass: "bg-lilac",
  },
  {
    id: "t5",
    text: "I have not only been able to meet great athletes but also friends who become family.",
    author: "Isaad Medina-Weffer",
    bgClass: "bg-teal",
  },
  {
    id: "t6",
    text: "I learned that the biggest barriers are the ones we create in our minds and that it doesn't matter a family in a new city.",
    author: "Camila Rocha",
    bgClass: "bg-peach",
  },
];

export default function About() {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".reveal-on-scroll")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      {/* 1. Hero Section */}
      <section className="about-hero-section">
        <div className="hero-title-container">
          <h1 className="hero-title-big">
            OUR STORY
            <br />& HISTORY
          </h1>
        </div>
        <div className="hero-intro-grid reveal-on-scroll">
          <p className="hero-intro-text">
            Latin Run Club was born from the desire to create a safe space for
            Latinos who run, want to start running, or just want to feel closer
            to home. We celebrate our culture, our language, and our shared
            passion for the sport.
          </p>
          <div className="hero-established">
            <div className="est-bar"></div>
            <div className="est-content">
              <span className="est-label">Established</span>
              <span className="est-year">2024</span>
            </div>
          </div>
        </div>

        {/* Hero Image / Banner */}
        <div
          style={{
            position: "relative",
            marginTop: "6rem",
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          className="reveal-on-scroll"
        >
          <img
            src="
            https://images.unsplash.com/photo-1639843093167-ed40b985c01e?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            className="banner-bg"
            alt="Runners"
          />
          <div
            className="banner-content"
            style={{ textAlign: "center", color: "white" }}
          >
            <h2 className="banner-text">TOGETHER WE RUN FURTHER</h2>
            <div className="banner-bar"></div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section reveal-on-scroll">
        <div className="mission-grid">
          <div className="mv-card">
            <span className="mv-label">Our Mission</span>
            <p className="mv-text" style={{ fontSize: "1.5rem" }}>
              To empower the Latin American community worldwide through the
              transformative power of running, fostering health, unity, and
              cultural pride.
            </p>
          </div>
          <div
            className="mv-card"
            style={{ borderColor: "var(--brand-purple)" }}
          >
            <span className="mv-label" style={{ color: "var(--brand-purple)" }}>
              Our Vision
            </span>
            <p className="mv-text" style={{ fontSize: "1.5rem" }}>
              To be the largest and most welcoming global running community,
              where every step taken celebrates our heritage and builds lasting
              friendships.
            </p>
          </div>
        </div>
      </section>

      {/* Break Image */}
      <div
        style={{
          width: "100%",
          height: "500px",
          position: "relative",
          overflow: "hidden",
        }}
        className="reveal-on-scroll"
      >
        <img
          src="https://images.unsplash.com/photo-1718248028293-934f04a578db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt="Running community"
        />
      </div>

      {/* 2. Evolution Timeline */}
      <section className="evolution-section">
        <div className="bg-text-layer">LEGACY</div>

        <div className="about-intro-container reveal-on-scroll">
          <p className="about-intro-text">
            What started as a casual weekend run between friends has evolved
            into a movement of cultural identity, endurance, and community.
          </p>
          <div className="about-intro-bar"></div>
        </div>

        <div className="timeline-container">
          <div className="timeline-line"></div>

          {/* Feb 2024 */}
          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-content">
              <h3 className="year-title" style={{ color: "#EF4444" }}>
                Feb 2024
              </h3>
              <span className="year-subtitle">
                CENTRAL PARK
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    background: "#333",
                    borderRadius: "50%",
                    margin: "0 12px",
                    verticalAlign: "middle",
                  }}
                ></span>
                THE START
              </span>
              <p className="year-desc">
                First group run in Central Park. It was a surprise when 15
                people joined
              </p>
            </div>
            <div className="timeline-visual">
              <img
                src="https://images.unsplash.com/photo-1530143311094-34d807799e8f?q=80&w=2669&auto=format&fit=crop"
                alt="First Group Run"
                className="timeline-img"
              />
            </div>
          </div>

          {/* Jun 2024 */}
          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-content">
              <h3 className="year-title" style={{ color: "#3B82F6" }}>
                Jun 2024
              </h3>
              <span className="year-subtitle">
                BOSTON
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    background: "#333",
                    borderRadius: "50%",
                    margin: "0 12px",
                    verticalAlign: "middle",
                  }}
                ></span>
                NEW CHAPTER
              </span>
              <p className="year-desc">
                Lucia and Ana from who are based in Boston open the first
                chapter.
              </p>
            </div>
            <div className="timeline-visual">
              <img
                src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2680&auto=format&fit=crop"
                alt="Boston Chapter"
                className="timeline-img"
              />
            </div>
          </div>

          {/* Feb 2026 */}
          <div className="timeline-item reveal-on-scroll">
            <div className="timeline-content">
              <h3 className="year-title" style={{ color: "#10B981" }}>
                Feb 2026
              </h3>
              <span className="year-subtitle">
                5 CITIES
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    background: "#333",
                    borderRadius: "50%",
                    margin: "0 12px",
                    verticalAlign: "middle",
                  }}
                ></span>
                CONSOLIDATION
              </span>
              <p className="year-desc">
                We have consolidated as one of the biggest Latin american
                community with presence in 5 major cities.
              </p>
            </div>
            <div className="timeline-visual">
              <img
                src="https://images.unsplash.com/photo-1571008887538-b36bb32f4571?q=80&w=2670&auto=format&fit=crop"
                alt="Latin American Run Community"
                className="timeline-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Leaders Section */}
      <section className="leaders-section reveal-on-scroll">
        <div className="leaders-header">
          <h2 className="leaders-title">Our Leaders</h2>
          <span className="leaders-subtitle">Become a city lead</span>
        </div>

        {/* Row 1: Founders */}
        <div className="founders-grid">
          <div className="leader-card founder-card">
            <img
              src="https://images.squarespace-cdn.com/content/v1/68db0c4bc7a5784954344962/3223b54a-20de-4bef-8508-8644d9f3b2ac/IMG_9922.JPG?format=2500w"
              alt="Camilo Ferreira"
              className="leader-img"
            />
            <div className="leader-info">
              <span className="leader-name">Camilo Ferreira</span>
              <span className="leader-role">Founder</span>
            </div>
          </div>
          <div className="leader-card founder-card">
            <img
              src="https://images.squarespace-cdn.com/content/v1/68db0c4bc7a5784954344962/e7acbe37-7d91-411b-bfbd-3bfa0a5f507f/IMG_3762+%281%29.jpg?format=2500w"
              alt="Cristina Baquerizo"
              className="leader-img"
            />
            <div className="leader-info">
              <span className="leader-name">Cristina Baquerizo</span>
              <span className="leader-role">Founder</span>
            </div>
          </div>
        </div>

        {/* Row 2: City Leads */}
        <div className="city-leads-grid">
          {/* Boston */}
          <div className="leader-card city-lead-card bg-raspberry">
            <div className="leader-info">
              <span className="leader-name">
                Lucia Moreira &<br />
                Ana Vargas
              </span>
              <span className="leader-role">Boston Leads</span>
            </div>
          </div>
          {/* Washington */}
          <div className="leader-card city-lead-card bg-olive">
            <div className="leader-info">
              <span className="leader-name">Camilo Zarate</span>
              <span className="leader-role">Washington Lead</span>
            </div>
          </div>
          {/* London */}
          <div className="leader-card city-lead-card bg-lilac">
            <div className="leader-info">
              <span className="leader-name">
                Sebastian Caro &<br />
                Viviana Conde
              </span>
              <span className="leader-role">London Leads</span>
            </div>
          </div>
          {/* Atlanta */}
          <div className="leader-card city-lead-card bg-peach">
            <div className="leader-info">
              <span className="leader-name">Anika Sabag</span>
              <span className="leader-role">Atlanta Lead</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials Section (Interactive Auto-scrolling Carousel) */}
      <section className="testimonials-carousel-section reveal-on-scroll">
        <div className="testimonials-carousel-header">
          <h2 className="testimonials-main-title">From Our Members</h2>
        </div>

        <div className="carousel-container">
          {/* Row 1: Moving Left */}
          <div className="ticker-wrap left-moving">
            <div className="ticker-track">
              {[
                ...ROW1_TESTIMONIALS,
                ...ROW1_TESTIMONIALS,
                ...ROW1_TESTIMONIALS,
              ].map((item, idx) => (
                <div
                  key={`r1-${item.id}-${idx}`}
                  className={`testimonial-carousel-card ${item.bgClass}`}
                >
                  <p className="testimonial-text">"{item.text}"</p>
                  <span className="testimonial-author">{item.author}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Moving Right */}
          <div className="ticker-wrap right-moving">
            <div className="ticker-track">
              {[
                ...ROW2_TESTIMONIALS,
                ...ROW2_TESTIMONIALS,
                ...ROW2_TESTIMONIALS,
              ].map((item, idx) => (
                <div
                  key={`r2-${item.id}-${idx}`}
                  className={`testimonial-carousel-card ${item.bgClass}`}
                >
                  <p className="testimonial-text">"{item.text}"</p>
                  <span className="testimonial-author">{item.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
