import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/config";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../../firebase/config";
import { getPastUserRuns, disconnectStrava, getAttendedRaces } from "../../services/firestoreService";
import QRCode from "react-qr-code";
import {
  User,
  Camera,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Award,
  CheckCircle,
  Download,
  Trophy,
  RefreshCw,
  Unlink,
  Activity,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const CITY_OPTIONS = [
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const RUNNING_LEVELS = [
  { max: 20, label: "Novice", color: "var(--lrc-teal)" },
  { max: 40, label: "Casual", color: "var(--lrc-olive)" },
  { max: 60, label: "Active", color: "var(--lrc-orange)" },
  { max: 80, label: "Advanced", color: "var(--lrc-purple)" },
  { max: 100, label: "Elite", color: "var(--lrc-pink)" },
];

function getLevelInfo(levelValue) {
  const value = typeof levelValue === "number" ? levelValue : Number(levelValue) || 50;
  return RUNNING_LEVELS.find((l) => value <= l.max) || RUNNING_LEVELS[4];
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

export default function ProfilePage() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: userProfile?.firstName || "",
    lastName: userProfile?.lastName || "",
    city: userProfile?.city || "new_york",
    runningLevel: userProfile?.runningLevel || 50,
  });

  const [pastRuns, setPastRuns] = useState([]);
  const [attendedRaces, setAttendedRaces] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(true);

  const [stravaActivities, setStravaActivities] = useState([]);
  const [stravaLiveStats, setStravaLiveStats] = useState(null);
  const [loadingStrava, setLoadingStrava] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  useEffect(() => {
    async function fetchPastRuns() {
      if (!currentUser?.uid) return;
      try {
        const [runs, races] = await Promise.all([
          getPastUserRuns(currentUser.uid),
          getAttendedRaces(currentUser.uid)
        ]);
        setPastRuns(runs);
        setAttendedRaces(races);
      } catch (err) {
        console.error("Failed to fetch past runs", err);
      } finally {
        setLoadingRuns(false);
      }
    }
    fetchPastRuns();
  }, [currentUser]);

  useEffect(() => {
    if (userProfile?.stravaConnected && userProfile?.stravaAccessToken) {
      fetchStravaData(userProfile.stravaAccessToken);
    }
  }, [userProfile?.stravaConnected]);

  async function ensureValidToken() {
    const expiresAt = userProfile?.stravaTokenExpiresAt;
    const now = Math.floor(Date.now() / 1000);
    if (expiresAt && now >= expiresAt - 60) {
      const fns = getFunctions(app);
      await httpsCallable(fns, "stravaRefresh")({ uid: currentUser.uid });
    }
    return userProfile?.stravaAccessToken;
  }

  async function fetchStravaData(token) {
    if (!token) return;
    setLoadingStrava(true);
    try {
      const accessToken = token || (await ensureValidToken());
      const headers = { Authorization: `Bearer ${accessToken}` };

      const [athleteRes, activitiesRes] = await Promise.all([
        fetch("https://www.strava.com/api/v3/athlete/stats?" +
          `id=${userProfile?.stravaAthleteId}`, { headers }),
        fetch("https://www.strava.com/api/v3/athlete/activities?per_page=10&type=Run", { headers }),
      ]);

      if (athleteRes.ok) {
        const stats = await athleteRes.json();
        const totals = stats.all_run_totals || {};
        setStravaLiveStats({
          activities: totals.count || 0,
          totalKm: Math.round((totals.distance || 0) / 1000),
          avgPace: totals.elapsed_time && totals.distance
            ? formatPace(totals.elapsed_time, totals.distance)
            : "—",
        });
      }

      if (activitiesRes.ok) {
        const acts = await activitiesRes.json();
        setStravaActivities(Array.isArray(acts) ? acts.slice(0, 10) : []);
      }
    } catch (err) {
      console.error("Strava fetch error:", err);
    } finally {
      setLoadingStrava(false);
    }
  }

  function formatPace(elapsedSeconds, distanceMeters) {
    if (!distanceMeters) return "—";
    const paceSecondsPerKm = (elapsedSeconds / distanceMeters) * 1000;
    const mins = Math.floor(paceSecondsPerKm / 60);
    const secs = Math.round(paceSecondsPerKm % 60);
    return `${mins}:${String(secs).padStart(2, "0")} /km`;
  }

  const handleStravaRefresh = async () => {
    const token = await ensureValidToken();
    await fetchStravaData(token);
    toast.success("Strava data refreshed!");
  };

  const handleStravaDisconnect = async () => {
    if (!window.confirm("Disconnect your Strava account?")) return;
    setDisconnecting(true);
    try {
      await disconnectStrava(currentUser.uid);
      await updateUserProfile({
        stravaConnected: false,
        stravaAthleteId: null,
        stravaAccessToken: null,
        stravaRefreshToken: null,
        stravaTokenExpiresAt: null,
        stravaActivities: 0,
        stravaTotalKm: 0,
        stravaAvgPace: "—",
      });
      setStravaActivities([]);
      setStravaLiveStats(null);
      toast.success("Strava disconnected.");
    } catch (err) {
      toast.error("Failed to disconnect Strava");
      console.error(err);
    } finally {
      setDisconnecting(false);
    }
  };

  const firstName =
    userProfile?.firstName ||
    currentUser?.displayName?.split(" ")[0] ||
    "Runner";
  const lastName = userProfile?.lastName || "";
  const photoURL = userProfile?.photoURL || currentUser?.photoURL;
  const initials = getInitials(firstName, lastName);
  const avatarColor = getAvatarColor(firstName);

  const handleEdit = () => {
    setFormData({
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
      city: userProfile?.city || "new_york",
      runningLevel: userProfile?.runningLevel || 50,
    });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(formData);
      setEditing(false);
      toast.success("Profile updated! 🎉");
    } catch (err) {
      toast.error("Failed to update profile");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile-photos/${currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: downloadURL });
      toast.success("Profile photo updated! 📸");
    } catch (err) {
      toast.error("Failed to upload photo");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleStravaConnect = () => {
    const clientId = import.meta.env.VITE_STRAVA_CLIENT_ID;
    if (!clientId) {
      toast.error(
        "Strava integration not configured yet. Add VITE_STRAVA_CLIENT_ID to .env",
      );
      return;
    }
    const redirectUri = `${window.location.origin}/strava-callback`;
    const scope = "read,activity:read_all";
    const url = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("user-qr-code");
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
      a.download = `lrc-qr-${currentUser?.uid?.slice(0, 8)}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
  };

  const joinedDate = userProfile?.joinedAt?.toDate?.()
    ? format(userProfile.joinedAt.toDate(), "MMMM yyyy")
    : "Recently";

  const cityLabel =
    CITY_OPTIONS.find((c) => c.value === (userProfile?.city || "new_york"))
      ?.label || "Unknown";

  return (
    <div>
      <h1 className="page-title">
        <User
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-teal)",
          }}
        />
        My Profile
      </h1>
      <p className="page-subtitle">
        Manage your profile, connect Strava, and track your journey.
      </p>

      {/* Profile Header */}
      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="profile-header">
          <div
            className="profile-avatar-large"
            style={{ background: photoURL ? "transparent" : avatarColor }}
            onClick={() => fileInputRef.current?.click()}
          >
            {photoURL ? <img src={photoURL} alt={firstName} /> : initials}
            <div className="profile-avatar-upload">
              {uploading ? "..." : <Camera size={24} />}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="profile-info">
            <h2>
              {firstName} {lastName}
            </h2>
            <p>
              <MapPin
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />
              {cityLabel} • Member since {joinedDate}
            </p>
            <div style={{ marginTop: 8 }}>
              <span style={{ 
                background: getLevelInfo(userProfile?.runningLevel).color,
                color: "white",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {getLevelInfo(userProfile?.runningLevel).label}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        {/* Personal Info Section */}
        <div className="dash-card">
          <div className="profile-section">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0, border: "none", padding: 0 }}>
                Personal Information
              </h3>
              {!editing ? (
                <button
                  className="btn-secondary"
                  onClick={handleEdit}
                  style={{ padding: "6px 14px", fontSize: 13 }}
                >
                  <Edit3 size={14} /> Edit
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={saving}
                    style={{ padding: "6px 14px", fontSize: 13 }}
                  >
                    <Save size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleCancel}
                    style={{
                      padding: "6px 14px",
                      fontSize: 13,
                      borderColor: "var(--lrc-pink)",
                      color: "var(--lrc-pink)",
                    }}
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form-grid">
              <div className="profile-form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={
                    editing ? formData.firstName : userProfile?.firstName || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!editing}
                />
              </div>
              <div className="profile-form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={
                    editing ? formData.lastName : userProfile?.lastName || ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!editing}
                />
              </div>
              <div className="profile-form-group">
                <label>Email</label>
                <input type="email" value={currentUser?.email || ""} disabled />
              </div>
              <div className="profile-form-group">
                <label>City Chapter</label>
                <select
                  value={
                    editing ? formData.city : userProfile?.city || "new_york"
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  disabled={!editing}
                >
                  {CITY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Running Level Section */}
            <div style={{ marginTop: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "var(--lrc-text-secondary)", textTransform: "uppercase" }}>
                Running Level
              </label>
              {!editing ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 8, background: "var(--lrc-border)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ 
                      width: `${userProfile?.runningLevel || 50}%`, 
                      height: "100%", 
                      background: getLevelInfo(userProfile?.runningLevel).color,
                      transition: "width 0.3s ease"
                    }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: getLevelInfo(userProfile?.runningLevel).color, minWidth: 70 }}>
                    {getLevelInfo(userProfile?.runningLevel).label}
                  </span>
                </div>
              ) : (
                <div style={{ padding: "0 8px" }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={formData.runningLevel}
                    onChange={(e) => setFormData((prev) => ({ ...prev, runningLevel: e.target.value }))}
                    style={{
                      width: "100%",
                      accentColor: getLevelInfo(formData.runningLevel).color,
                      cursor: "pointer",
                      height: 6
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--lrc-text-muted)" }}>
                    <span>Novice</span>
                    <span style={{ fontWeight: 600, color: getLevelInfo(formData.runningLevel).color }}>
                      {getLevelInfo(formData.runningLevel).label}
                    </span>
                    <span>Elite</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats + QR Code Section */}
        <div className="dash-card">
          <div className="profile-section">
            <h3>Your Stats</h3>
            <div
              className="stats-strip"
              style={{ gridTemplateColumns: "1fr 1fr 1fr", margin: "0 0 20px" }}
            >
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--lrc-teal-light)", color: "var(--lrc-teal)" }}>
                  <CheckCircle size={20} />
                </div>
                <div className="stat-value">{userProfile?.runsAttended || 0}</div>
                <div className="stat-label">Runs Attended</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--lrc-orange-light)", color: "var(--lrc-orange)" }}>
                  <Award size={20} />
                </div>
                <div className="stat-value">{userProfile?.totalDistanceKm || 0}</div>
                <div className="stat-label">KM Logged</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: "var(--lrc-purple-light)", color: "var(--lrc-purple)" }}>
                  <Trophy size={20} />
                </div>
                <div className="stat-value">{userProfile?.totalPoints || 0}</div>
                <div className="stat-label">Points</div>
              </div>
            </div>

            <h3 style={{ marginTop: 8 }}>My QR Code</h3>
            <p style={{ fontSize: 13, color: "var(--lrc-text-secondary)", marginBottom: 16 }}>
              Show this at races for the admin to scan and confirm your attendance.
            </p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
              <div className="qr-code-wrapper" style={{ padding: 20, background: "white", borderRadius: 12, border: "1px solid var(--lrc-border)" }}>
                <QRCode id="user-qr-code" value={currentUser?.uid || "unknown"} size={160} />
              </div>
              <button className="btn-secondary" onClick={handleDownloadQR} style={{ fontSize: 13, padding: "8px 18px" }}>
                <Download size={14} /> Download QR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trophy Case Section (Attended Races) */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="profile-section">
          <h3>Trophy Case <Trophy size={20} style={{ display: "inline", verticalAlign: "bottom", marginLeft: 8, color: "var(--lrc-orange)" }} /></h3>
          <p style={{ fontSize: 13, color: "var(--lrc-text-secondary)", marginBottom: 16 }}>
            Races you've officially run with Latin Run Club.
          </p>
          {loadingRuns ? (
            <p style={{ color: "var(--lrc-text-muted)" }}>Loading trophies...</p>
          ) : attendedRaces.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">🏅</div>
              <h3>No races yet</h3>
              <p>Attend an official race and have the admin scan your QR to earn trophies and points.</p>
            </div>
          ) : (
            <div className="run-history-list" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {attendedRaces.map((race) => (
                <div key={race.id} className="run-item" style={{ borderBottom: "1px solid var(--lrc-border)", paddingBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
                  <div className="run-date-badge" style={{ background: "var(--lrc-orange-light)", color: "var(--lrc-orange)" }}>
                    <span className="run-date-month">{race.date?.toDate ? format(race.date.toDate(), "MMM") : "---"}</span>
                    <span className="run-date-day">{race.date?.toDate ? format(race.date.toDate(), "d") : "--"}</span>
                  </div>
                  <div className="run-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--lrc-orange)" }}>{race.name}</h4>
                    <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", color: "var(--lrc-text-secondary)" }}>
                      <MapPin size={12} style={{ marginRight: 4, display: "inline" }} />
                      {race.location}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", fontWeight: "bold", color: "var(--lrc-orange)" }}>
                    +{race.pointValue || 0} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Past Runs Section */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="profile-section">
          <h3>Run History</h3>
          {loadingRuns ? (
            <p style={{ color: "var(--lrc-text-muted)" }}>
              Loading past runs...
            </p>
          ) : pastRuns.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">📅</div>
              <h3>No past runs</h3>
              <p>
                You haven't attended any runs yet. Sign up for an upcoming run!
              </p>
            </div>
          ) : (
            <div
              className="run-history-list"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              {pastRuns.map((run) => (
                <div
                  key={run.id}
                  className="run-item"
                  style={{
                    borderBottom: "1px solid var(--lrc-border)",
                    paddingBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <div className="run-date-badge">
                    <span className="run-date-month">
                      {run.date?.toDate
                        ? format(run.date.toDate(), "MMM")
                        : "---"}
                    </span>
                    <span className="run-date-day">
                      {run.date?.toDate ? format(run.date.toDate(), "d") : "--"}
                    </span>
                  </div>
                  <div className="run-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: "1rem" }}>
                      {run.location || "Group Run"}
                    </h4>
                    <p
                      style={{
                        margin: 0,
                        marginTop: 4,
                        display: "flex",
                        gap: "12px",
                        color: "var(--lrc-text-secondary)",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span>
                        <MapPin
                          size={12}
                          style={{ display: "inline", marginRight: 4 }}
                        />
                        {run.distanceKm || 0} km
                      </span>
                      <span>
                        <Calendar
                          size={12}
                          style={{ display: "inline", marginRight: 4 }}
                        />
                        {run.time || "TBD"}
                      </span>
                    </p>
                  </div>
                  <div
                    className="run-status"
                    style={{
                      color: "var(--lrc-teal)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <CheckCircle size={14} /> Completed
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strava Integration */}
      <div className="dash-card" style={{ marginTop: 24 }}>
        <div className="profile-section" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, border: "none", padding: 0 }}>Strava Integration</h3>
            {userProfile?.stravaConnected && (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-secondary"
                  onClick={handleStravaRefresh}
                  disabled={loadingStrava}
                  style={{ padding: "6px 12px", fontSize: 13 }}
                >
                  <RefreshCw size={13} /> {loadingStrava ? "Loading..." : "Refresh"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleStravaDisconnect}
                  disabled={disconnecting}
                  style={{ padding: "6px 12px", fontSize: 13, borderColor: "var(--lrc-pink)", color: "var(--lrc-pink)" }}
                >
                  <Unlink size={13} /> {disconnecting ? "..." : "Disconnect"}
                </button>
              </div>
            )}
          </div>

          {userProfile?.stravaConnected ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--lrc-olive)" }}>
                <CheckCircle size={16} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Connected to Strava</span>
              </div>
              <div className="strava-stats-grid">
                <div className="stat-card">
                  <div className="stat-value">
                    {stravaLiveStats?.activities ?? userProfile?.stravaActivities ?? 0}
                  </div>
                  <div className="stat-label">Activities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {stravaLiveStats?.totalKm ?? userProfile?.stravaTotalKm ?? 0}
                  </div>
                  <div className="stat-label">Total KM</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {stravaLiveStats?.avgPace ?? userProfile?.stravaAvgPace ?? "—"}
                  </div>
                  <div className="stat-label">Avg Pace</div>
                </div>
              </div>

              {/* Competitive Stats (Personal Bests) */}
              {stravaActivities.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} style={{ color: "var(--lrc-pink)" }} />
                    Estimated Personal Bests
                  </h4>
                  <div className="stats-strip" style={{ gridTemplateColumns: "1fr 1fr", margin: 0 }}>
                    {(() => {
                      // Estimate best 5K and 10K from recent runs
                      let best5k = null;
                      let best10k = null;

                      stravaActivities.forEach(act => {
                        const dist = act.distance || 0;
                        const time = act.moving_time || 0;
                        if (!time || !dist) return;

                        const pace = (time / dist) * 1000; // seconds per km
                        
                        // Roughly 5K (4.8 - 5.5 km)
                        if (dist >= 4800 && dist <= 5500) {
                          if (!best5k || pace < best5k.pace) best5k = { pace, time };
                        }
                        // Roughly 10K (9.8 - 10.5 km)
                        if (dist >= 9800 && dist <= 10500) {
                          if (!best10k || pace < best10k.pace) best10k = { pace, time };
                        }
                      });

                      const formatTime = (seconds) => {
                        const m = Math.floor(seconds / 60);
                        const s = Math.round(seconds % 60);
                        return `${m}:${String(s).padStart(2, '0')}`;
                      };

                      return (
                        <>
                          <div className="stat-card" style={{ padding: "16px 12px" }}>
                            <div className="stat-label" style={{ marginBottom: 8 }}>Fastest 5K</div>
                            <div className="stat-value" style={{ fontSize: 20 }}>
                              {best5k ? formatTime(best5k.time) : "—"}
                            </div>
                          </div>
                          <div className="stat-card" style={{ padding: "16px 12px" }}>
                            <div className="stat-label" style={{ marginBottom: 8 }}>Fastest 10K</div>
                            <div className="stat-value" style={{ fontSize: 20 }}>
                              {best10k ? formatTime(best10k.time) : "—"}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Recent Strava Runs */}
              {stravaActivities.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ margin: "0 0 12px", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                    <Activity size={16} style={{ color: "var(--lrc-orange)" }} />
                    Recent Strava Runs
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {stravaActivities.map((act) => {
                      const distKm = ((act.distance || 0) / 1000).toFixed(1);
                      const pace = act.moving_time && act.distance
                        ? formatPace(act.moving_time, act.distance)
                        : "—";
                      const elevGain = act.total_elevation_gain
                        ? `${Math.round(act.total_elevation_gain)}m`
                        : null;
                      const dateStr = act.start_date_local
                        ? format(new Date(act.start_date_local), "MMM d, yyyy")
                        : "";
                      return (
                        <div
                          key={act.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "10px 12px",
                            background: "var(--lrc-bg)",
                            borderRadius: "var(--lrc-radius-md)",
                            fontSize: 13,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: "var(--lrc-text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {act.name || "Run"}
                            </div>
                            <div style={{ color: "var(--lrc-text-muted)", fontSize: 12 }}>{dateStr}</div>
                          </div>
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            <div style={{ fontWeight: 700, color: "var(--lrc-teal)" }}>{distKm} km</div>
                            <div style={{ color: "var(--lrc-text-secondary)", fontSize: 12 }}>{pace}{elevGain ? ` · ↑${elevGain}` : ""}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {loadingStrava && stravaActivities.length === 0 && (
                <p style={{ color: "var(--lrc-text-muted)", fontSize: 13, marginTop: 16 }}>
                  Loading Strava data...
                </p>
              )}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ color: "var(--lrc-text-secondary)", marginBottom: 16, fontSize: 14 }}>
                Connect your Strava account to automatically sync your running data and see detailed stats.
              </p>
              <button className="strava-connect-btn" onClick={handleStravaConnect}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Connect with Strava
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
