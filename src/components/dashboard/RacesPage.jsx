import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getRaces,
  toggleRaceParticipation,
} from "../../services/firestoreService";
import {
  Trophy,
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle,
  ChevronRight,
  Globe,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

const AVATAR_COLORS = [
  "var(--lrc-teal)",
  "var(--lrc-orange)",
  "var(--lrc-purple)",
  "var(--lrc-olive)",
  "var(--lrc-pink)",
];

const DISTANCE_OPTIONS = [
  "All",
  "5K",
  "10K",
  "Half Marathon",
  "Marathon",
  "Ultra",
];

const CITY_OPTIONS = [
  { value: "", label: "All Cities" },
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

const CITY_LABELS = {
  new_york: "NYC",
  washington_dc: "DC",
  boston: "BOS",
  atlanta: "ATL",
  london: "LON",
};

// Distance-based gradient accents
const DISTANCE_COLORS = {
  "5K":            { gradient: "linear-gradient(135deg, var(--lrc-teal), #0d9488)",    badge: "var(--lrc-teal-light)",   text: "var(--lrc-teal)"   },
  "10K":           { gradient: "linear-gradient(135deg, var(--lrc-orange), #ea580c)",  badge: "var(--lrc-orange-light)", text: "var(--lrc-orange)" },
  "Half Marathon": { gradient: "linear-gradient(135deg, var(--lrc-purple), #7c3aed)",  badge: "var(--lrc-purple-light)", text: "var(--lrc-purple)" },
  "Marathon":      { gradient: "linear-gradient(135deg, var(--lrc-pink), #be185d)",    badge: "var(--lrc-pink-light)",   text: "var(--lrc-pink)"   },
  "Ultra":         { gradient: "linear-gradient(135deg, var(--lrc-olive), #4d7c0f)",   badge: "var(--lrc-olive-light)",  text: "var(--lrc-olive)"  },
};

function getDistanceColors(distance) {
  return DISTANCE_COLORS[distance] || DISTANCE_COLORS["5K"];
}

export default function RacesPage() {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [allRaces, setAllRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [filterDistance, setFilterDistance] = useState("All");
  const [toggleLoading, setToggleLoading] = useState({});

  // Load ALL races once — filter client-side to avoid composite index issues
  useEffect(() => {
    loadRaces();
  }, []);

  async function loadRaces() {
    setLoading(true);
    try {
      const data = await getRaces();
      setAllRaces(data);
    } catch (err) {
      console.error("Races load error:", err);
      toast.error("Couldn't load races. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleToggle = useCallback(
    async (raceId) => {
      if (toggleLoading[raceId]) return;
      setToggleLoading((prev) => ({ ...prev, [raceId]: true }));
      try {
        const homeCity = userProfile?.city || "new_york";
        const added = await toggleRaceParticipation(raceId, currentUser.uid, homeCity);
        setAllRaces((prev) =>
          prev.map((r) => {
            if (r.id !== raceId) return r;
            const participants = r.participants || [];
            const participantCities = r.participantCities || {};
            return {
              ...r,
              participants: added
                ? [...participants, currentUser.uid]
                : participants.filter((id) => id !== currentUser.uid),
              participantCities: added
                ? { ...participantCities, [currentUser.uid]: homeCity }
                : Object.fromEntries(
                    Object.entries(participantCities).filter(
                      ([k]) => k !== currentUser.uid,
                    ),
                  ),
            };
          }),
        );
        toast.success(added ? "🎉 You're running this!" : "Removed from race");
      } catch (err) {
        toast.error("Couldn't update. Try again.");
      } finally {
        setToggleLoading((prev) => ({ ...prev, [raceId]: false }));
      }
    },
    [currentUser, userProfile, toggleLoading],
  );

  // Client-side filtering for both city and distance
  const filteredRaces = allRaces.filter((r) => {
    if (filterCity && r.city !== filterCity) return false;
    if (filterDistance !== "All" && r.distance !== filterDistance) return false;
    return true;
  });

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%" }}></div>
        <div className="race-grid" style={{ marginTop: 20 }}>
          {[1, 2, 3].map((i) => (
            <div
              className="skeleton skeleton-card"
              key={i}
              style={{ height: 280 }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">
        <Trophy
          size={24}
          style={{
            display: "inline",
            verticalAlign: "middle",
            marginRight: 8,
            color: "var(--lrc-orange)",
          }}
        />
        Races &amp; Events
      </h1>
      <p className="page-subtitle">
        Find upcoming races, see who from the club is running, and sign up
        together. ¡A correr!
      </p>

      {/* Filters */}
      <div className="filter-chips-container">
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
        <div className="filter-chips-bar">
          {DISTANCE_OPTIONS.map((d) => (
            <button
              key={d}
              className={`filter-chip ${filterDistance === d ? "active" : ""}`}
              onClick={() => setFilterDistance(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Race Cards */}
      {filteredRaces.length === 0 ? (
        <div className="dash-card">
          <div className="empty-state">
            <div className="empty-state-emoji">🏅</div>
            <h3>No races found</h3>
            <p>
              {filterCity || filterDistance !== "All"
                ? "Try clearing your filters — there may be races in other cities!"
                : "No races scheduled yet. Check back soon!"}
            </p>
            {(filterCity || filterDistance !== "All") && (
              <button
                className="btn-secondary"
                style={{ marginTop: 12 }}
                onClick={() => { setFilterCity(""); setFilterDistance("All"); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="race-grid">
          {filteredRaces.map((race) => {
            const isRunning = race.participants?.includes(currentUser?.uid);
            const raceDate = race.date?.toDate?.();
            const participantCount = race.participants?.length || 0;
            const colors = getDistanceColors(race.distance);
            const pointValue = race.pointValue || 0;

            return (
              <div className="race-card-v2" key={race.id}>
                {/* Gradient accent top strip */}
                <div
                  className="race-card-accent"
                  style={{ background: colors.gradient }}
                />

                {/* Card body */}
                <div className="race-card-body">
                  {/* Header row: distance badge + date */}
                  <div className="race-card-header-row">
                    <span
                      className="race-distance-badge-v2"
                      style={{ background: colors.badge, color: colors.text }}
                    >
                      {race.distance || "Race"}
                    </span>
                    <div className="race-card-header-right">
                      {pointValue > 0 && (
                        <span className="race-points-badge">
                          <Star size={11} />
                          {pointValue} pts
                        </span>
                      )}
                      {raceDate && (
                        <span className="race-card-date">
                          {format(raceDate, "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Race name */}
                  <h3 className="race-name-v2">{race.name}</h3>

                  {/* Meta info */}
                  <div className="race-meta-v2">
                    {raceDate && (
                      <span>
                        <Calendar size={13} />
                        {format(raceDate, "EEEE, MMMM d, yyyy")}
                      </span>
                    )}
                    {race.location && (
                      <span>
                        <MapPin size={13} />
                        {race.location}
                      </span>
                    )}
                    {race.time && (
                      <span>
                        <Clock size={13} />
                        {race.time}
                      </span>
                    )}
                  </div>

                  {/* Participant avatars */}
                  {participantCount > 0 && (
                    <div className="race-participants-row">
                      <div className="race-avatar-stack">
                        {race.participants.slice(0, 5).map((uid, i) => {
                          const homeCity = race.participantCities?.[uid];
                          const isVisitor = homeCity && homeCity !== race.city;
                          return (
                            <div key={uid} className="race-avatar-wrapper">
                              <div
                                className="member-avatar"
                                style={{
                                  background: AVATAR_COLORS[i % AVATAR_COLORS.length],
                                  width: 28,
                                  height: 28,
                                  fontSize: 11,
                                  border: "2px solid white",
                                  marginLeft: i > 0 ? -8 : 0,
                                }}
                              >
                                🏃
                              </div>
                              {isVisitor && (
                                <span className="race-visitor-badge">
                                  {CITY_LABELS[homeCity] || "?"}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="race-participant-label">
                        {participantCount} {participantCount === 1 ? "runner" : "runners"} from LRC
                        {Object.values(race.participantCities || {}).some((c) => c !== race.city) && (
                          <span className="race-visitor-note">
                            {" "}· <Globe size={10} style={{ display: "inline", verticalAlign: "middle" }} /> cross-city
                          </span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="race-card-divider" />

                  {/* Bottom actions */}
                  <div className="race-card-actions">
                    <button
                      className={`race-join-btn ${isRunning ? "race-join-active" : ""}`}
                      style={isRunning ? {} : { borderColor: colors.text, color: colors.text }}
                      onClick={() => handleToggle(race.id)}
                      disabled={toggleLoading[race.id]}
                    >
                      <CheckCircle size={14} />
                      {isRunning ? "Running ✓" : "I'm running this!"}
                    </button>

                    <div className="race-card-links">
                      {race.url && (
                        <a
                          href={race.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="race-link-btn"
                        >
                          Register <ExternalLink size={11} />
                        </a>
                      )}
                      <button
                        className="race-link-btn"
                        onClick={() => navigate(`/dashboard/race/${race.id}`)}
                      >
                        Details <ChevronRight size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
