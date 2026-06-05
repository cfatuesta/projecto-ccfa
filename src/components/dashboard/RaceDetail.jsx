import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getRaceWithParticipantDetails,
  toggleRaceParticipation,
} from "../../services/firestoreService";
import QRCode from "react-qr-code";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  CheckCircle,
  ArrowLeft,
  QrCode,
  Globe,
  X,
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

export default function RaceDetail() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();

  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const confirmUrl = `${window.location.origin}/race/${raceId}/confirm`;

  useEffect(() => {
    async function load() {
      try {
        const data = await getRaceWithParticipantDetails(raceId);
        setRace(data);
      } catch (err) {
        console.error("Failed to load race", err);
        toast.error("Could not load race details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [raceId]);

  const handleToggle = async () => {
    if (!race || toggleLoading) return;
    setToggleLoading(true);
    try {
      const homeCity = userProfile?.city || "new_york";
      const isRunning = race.participants?.includes(currentUser.uid);
      const added = await toggleRaceParticipation(raceId, currentUser.uid, homeCity);
      setRace((prev) => {
        const participants = prev.participants || [];
        const participantCities = prev.participantCities || {};
        const updatedCities = added
          ? { ...participantCities, [currentUser.uid]: homeCity }
          : Object.fromEntries(
              Object.entries(participantCities).filter(([k]) => k !== currentUser.uid),
            );
        const updatedDetails = added
          ? [
              ...(prev.participantDetails || []),
              {
                uid: currentUser.uid,
                firstName: userProfile?.firstName || "You",
                lastName: userProfile?.lastName || "",
                city: homeCity,
                homeCity,
                photoURL: userProfile?.photoURL || "",
              },
            ]
          : (prev.participantDetails || []).filter((p) => p.uid !== currentUser.uid);
        return {
          ...prev,
          participants: added
            ? [...participants, currentUser.uid]
            : participants.filter((id) => id !== currentUser.uid),
          participantCities: updatedCities,
          participantDetails: updatedDetails,
        };
      });
      toast.success(added ? "🎉 You're running this!" : "Removed from race");
    } catch (err) {
      toast.error("Couldn't update. Try again.");
    } finally {
      setToggleLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton skeleton-title" style={{ width: "40%", marginBottom: 24 }} />
        <div className="skeleton skeleton-card" style={{ height: 200 }} />
      </div>
    );
  }

  if (!race) {
    return (
      <div className="dash-card">
        <div className="empty-state">
          <div className="empty-state-emoji">🏅</div>
          <h3>Race not found</h3>
          <p>This race may have been removed.</p>
          <button className="btn-secondary" onClick={() => navigate("/dashboard/races")} style={{ marginTop: 16 }}>
            <ArrowLeft size={16} /> Back to Races
          </button>
        </div>
      </div>
    );
  }

  const isRunning = race.participants?.includes(currentUser?.uid);
  const raceDate = race.date?.toDate?.();
  const visitors = (race.participantDetails || []).filter(
    (p) => p.homeCity && p.homeCity !== race.city,
  );

  return (
    <div>
      <button
        className="btn-secondary"
        onClick={() => navigate("/dashboard/races")}
        style={{ marginBottom: 20, padding: "8px 16px", fontSize: 13 }}
      >
        <ArrowLeft size={16} /> All Races
      </button>

      {/* Race Header Card */}
      <div className="dash-card" style={{ marginBottom: 24 }}>
        <div className="race-card-header">
          <span className="race-distance-badge">{race.distance || "Race"}</span>
          {raceDate && (
            <span style={{ fontSize: 13, color: "var(--lrc-text-muted)" }}>
              {format(raceDate, "MMM d, yyyy")}
            </span>
          )}
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "8px 0 12px", color: "var(--lrc-text-primary)" }}>
          {race.name}
        </h1>

        <div className="race-meta" style={{ marginBottom: 20 }}>
          {raceDate && (
            <span><Calendar size={14} /> {format(raceDate, "EEEE, MMM d, yyyy")}</span>
          )}
          {race.location && (
            <span><MapPin size={14} /> {race.location}</span>
          )}
          {race.pointValue > 0 && (
            <span style={{ color: "var(--lrc-orange)", fontWeight: 600 }}>
              <Trophy size={14} /> {race.pointValue} pts
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button
            className={`race-running-btn ${isRunning ? "race-active" : ""}`}
            onClick={handleToggle}
            disabled={toggleLoading}
            style={{ padding: "10px 22px" }}
          >
            <CheckCircle size={16} />
            {isRunning ? "I'm running! ✓" : "I'm running this!"}
          </button>

          {race.url && (
            <a
              href={race.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: "10px 18px", fontSize: 13, textDecoration: "none" }}
            >
              Official Race Page <ExternalLink size={13} />
            </a>
          )}

          <button
            className="btn-secondary"
            onClick={() => setShowQR(true)}
            style={{ padding: "10px 18px", fontSize: 13 }}
          >
            <QrCode size={14} /> Show Race QR
          </button>
        </div>
      </div>

      {/* Participants */}
      <div className="dash-card">
        <div className="dash-card-header">
          <span className="dash-card-title">
            <Users size={18} style={{ display: "inline", marginRight: 8, verticalAlign: "middle" }} />
            Who's Running ({race.participantDetails?.length || 0})
          </span>
          {visitors.length > 0 && (
            <span className="dash-card-badge" style={{ background: "var(--lrc-purple-light)", color: "var(--lrc-purple)" }}>
              <Globe size={11} style={{ display: "inline", marginRight: 4 }} />
              {visitors.length} visiting
            </span>
          )}
        </div>

        {!race.participantDetails?.length ? (
          <div className="empty-state" style={{ padding: "32px 24px" }}>
            <div className="empty-state-emoji">🏃</div>
            <h3>No runners yet</h3>
            <p>Be the first to sign up!</p>
          </div>
        ) : (
          <div className="participant-list">
            {race.participantDetails.map((p, i) => {
              const isVisitor = p.homeCity && p.homeCity !== race.city;
              const initials = getInitials(p.firstName, p.lastName);
              const avatarColor = getAvatarColor(p.firstName);
              return (
                <div key={p.uid} className="participant-row">
                  <div
                    className="member-avatar"
                    style={{
                      width: 40,
                      height: 40,
                      fontSize: 14,
                      flexShrink: 0,
                      background: p.photoURL ? "transparent" : avatarColor,
                    }}
                  >
                    {p.photoURL ? (
                      <img src={p.photoURL} alt={p.firstName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                    ) : initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "var(--lrc-text-primary)" }}>
                      {p.firstName} {p.lastName}
                      {p.uid === currentUser?.uid && (
                        <span style={{ fontSize: 11, color: "var(--lrc-teal)", marginLeft: 6, fontWeight: 500 }}>you</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--lrc-text-muted)", marginTop: 2 }}>
                      <MapPin size={11} style={{ display: "inline", marginRight: 3 }} />
                      {CITY_NAMES[p.homeCity || p.city] || p.city}
                    </div>
                  </div>
                  {isVisitor && (
                    <span className="visitor-chip">
                      <Globe size={11} /> Visiting
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h3>Race QR Code</h3>
              <button className="qr-modal-close" onClick={() => setShowQR(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="qr-modal-subtitle">
              Show this QR code at the race for attendees to scan and confirm their participation.
            </p>
            <div className="qr-code-wrapper" id="race-qr-container">
              <QRCode value={confirmUrl} size={220} />
            </div>
            <p style={{ fontSize: 12, color: "var(--lrc-text-muted)", textAlign: "center", marginTop: 12, wordBreak: "break-all" }}>
              {confirmUrl}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
