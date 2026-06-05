import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getNextRun,
  toggleRunRSVP,
  subscribeToActivityFeed,
  getCityMembers,
  getLeaderboard,
  getUserNextRace,
} from "../../services/firestoreService";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Flame,
  CheckCircle,
  UserPlus,
  Trophy,
  Timer,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";
import toast from "react-hot-toast";

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

const MOTIVATIONAL_QUOTES = [
  "🏃 Every mile is a victory. Keep pushing, familia!",
  "💪 Run with heart, finish with pride. ¡Vamos!",
  "🔥 The only bad run is the one you didn't take.",
  "🌎 One community, many cities, one pace — forward.",
  "⚡ Lace up, show up, never give up. That's the LRC way.",
];

function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[
    Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
  ];
}

// ─── Countdown Timer Component ──────────────────────────────
function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    function update() {
      const now = new Date();
      const target =
        targetDate instanceof Date ? targetDate : targetDate.toDate();
      const hours = differenceInHours(target, now);
      const mins = differenceInMinutes(target, now) % 60;
      const secs = differenceInSeconds(target, now) % 60;

      if (hours < 0) {
        setTimeLeft("Starting now!");
        setIsUrgent(true);
        return;
      }

      if (hours < 1) {
        setTimeLeft(`${mins}m ${secs}s`);
        setIsUrgent(true);
      } else if (hours < 48) {
        setTimeLeft(`${hours}h ${mins}m`);
        setIsUrgent(hours < 2);
      } else {
        setTimeLeft("");
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <span className={`next-run-countdown ${isUrgent ? "countdown-pulse" : ""}`}>
      <Timer size={14} />
      {timeLeft}
    </span>
  );
}

