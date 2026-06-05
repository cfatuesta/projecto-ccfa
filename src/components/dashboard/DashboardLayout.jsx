import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  confirmRaceAttendance,
  getRace,
} from "../../services/firestoreService";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Home,
  MapPin,
  Globe,
  Trophy,
  User,
  Shield,
  LogOut,
  Award,
  Menu,
  QrCode,
  Scan,
  X,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import QRCode from "react-qr-code";
import "../../style/dashboard.css";

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function getInitials(firstName, lastName) {
  const f = firstName?.[0] || "";
  const l = lastName?.[0] || "";
  return (f + l).toUpperCase() || "?";
}

// All nav items — used in sidebar and drawer
const ALL_NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/city", icon: MapPin, label: "My City" },
  { to: "/dashboard/races", icon: Trophy, label: "Explore Races" },
  { to: "/dashboard/leaderboard", icon: Award, label: "Leaderboard" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

// 4 items shown in mobile bottom nav (QR occupies center slot)
const MOBILE_NAV_ITEMS = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/races", icon: Trophy, label: "Races" },
  { to: "/dashboard/leaderboard", icon: Award, label: "Board" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

export default function DashboardLayout() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("show"); // "show" | "scan"
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null); // { status: "success"|"error"|"duplicate", raceName, points }
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  const firstName =
    userProfile?.firstName ||
    currentUser?.displayName?.split(" ")[0] ||
    "Runner";
  const lastName =
    userProfile?.lastName ||
    currentUser?.displayName?.split(" ").slice(1).join(" ") ||
    "";
  const city = userProfile?.city || "new_york";
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(firstName);
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Start/stop scanner based on tab and modal state
  useEffect(() => {
    if (qrModalOpen && qrModalTab === "scan" && scanning) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [qrModalOpen, qrModalTab, scanning]);

  function startScanner() {
    if (scannerInstanceRef.current || !scannerRef.current) return;
    const scanner = new Html5QrcodeScanner(
      "runner-qr-reader",
      { fps: 10, qrbox: { width: 240, height: 240 } },
      false,
    );
    scanner.render(onScanSuccess, () => {});
    scannerInstanceRef.current = scanner;
  }

  function stopScanner() {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear().catch(() => {});
      scannerInstanceRef.current = null;
    }
  }

  async function onScanSuccess(decodedText) {
    stopScanner();
    setScanning(false);
    setScanResult({ status: "loading", raceName: "", points: 0 });

    try {
      // Extract raceId from URL like https://host/race/:raceId/confirm
      let raceId = null;
      try {
        const url = new URL(decodedText.trim());
        const match = url.pathname.match(/\/race\/([^/]+)\/confirm/);
        if (match) raceId = match[1];
      } catch {
        // Not a URL — not a valid race QR
      }

      if (!raceId) {
        setScanResult({ status: "error", message: "This doesn't look like a race QR code." });
        return;
      }

      const race = await getRace(raceId);
      if (!race) {
        setScanResult({ status: "error", message: "Race not found. It may have been removed." });
        return;
      }

      // Check for duplicate
      if ((race.confirmedAttendees || []).includes(currentUser.uid)) {
        setScanResult({ status: "duplicate", raceName: race.name, points: race.pointValue || 0 });
        return;
      }

      await confirmRaceAttendance(raceId, currentUser.uid);
      setScanResult({ status: "success", raceName: race.name, points: race.pointValue || 0 });
    } catch (err) {
      console.error("Scan error:", err);
      setScanResult({ status: "error", message: "Something went wrong. Please try again." });
    }
  }

  function closeQrModal() {
    setQrModalOpen(false);
    setQrModalTab("show");
    setScanning(false);
    setScanResult(null);
    stopScanner();
  }

  const handleLogout = async () => {
    try {
      setDrawerOpen(false);
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("layout-qr-code");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 300, 300);
      ctx.drawImage(img, 0, 0, 300, 300);
      const a = document.createElement("a");
      a.download = `lrc-qr-${currentUser?.uid?.slice(0, 8) || "user"}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  const avatarImg = () =>
    photoURL ? (
      <img
        src={photoURL}
        alt={firstName}
        style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
      />
    ) : null;

  return (
    <div className="dashboard-shell">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="dashboard-sidebar">
        <NavLink to="/" className="sidebar-brand">
          <img
            src="/src/images/logo.png"
            alt="LRC"
            className="sidebar-brand-icon"
          />
          <span className="sidebar-brand-text">Latin Run Club</span>
        </NavLink>

        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: avatarColor }}>
            {avatarImg() || initials}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {firstName} {lastName}
            </div>
            <div className="sidebar-user-city">
              <MapPin size={12} />
              {CITY_NAMES[city] || city}
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {ALL_NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
          {userProfile?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Shield size={20} />
              Admin Settings
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* ─── Slide Drawer Overlay ─── */}
      {drawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* ─── Slide Drawer ─── */}
      <div className={`mobile-drawer${drawerOpen ? " open" : ""}`}>
        <div className="mobile-drawer-header">
          <div
            className="mobile-drawer-avatar"
            style={{ background: photoURL ? "transparent" : avatarColor }}
          >
            {avatarImg() || initials}
          </div>
          <div className="mobile-drawer-user-info">
            <div className="mobile-drawer-name">
              {firstName} {lastName}
            </div>
            <div className="mobile-drawer-city">
              <MapPin size={12} />
              {CITY_NAMES[city] || city}
            </div>
          </div>
          <button
            className="mobile-drawer-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mobile-drawer-nav">
          {ALL_NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-drawer-link${isActive ? " active" : ""}`
              }
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
          {userProfile?.isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `mobile-drawer-link${isActive ? " active" : ""}`
              }
              onClick={() => setDrawerOpen(false)}
            >
              <Shield size={20} />
              Admin Settings
            </NavLink>
          )}
        </nav>

        <div className="mobile-drawer-footer">
          <button className="mobile-drawer-logout" onClick={handleLogout}>
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </div>

      {/* ─── Mobile Header ─── */}
      <div className="mobile-header">
        <button
          className="mobile-header-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="mobile-header-brand">LRC</span>
        <div
          className="mobile-header-avatar"
          style={{ background: photoURL ? "transparent" : avatarColor }}
        >
          {avatarImg() || initials}
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="dashboard-main">
        <Outlet />
      </main>

      {/* ─── Mobile Bottom Nav (5 slots: 2 + QR + 2) ─── */}
      <nav className="mobile-nav">
        <div className="mobile-nav-inner">
          {MOBILE_NAV_ITEMS.slice(0, 2).map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}

          {/* Center QR button */}
          <button
            className="mobile-nav-qr-btn"
            onClick={() => { setQrModalOpen(true); setQrModalTab("show"); setScanResult(null); }}
            aria-label="Show my QR code"
          >
            <QrCode size={26} />
          </button>

          {MOBILE_NAV_ITEMS.slice(2).map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `mobile-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ─── QR Full-Screen Modal ─── */}
      {qrModalOpen && (
        <div
          className="qr-fullscreen-overlay"
          onClick={closeQrModal}
        >
          <div
            className="qr-fullscreen-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="qr-fullscreen-close"
              onClick={closeQrModal}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Tabs */}
            <div className="qr-modal-tabs">
              <button
                className={`qr-modal-tab ${qrModalTab === "show" ? "active" : ""}`}
                onClick={() => { setQrModalTab("show"); setScanning(false); setScanResult(null); }}
              >
                <QrCode size={15} /> My QR
              </button>
              <button
                className={`qr-modal-tab ${qrModalTab === "scan" ? "active" : ""}`}
                onClick={() => { setQrModalTab("scan"); setScanResult(null); }}
              >
                <Scan size={15} /> Scan Race
              </button>
              {userProfile?.isAdmin && (
                <button
                  className={`qr-modal-tab ${qrModalTab === "admin" ? "active" : ""}`}
                  onClick={() => { setQrModalTab("admin"); setScanning(false); setScanResult(null); }}
                  style={{ color: qrModalTab === "admin" ? "var(--lrc-purple)" : "var(--lrc-text-secondary)" }}
                >
                  <Shield size={15} /> Admin Hub
                </button>
              )}
            </div>

            {/* Show My QR Tab */}
            {qrModalTab === "show" && (
              <>
                <h2 className="qr-fullscreen-title">My QR Code</h2>
                <p className="qr-fullscreen-subtitle">
                  Show this at races so the admin can confirm your attendance.
                </p>
                <div className="qr-fullscreen-code">
                  <QRCode
                    id="layout-qr-code"
                    value={currentUser?.uid || "unknown"}
                    size={240}
                  />
                </div>
                <button
                  className="btn-primary qr-fullscreen-download"
                  onClick={handleDownloadQR}
                >
                  <Download size={16} /> Download QR
                </button>
              </>
            )}

            {/* Scan Race QR Tab */}
            {qrModalTab === "scan" && (
              <div style={{ width: "100%", textAlign: "center" }}>
                <h2 className="qr-fullscreen-title">Scan Race QR</h2>
                <p className="qr-fullscreen-subtitle">
                  Point your camera at the race QR code the admin is showing to check in and earn points.
                </p>

                {/* Scan result states */}
                {scanResult?.status === "success" && (
                  <div className="qr-scan-result qr-scan-success">
                    <CheckCircle size={40} style={{ color: "var(--lrc-teal)", margin: "0 auto 12px", display: "block" }} />
                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>You're Confirmed! 🎉</div>
                    <div style={{ fontSize: 14, color: "var(--lrc-text-secondary)", marginBottom: 4 }}>{scanResult.raceName}</div>
                    {scanResult.points > 0 && (
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--lrc-orange)" }}>+{scanResult.points} points earned!</div>
                    )}
                    <button
                      className="btn-secondary"
                      style={{ marginTop: 16 }}
                      onClick={() => { setScanResult(null); }}
                    >
                      Scan Another
                    </button>
                  </div>
                )}

                {scanResult?.status === "duplicate" && (
                  <div className="qr-scan-result qr-scan-warning">
                    <CheckCircle size={40} style={{ color: "var(--lrc-orange)", margin: "0 auto 12px", display: "block" }} />
                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Already Confirmed!</div>
                    <div style={{ fontSize: 14, color: "var(--lrc-text-secondary)" }}>You're already checked in to {scanResult.raceName}. No duplicate points awarded.</div>
                    <button
                      className="btn-secondary"
                      style={{ marginTop: 16 }}
                      onClick={() => { setScanResult(null); }}
                    >
                      OK
                    </button>
                  </div>
                )}

                {scanResult?.status === "error" && (
                  <div className="qr-scan-result qr-scan-error">
                    <XCircle size={40} style={{ color: "var(--lrc-pink)", margin: "0 auto 12px", display: "block" }} />
                    <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 6 }}>Couldn't Scan</div>
                    <div style={{ fontSize: 14, color: "var(--lrc-text-secondary)" }}>{scanResult.message}</div>
                    <button
                      className="btn-secondary"
                      style={{ marginTop: 16 }}
                      onClick={() => { setScanResult(null); }}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {scanResult?.status === "loading" && (
                  <div style={{ padding: "24px 0", color: "var(--lrc-text-secondary)", fontSize: 14 }}>Confirming attendance...</div>
                )}

                {/* Camera scanner */}
                {!scanResult && !scanning && (
                  <button
                    className="btn-primary"
                    style={{ marginTop: 8, fontSize: 15, padding: "12px 28px" }}
                    onClick={() => setScanning(true)}
                  >
                    <Scan size={18} /> Start Camera
                  </button>
                )}

                {!scanResult && scanning && (
                  <>
                    <div
                      id="runner-qr-reader"
                      ref={scannerRef}
                      style={{ margin: "12px auto 0", maxWidth: 300 }}
                    />
                    <button
                      className="btn-secondary"
                      style={{ marginTop: 12 }}
                      onClick={() => { setScanning(false); stopScanner(); }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Admin Hub Tab */}
            {qrModalTab === "admin" && userProfile?.isAdmin && (
              <div style={{ width: "100%", textAlign: "center", paddingBottom: "20px" }}>
                <h2 className="qr-fullscreen-title">Admin Hub</h2>
                <p className="qr-fullscreen-subtitle">
                  Quick access to race management and scanning runners.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "24px" }}>
                  <button 
                    className="btn-primary" 
                    style={{ padding: "14px", fontSize: "15px", display: "flex", justifyContent: "center", gap: "8px" }}
                    onClick={() => { closeQrModal(); navigate('/admin/attendance'); }}
                  >
                    <Scan size={20} /> Scan Runners
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{ padding: "14px", fontSize: "15px", display: "flex", justifyContent: "center", gap: "8px" }}
                    onClick={() => { closeQrModal(); navigate('/admin/races'); }}
                  >
                    <Trophy size={20} /> Create New Race
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
