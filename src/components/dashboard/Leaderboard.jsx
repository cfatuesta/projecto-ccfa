import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLeaderboard } from "../../services/firestoreService";
import { Trophy, MapPin, Medal } from "lucide-react";

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

const CITY_OPTIONS = [
  { value: "", label: "All Cities" },
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

const PODIUM_STYLES = [
  { label: "1st", bg: "linear-gradient(135deg, #f59e0b, #d97706)", emoji: "🥇", size: 80 },
  { label: "2nd", bg: "linear-gradient(135deg, #9ca3af, #6b7280)", emoji: "🥈", size: 68 },
  { label: "3rd", bg: "linear-gradient(135deg, #cd7c2f, #b45309)", emoji: "🥉", size: 60 },
];

export default function Leaderboard() {
  const { currentUser } = useAuth();
  const [allLeaders, setAllLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");

  // Load all leaders once, filter client-side to avoid composite index issues
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getLeaderboard();
        setAllLeaders(data);
      } catch (err) {
        console.error("Leaderboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Client-side filter
  const leaders = filterCity
    ? allLeaders.filter((m) => m.city === filterCity)
    : allLeaders;

  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%", marginBottom: 24 }} />
        <div className="skeleton skeleton-card" style={{ height: 180, marginBottom: 16 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div className="skeleton skeleton-card" key={i} style={{ height: 60, marginBottom: 10 }} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">
        <Trophy size={24} style={{ display: "inline", verticalAlign: "middle", marginRight: 8, color: "var(--lrc-orange)" }} />
        Leaderboard
      </h1>
      <p className="page-subtitle">
        Points earned by completing races. Show up, scan in, and climb the ranks. ¡Arriba!
      </p>

      {/* City Filter */}
      <div className="filter-chips-container" style={{ marginBottom: 24 }}>
        <div className="filter-chips-bar">
          {CITY_OPTIONS.map((c) => (
            <button
              key={c.value}
              className={`filter-chip ${filterCity === c.value ? "active" : ""}`}
              onClick={() => setFilterCity(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {leaders.length === 0 ? (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-state-emoji">🏆</div>
            <h3>No runners yet</h3>
            <p>Be the first to earn points by attending a race!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Podium */}
          {topThree.length > 0 && (
            <div className="dash-card" style={{ marginBottom: 24 }}>
              <div className="leaderboard-podium">
                {/* Render 2nd, 1st, 3rd */}
                {[1, 0, 2].map((idx) => {
                  const entry = topThree[idx];
                  if (!entry) return null;
                  const style = PODIUM_STYLES[idx];
                  const initials = getInitials(entry.firstName, entry.lastName);
                  const avatarColor = getAvatarColor(entry.firstName);
                  const isCurrentUser = entry.id === currentUser?.uid;
                  return (
                    <div key={entry.id} className={`podium-entry podium-${idx + 1}`}>
                      <div className="podium-emoji">{style.emoji}</div>
                      <div
                        className="podium-avatar"
                        style={{
                          width: style.size,
                          height: style.size,
                          background: entry.photoURL ? "transparent" : avatarColor,
                          border: isCurrentUser ? "3px solid var(--lrc-teal)" : "none",
                        }}
                      >
                        {entry.photoURL ? (
                          <img src={entry.photoURL} alt={entry.firstName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        ) : initials}
                      </div>
                      <div className="podium-name">
                        {entry.firstName} {entry.lastName}
                        {isCurrentUser && <span style={{ color: "var(--lrc-teal)", fontSize: 11, display: "block" }}>you</span>}
                      </div>
                      <div className="podium-points">{entry.totalPoints || 0} pts</div>
                      <div className="podium-city">
                        <MapPin size={11} /> {CITY_NAMES[entry.city] || entry.city}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full ranked list */}
          {rest.length > 0 && (
            <div className="dash-card">
              <div className="dash-card-header">
                <span className="dash-card-title">Full Rankings</span>
                <span className="dash-card-badge" style={{ background: "var(--lrc-orange-light)", color: "var(--lrc-orange)" }}>
                  <Medal size={11} style={{ display: "inline", marginRight: 4 }} />
                  {leaders.length} runners
                </span>
              </div>
              <ul className="leaderboard-list">
                {rest.map((entry, i) => {
                  const rank = i + 4;
                  const initials = getInitials(entry.firstName, entry.lastName);
                  const avatarColor = getAvatarColor(entry.firstName);
                  const isCurrentUser = entry.id === currentUser?.uid;
                  return (
                    <li key={entry.id} className={`leaderboard-item ${isCurrentUser ? "leaderboard-you" : ""}`}>
                      <div className="leaderboard-rank">{rank}</div>
                      <div
                        className="member-avatar"
                        style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0, background: entry.photoURL ? "transparent" : avatarColor }}
                      >
                        {entry.photoURL ? (
                          <img src={entry.photoURL} alt={entry.firstName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        ) : initials}
                      </div>
                      <div className="leaderboard-name">
                        {entry.firstName} {entry.lastName}
                        {isCurrentUser && <span style={{ color: "var(--lrc-teal)", fontSize: 11, marginLeft: 6 }}>you</span>}
                        <div style={{ fontSize: 11, color: "var(--lrc-text-muted)", marginTop: 1 }}>
                          <MapPin size={10} style={{ display: "inline" }} /> {CITY_NAMES[entry.city] || entry.city}
                        </div>
                      </div>
                      <div className="leaderboard-value">{entry.totalPoints || 0} pts</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
