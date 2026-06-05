import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/refined-auth.css";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();
  const { t } = useLanguage();

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await googleSignIn();
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to sign in with Google: " + err.message);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Failed to sign in: " + err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-container">
      {/* LEFT SIDEBAR */}
      <aside
        className="auth-sidebar"
        style={{
          background: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
        }}
      >
        <div className="auth-brand-tag">LATIN RUN CLUB</div>
        <div className="sidebar-content">
          <h1 className="hero-title">{t("welcome_back")}</h1>
          <div className="hero-footer">{t("velocity_culture_community")}</div>
        </div>
      </aside>

      {/* RIGHT FORM */}
      <main className="auth-form-container">
        <header className="form-header">
          <span className="subtitle">{t("member_access")}</span>
          <h2 className="main-title">
            {t("lace_up")}
            <br />
            {t("lets_run")}
          </h2>
        </header>

        {error && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("email_address")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("email_placeholder")}
              required
            />
          </div>

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

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
            style={{
              background: "#1a1a1a",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            {t("log_in")} <span className="submit-arrow">→</span>
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

          <p className="legal-text">
            {t("dont_have_account")}{" "}
            <Link to="/signup" style={{ color: "#1a1a1a", fontWeight: "bold" }}>
              {t("sign_up")}
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