// ─── Stats Strip Component ──────────────────────────────────
function StatsStrip({ userProfile, memberCount }) {
  const stats = [
    {
      icon: <Users size={20} />,
      value: memberCount || 0,
      label: "City Members",
      color: "var(--lrc-teal)",
      bg: "var(--lrc-teal-light)",
    },
    {
      icon: <CheckCircle size={20} />,
      value: userProfile?.runsAttended || 0,
      label: "Runs Attended",
      color: "var(--lrc-orange)",
      bg: "var(--lrc-orange-light)",
    },
    {
      icon: <TrendingUp size={20} />,
      value: userProfile?.totalDistanceKm
        ? `${userProfile.totalDistanceKm}`
        : "0",
      label: "KM Logged",
      color: "var(--lrc-purple)",
      bg: "var(--lrc-purple-light)",
    },
    {
      icon: <Flame size={20} />,
      value: userProfile?.runsAttended
        ? Math.min(userProfile.runsAttended, 7)
        : 0,
      label: "Week Streak",
      color: "var(--lrc-pink)",
      bg: "var(--lrc-pink-light)",
    },
  ];

  return (
    <div className="stats-strip">
      {stats.map((s, i) => (
        <div className="stat-card" key={i}>
          <div
            className="stat-icon"
            style={{ background: s.bg, color: s.color }}
          >
            {s.icon}
          </div>
          <div className="stat-value">{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Activity Feed Component ────────────────────────────────
function ActivityFeed({ items }) {
  const getFeedIcon = (type) => {
    switch (type) {
      case "new_member":
        return {
          icon: <UserPlus size={16} />,
          bg: "var(--lrc-teal-light)",
          color: "var(--lrc-teal)",
        };
      case "run_completed":
        return {
          icon: <CheckCircle size={16} />,
          bg: "var(--lrc-olive-light)",
          color: "var(--lrc-olive)",
        };
      case "race_signup":
        return {
          icon: <Trophy size={16} />,
          bg: "var(--lrc-orange-light)",
          color: "var(--lrc-orange)",
        };
      default:
        return {
          icon: <Users size={16} />,
          bg: "var(--lrc-purple-light)",
          color: "var(--lrc-purple)",
        };
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-emoji">📡</div>
        <h3>No recent activity</h3>
        <p>Activity from your city chapter will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="feed-list">
      {items.map((item) => {
        const { icon, bg, color } = getFeedIcon(item.type);
        const time = item.timestamp?.toDate?.()
          ? formatDistanceToNow(item.timestamp.toDate(), { addSuffix: true })
          : "";
        return (
          <li className="feed-item" key={item.id}>
            <div className="feed-icon" style={{ background: bg, color }}>
              {icon}
            </div>
            <div className="feed-content">
              <p className="feed-message">{item.message}</p>
              {time && <div className="feed-time">{time}</div>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Main DashboardHome Component ───────────────────────────
export default function DashboardHome() {
  const { currentUser, userProfile } = useAuth();
  const [nextRun, setNextRun] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [memberCount, setMemberCount] = useState(0);
  const [miniLeaderboard, setMiniLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  const city = userProfile?.city || "new_york";
  const firstName =
    userProfile?.firstName ||
    currentUser?.displayName?.split(" ")[0] ||
    "Runner";

  useEffect(() => {
    let unsubFeed;

    async function load() {
      try {
        const [run, members, leaders, race] = await Promise.all([
          getNextRun(city),
          getCityMembers(city),
          getLeaderboard(city),
          getUserNextRace(currentUser.uid)
        ]);
        setNextRun(run);
        setNextRace(race);
        setMemberCount(members.length);
        setMiniLeaderboard(leaders.slice(0, 5));

        unsubFeed = subscribeToActivityFeed(city, (items) => {
          setFeedItems(items);
        });
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => {
      if (unsubFeed) unsubFeed();
    };
  }, [city]);

  const handleRSVP = useCallback(async () => {
    if (!nextRun || rsvpLoading) return;
    setRsvpLoading(true);
    try {
      const added = await toggleRunRSVP(nextRun.id, currentUser.uid);
      // Optimistic update
      setNextRun((prev) => {
        const rsvps = prev.rsvps || [];
        return {
          ...prev,
          rsvps: added
            ? [...rsvps, currentUser.uid]
            : rsvps.filter((id) => id !== currentUser.uid),
        };
      });
      toast.success(added ? "¡Vamos! You're in! 🏃" : "RSVP removed");
    } catch (err) {
      toast.error("Couldn't update RSVP. Try again.");
    } finally {
      setRsvpLoading(false);
    }
  }, [nextRun, currentUser, rsvpLoading]);

  const isRsvpd = nextRun?.rsvps?.includes(currentUser?.uid);

  if (loading) {
    return (
      <div>
        <div
          className="skeleton skeleton-title"
          style={{ width: "40%", marginBottom: 24 }}
        ></div>
        <div
          className="skeleton skeleton-card"
          style={{ marginBottom: 24 }}
        ></div>
        <div className="stats-strip">
          {[1, 2, 3, 4].map((i) => (
            <div
              className="skeleton skeleton-card"
              key={i}
              style={{ height: 100 }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="welcome-header">
        <h1 className="welcome-greeting">¡Hola, {firstName}! 👋</h1>
        <p className="welcome-subtitle">
          Welcome back to
          <span className="welcome-city-badge">
            <MapPin size={12} />
            {CITY_NAMES[city] || city}
          </span>
        </p>
      </div>

      {/* Motivational Banner */}
      <div className="motivational-banner">{getRandomQuote()}</div>

      {/* Stats Strip */}
      <StatsStrip userProfile={userProfile} memberCount={memberCount} />

      {/* Your Next Race Card */}
      {nextRace && (
        <div className="next-run-card" style={{ background: "linear-gradient(135deg, var(--lrc-orange), #ea580c)", color: "white", marginBottom: 24 }}>
          <div className="next-run-label" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>Your Next Official Race</div>
          <h2 className="next-run-title" style={{ color: "white" }}>{nextRace.name}</h2>
          <div className="next-run-details" style={{ color: "rgba(255,255,255,0.9)" }}>
            <span className="next-run-detail">
              <Calendar size={16} />
              {nextRace.date?.toDate ? format(nextRace.date.toDate(), "EEEE, MMM d") : "TBD"}
            </span>
            <span className="next-run-detail">
              <MapPin size={16} />
              {nextRace.location || "TBD"}
            </span>
            <span className="next-run-detail">
              <TrendingUp size={16} />
              {nextRace.distance}
            </span>
          </div>
          <div className="next-run-bottom">
            <CountdownTimer targetDate={nextRace.date} />
            <Link to={`/dashboard/race/${nextRace.id}`} className="btn-log-run" style={{ background: "white", color: "var(--lrc-orange)" }}>
              View Details
            </Link>
          </div>
        </div>
      )}

      {/* Next Run Card */}
      {nextRun ? (
        <div className="next-run-card">
          <div className="next-run-label">Next Group Run</div>
          <h2 className="next-run-title">{nextRun.location || "Group Run"}</h2>
          <div className="next-run-details">
            <span className="next-run-detail">
              <Calendar size={16} />
              {nextRun.date?.toDate
                ? format(nextRun.date.toDate(), "EEEE, MMM d")
                : "TBD"}
            </span>
            <span className="next-run-detail">
              <Clock size={16} />
              {nextRun.time || "TBD"}
            </span>
            <span className="next-run-detail">
              <MapPin size={16} />
              {nextRun.location || "TBD"}
            </span>
            {nextRun.paceGroup && (
              <span className="next-run-detail">
                <TrendingUp size={16} />
                {nextRun.paceGroup} pace
              </span>
            )}
          </div>
          <div className="next-run-bottom">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <button
                className={`rsvp-btn ${isRsvpd ? "rsvp-active" : ""}`}
                onClick={handleRSVP}
                disabled={rsvpLoading}
              >
                <CheckCircle size={16} />
                {isRsvpd ? "I'm in! ✓" : "I'm in!"}
              </button>
              <span className="next-run-rsvp-count">
                <Users size={14} />
                {nextRun.rsvps?.length || 0} going
              </span>
            </div>
            {nextRun.date?.toDate && (
              <CountdownTimer targetDate={nextRun.date} />
            )}
          </div>
        </div>
      ) : (
        <div className="dash-card" style={{ marginBottom: 24 }}>
          <div className="empty-state">
            <div className="empty-state-emoji">📅</div>
            <h3>No upcoming runs</h3>
            <p>¡Quédate atento! New runs will be posted soon.</p>
          </div>
        </div>
      )}

      {/* Activity Feed + Quick Links Grid */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Recent Activity</span>
            <span
              className="dash-card-badge"
              style={{
                background: "var(--lrc-teal-light)",
                color: "var(--lrc-teal)",
              }}
            >
              Live
            </span>
          </div>
          <ActivityFeed items={feedItems} />
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <span className="dash-card-title">
              <Trophy size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle", color: "var(--lrc-orange)" }} />
              City Leaderboard
            </span>
            <Link
              to="/dashboard/leaderboard"
              style={{ fontSize: 13, color: "var(--lrc-teal)", fontWeight: 600, textDecoration: "none" }}
            >
              See all →
            </Link>
          </div>
          {miniLeaderboard.length === 0 ? (
            <p style={{ fontSize: 14, color: "var(--lrc-text-muted)", padding: "8px 0" }}>
              No rankings yet — attend a race to earn points!
            </p>
          ) : (
            <ul className="leaderboard-list">
              {miniLeaderboard.map((entry, i) => {
                const isCurrentUser = entry.id === currentUser?.uid;
                const rankClass = i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : "";
                return (
                  <li key={entry.id} className={`leaderboard-item${isCurrentUser ? " leaderboard-you" : ""}`}>
                    <div className={`leaderboard-rank ${rankClass}`}>{i + 1}</div>
                    <div className="leaderboard-name">
                      {entry.firstName} {entry.lastName}
                      {isCurrentUser && <span style={{ color: "var(--lrc-teal)", fontSize: 11, marginLeft: 4 }}>you</span>}
                    </div>
                    <div className="leaderboard-value">{entry.totalPoints || 0} pts</div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
