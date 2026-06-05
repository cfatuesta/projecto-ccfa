import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getCityMembers,
  subscribeToCityRuns,
  toggleRunRSVP,
  getCityInfo,
} from "../../services/firestoreService";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Award,
  LayoutGrid,
  List,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

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
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function getInitials(firstName, lastName) {
  return ((firstName?.[0] || "") + (lastName?.[0] || "")).toUpperCase() || "?";
}

function getPaceBadgeStyle(pace) {
  switch (pace) {
    case "easy":
      return {
        background: "var(--lrc-olive-light)",
        color: "var(--lrc-olive)",
      };
    case "moderate":
      return {
        background: "var(--lrc-orange-light)",
        color: "var(--lrc-orange)",
      };
    case "fast":
      return { background: "var(--lrc-pink-light)", color: "var(--lrc-pink)" };
    default:
      return { background: "var(--lrc-teal-light)", color: "var(--lrc-teal)" };
  }
}

export default function CityPage() {
  const { currentUser, userProfile } = useAuth();
  const city = userProfile?.city || "new_york";

  const [members, setMembers] = useState([]);
  const [runs, setRuns] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState({});

  useEffect(() => {
    let unsubRuns;

    async function load() {
      try {
        const [cityMembers, info] = await Promise.all([
          getCityMembers(city),
          getCityInfo(city),
        ]);
        setMembers(cityMembers);
        setCityInfo(info);

        unsubRuns = subscribeToCityRuns(city, (cityRuns) => {
          setRuns(cityRuns);
        });
      } catch (err) {
        console.error("City page load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      if (unsubRuns) unsubRuns();
    };
  }, [city]);

  const handleRSVP = useCallback(
    async (runId) => {
      if (rsvpLoading[runId]) return;
      setRsvpLoading((prev) => ({ ...prev, [runId]: true }));
      try {
        const added = await toggleRunRSVP(runId, currentUser.uid);
        setRuns((prev) =>
          prev.map((r) => {
            if (r.id !== runId) return r;
            const rsvps = r.rsvps || [];
            return {
              ...r,
              rsvps: added
                ? [...rsvps, currentUser.uid]
                : rsvps.filter((id) => id !== currentUser.uid),
            };
          }),
        );
        toast.success(added ? "¡Vamos! You're in! 🏃" : "RSVP removed");
      } catch (err) {
        toast.error("Couldn't update RSVP");
      } finally {
        setRsvpLoading((prev) => ({ ...prev, [runId]: false }));
      }
    },
    [currentUser, rsvpLoading],
  );

  const filteredMembers = members.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
    return name.includes(q);
  });

  // Sort members by runsAttended for leaderboard
  const leaderboard = [...members]
    .sort((a, b) => (b.runsAttended || 0) - (a.runsAttended || 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%" }}></div>
        <div
          className="skeleton skeleton-card"
          style={{ height: 200, marginTop: 16 }}
        ></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">
        <MapPin
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-teal)",
          }}
        />
        {CITY_NAMES[city] || city} Chapter
      </h1>
      <p className="page-subtitle">
        {cityInfo?.description ||
          `Welcome to the ${CITY_NAMES[city]} chapter of Latin Run Club.`}
      </p>

      {/* ─── Upcoming Runs ─── */}
      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="dash-card-header">
          <span className="dash-card-title">Upcoming Runs</span>
          <span
            className="dash-card-badge"
            style={{
              background: "var(--lrc-teal-light)",
              color: "var(--lrc-teal)",
            }}
          >
            {runs.length} scheduled
          </span>
        </div>

        {runs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-emoji">🏃‍♂️</div>
            <h3>No runs scheduled yet</h3>
            <p>Stay tuned — new group runs are coming soon!</p>
          </div>
        ) : (
          runs.map((run) => {
            const isRsvpd = run.rsvps?.includes(currentUser?.uid);
            const runDate = run.date?.toDate?.();
            return (
              <div className="run-item" key={run.id}>
                <div className="run-date-badge">
                  <span className="run-date-month">
                    {runDate ? format(runDate, "MMM") : "---"}
                  </span>
                  <span className="run-date-day">
                    {runDate ? format(runDate, "d") : "--"}
                  </span>
                </div>
                <div className="run-info">
                  <h4>{run.location || "Group Run"}</h4>
                  <p>
                    <span>
                      <Clock size={12} /> {run.time || "TBD"}
                    </span>
                    <span>
                      <Users size={12} /> {run.rsvps?.length || 0} going
                    </span>
                    {run.paceGroup && (
                      <span
                        className="run-pace-badge"
                        style={getPaceBadgeStyle(run.paceGroup)}
                      >
                        {run.paceGroup}
                      </span>
                    )}
                  </p>
                </div>
                <button
                  className={`rsvp-btn-card ${isRsvpd ? "rsvp-active" : ""}`}
                  onClick={() => handleRSVP(run.id)}
                  disabled={rsvpLoading[run.id]}
                >
                  <CheckCircle size={14} />
                  {isRsvpd ? "Going ✓" : "I'm in!"}
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="dash-grid">
        {/* ─── Members Directory ─── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Members</span>
            <span
              className="dash-card-badge"
              style={{
                background: "var(--lrc-purple-light)",
                color: "var(--lrc-purple)",
                marginRight: "auto"
              }}
            >
              {members.length}
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                onClick={() => setViewMode("grid")}
                style={{ 
                  background: viewMode === "grid" ? "var(--lrc-teal-light)" : "transparent",
                  color: viewMode === "grid" ? "var(--lrc-teal)" : "var(--lrc-text-muted)",
                  border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center"
                }}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                style={{ 
                  background: viewMode === "list" ? "var(--lrc-teal-light)" : "transparent",
                  color: viewMode === "list" ? "var(--lrc-teal)" : "var(--lrc-text-muted)",
                  border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center"
                }}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>

          <div className="dash-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredMembers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">👀</div>
              <h3>No members found</h3>
              <p>
                {searchQuery
                  ? "Try a different search."
                  : "Be the first to join!"}
              </p>
            </div>
          ) : (
            <div className={viewMode === "grid" ? "member-grid" : "member-list"}>
              {filteredMembers.map((member) => (
                <div className={viewMode === "grid" ? "member-card" : "member-list-item"} key={member.id}>
                  <div
                    className="member-avatar"
                    style={{ background: getAvatarColor(member.firstName) }}
                  >
                    {member.photoURL ? (
                      <img src={member.photoURL} alt={member.firstName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      getInitials(member.firstName, member.lastName)
                    )}
                  </div>
                  <div className="member-name" style={{ fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {member.firstName} {member.lastName || ""}
                  </div>
                  <div className="member-stat">
                    <Trophy size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 4, color: "var(--lrc-orange)" }} />
                    {member.totalPoints || 0} pts
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── Leaderboard ─── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">
              <Award
                size={18}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                  color: "var(--lrc-orange)",
                }}
              />
              Leaderboard
            </span>
            <span
              className="dash-card-badge"
              style={{
                background: "var(--lrc-orange-light)",
                color: "var(--lrc-orange)",
              }}
            >
              This Month
            </span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-emoji">🏆</div>
              <h3>No data yet</h3>
              <p>Start running to climb the leaderboard!</p>
            </div>
          ) : (
            <ul className="leaderboard-list">
              {leaderboard.map((member, i) => (
                <li className="leaderboard-item" key={member.id}>
                  <div
                    className={`leaderboard-rank ${i < 3 ? `rank-${i + 1}` : ""}`}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="member-avatar"
                    style={{
                      background: getAvatarColor(member.firstName),
                      width: 36,
                      height: 36,
                      fontSize: 14,
                      margin: 0,
                    }}
                  >
                    {getInitials(member.firstName, member.lastName)}
                  </div>
                  <span className="leaderboard-name" style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {member.firstName} {member.lastName || ""}
                  </span>
                  <span className="leaderboard-value">
                    {member.runsAttended || 0} runs
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
