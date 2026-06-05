import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { confirmRaceAttendance, getRace } from "../services/firestoreService";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function RaceConfirm() {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("loading");
  const [raceName, setRaceName] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    async function confirm() {
      try {
        const race = await getRace(raceId);
        if (!race) {
          setStatus("not-found");
          return;
        }
        setRaceName(race.name);
        await confirmRaceAttendance(raceId, currentUser.uid);
        setStatus("success");
        setTimeout(() => navigate(`/dashboard/race/${raceId}`), 3000);
      } catch (err) {
        console.error("Confirmation error:", err);
        setStatus("error");
        setTimeout(() => navigate("/dashboard/races"), 3000);
      }
    }

    confirm();
  }, [raceId, currentUser, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--lrc-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "Jost, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: "48px 40px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        {status === "loading" && (
          <>
            <Loader size={48} style={{ color: "var(--lrc-teal)", animation: "spin 1s linear infinite", margin: "0 auto 20px" }} />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>Confirming Attendance...</h2>
            <p style={{ color: "var(--lrc-text-secondary)", margin: 0 }}>Hold tight, we're marking you in!</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={56} style={{ color: "var(--lrc-teal)", margin: "0 auto 20px", display: "block" }} />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "var(--lrc-text-primary)" }}>
              You're Confirmed!
            </h2>
            <p style={{ color: "var(--lrc-text-secondary)", marginBottom: 8 }}>
              Your attendance at <strong>{raceName}</strong> has been recorded.
            </p>
            <p style={{ fontSize: 13, color: "var(--lrc-text-muted)" }}>Redirecting you to the race page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={56} style={{ color: "var(--lrc-pink)", margin: "0 auto 20px", display: "block" }} />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "var(--lrc-text-primary)" }}>
              Something went wrong
            </h2>
            <p style={{ color: "var(--lrc-text-secondary)", marginBottom: 8 }}>
              We couldn't confirm your attendance. Please try again.
            </p>
            <p style={{ fontSize: 13, color: "var(--lrc-text-muted)" }}>Redirecting you back...</p>
          </>
        )}

        {status === "not-found" && (
          <>
            <XCircle size={56} style={{ color: "var(--lrc-orange)", margin: "0 auto 20px", display: "block" }} />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>Race Not Found</h2>
            <p style={{ color: "var(--lrc-text-secondary)", marginBottom: 16 }}>
              This QR code doesn't match any active race.
            </p>
            <button
              className="btn-primary"
              onClick={() => navigate("/dashboard/races")}
              style={{ margin: "0 auto" }}
            >
              Browse Races
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
