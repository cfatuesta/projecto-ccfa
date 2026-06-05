import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/refined-auth.css";
import "../style/refined-auth.css";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const RUNNING_LEVELS = [
  { value: 0, label: "Novice", color: "#22d3ee" },
  { value: 25, label: "Casual", color: "#facc15" },
  { value: 50, label: "Active", color: "#fb923c" },
  { value: 75, label: "Advanced", color: "#a855f7" },
  { value: 100, label: "Elite", color: "#ec4899" },
];

const CITIES = [
  { id: "new_york", label: "New York" },
  { id: "washington_dc", label: "Washington DC" },
  { id: "boston", label: "Boston" },
  { id: "atlanta", label: "Atlanta" },
  { id: "london", label: "London" },
];

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "new_york",
    levelValue: 50, // Slider value 0-100
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signup, googleSignIn } = useAuth();
  const { t } = useLanguage();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSliderChange = (e) => {
    setFormData({ ...formData, levelValue: Number(e.target.value) });
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await googleSignIn(formData.location, formData.levelValue);
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign up with Google: " + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signup(
        formData.email,
        password,
        formData.name,
        formData.location,
        formData.levelValue
      );
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed: " + err.message);
      }
    }
    setLoading(false);
  };

  // Find closest level for styling
  const getActiveLevelIndex = (val) => {
    if (val < 12.5) return 0;
    if (val < 37.5) return 1;
    if (val < 62.5) return 2;
    if (val < 87.5) return 3;
    return 4;
  };
  const activeIndex = getActiveLevelIndex(formData.levelValue);

  return (
    <div className="auth-page-container">
      {/* SIDEBAR */}
      <aside className="auth-sidebar">
        <div className="auth-brand-tag">LATIN RUN CLUB</div>
        <div className="sidebar-content">
          <h1 className="hero-title">{t("join_the")}</h1>
        </div>
        <div className="hero-footer">{t("velocity_culture_community")}</div>
      </aside>

      {/* FORM AREA */}
      <main className="auth-form-container">
        <header className="form-header">
          <span className="subtitle">{t("athlete_profile")}</span>
          <h2 className="main-title">
            {t("define_your_pace")}
            <br />
            {t("claim_your_spot")}
          </h2>
        </header>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("full_name")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("enter_full_name")}
              required
            />
          </div>

          <div className="input-row">
            <div className="form-group">
              <label>{t("email_address")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("email_placeholder")}
                required
              />
            </div>
            <div className="form-group">
              <label>{t("location_city")}</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: "#f8f9fa",
                  border: "2px solid #e9ecef",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontFamily: "inherit",
                  color: "#1a1a1a",
                  outline: "none",
                  transition: "border-color 0.2s ease, background 0.2s ease",
                  appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231a1a1a%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem top 50%",
                  backgroundSize: "0.65rem auto"
                }}
              >
                {CITIES.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hidden Password for functional Auth */}
          <div
            className="form-group"
            style={{ display: password ? "flex" : "none" }}
          >
            {/* We hide it or show it depending on user flow, but for now lets keep it visible or add it as a required field that looks like the others if user forgot */}
            <label>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {/* Add password field properly since it's required for firebase */}
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* SLIDER */}
          <div className="level-selector">
            <div className="level-header">
              <span className="level-title">{t("running_level")}</span>
              <span className="pro-badge">{t("pro_status")}</span>
            </div>

            <div className="slider-wrapper">
              {/* Visual Track */}
              <div className="visual-track">
                {/* Thumb */}
                <div
                  className="visual-thumb"
                  style={{ left: `${formData.levelValue}%` }}
                ></div>
              </div>

              {/* Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={formData.levelValue}
                onChange={handleSliderChange}
                className="real-slider"
                style={{ height: "40px", zIndex: 30 }}
              />

              {/* Labels */}
              <div className="slider-labels">
                {RUNNING_LEVELS.map((lvl, index) => (
                  <div
                    key={lvl.value}
                    className={`slider-label-item ${index === activeIndex ? "active" : ""}`}
                    style={{ flex: 1 }}
                  >
                    <div
                      className="slider-dot"
                      style={{ backgroundColor: lvl.color }}
                    ></div>
                    <span className="slider-text">{lvl.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {t("create_profile")} <span style={{ marginLeft: "10px" }}>→</span>
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="google-btn"
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
            />
            {t("sign_in_google")}
          </button>

          <p className="legal-text">{t("legal_text")}</p>
        </form>
      </main>
    </div>
  );
}
