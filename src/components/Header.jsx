import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User } from "lucide-react";
import logo from "../images/logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <header>
      <div className="logo-container">
        <Link to="/">
          <img
            src={logo}
            alt="Latin Run Club Logo"
            className="logo"
          />
        </Link>
        <button className="burger-menu" onClick={toggleMenu}>
          ☰
        </button>
      </div>
      <div className={`nav-container ${isOpen ? "open" : ""}`}>
        <div className="btn-link">
          <ul className="list">
            <li>
              <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            </li>
            <li>
              <Link to="/community" onClick={() => setIsOpen(false)}>Community</Link>
            </li>
            <li>
              <Link to="/partners" onClick={() => setIsOpen(false)}>Partners</Link>
            </li>
          </ul>
          {currentUser ? (
            <div className="user-nav-actions">
              <Link to="/dashboard" className="btn-dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link
                to="/dashboard/profile"
                className="btn-profile"
                title="My Profile"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} />
                <span className="profile-text">Profile</span>
              </Link>
              <button className="log log-out-ghost" onClick={() => { setIsOpen(false); handleLogout(); }}>
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/signin" onClick={() => setIsOpen(false)}>
              <button className="log">
                <i></i>Sign In
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
