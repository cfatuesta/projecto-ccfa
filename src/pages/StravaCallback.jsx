import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function StravaCallback() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error === "access_denied") {
      setStatus("denied");
      setTimeout(() => navigate("/dashboard/profile"), 3000);
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMsg("No authorization code received from Strava.");
      setTimeout(() => navigate("/dashboard/profile"), 3000);
      return;
    }

    async function exchangeToken() {
      try {
        const functions = getFunctions(app);
        const stravaAuth = httpsCallable(functions, "stravaAuth");
        await stravaAuth({ code, uid: currentUser.uid });
        setStatus("success");
        setTimeout(() => navigate("/dashboard/profile"), 3000);
      } catch (err) {
        console.error("Strava token exchange error:", err);
        setStatus("error");
        setErrorMsg(err.message || "Failed to connect your Strava account.");
        setTimeout(() => navigate("/dashboard/profile"), 4000);
      }
    }

    exchangeToken();
  }, [currentUser, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f2efeb",
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
            <Loader
              size={48}
              style={{
                color: "#fc4c02",
                animation: "spin 1s linear infinite",
                margin: "0 auto 20px",
                display: "block",
              }}
            />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
              Connecting Strava...
            </h2>
            <p style={{ color: "#6b6b6b", margin: 0 }}>
              Exchanging your authorization with Strava.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              size={56}
              style={{ color: "#fc4c02", margin: "0 auto 20px", display: "block" }}
            />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
              Strava Connected!
            </h2>
            <p style={{ color: "#6b6b6b", marginBottom: 8 }}>
              Your Strava account is now linked. Heading back to your profile...
            </p>
          </>
        )}

        {status === "denied" && (
          <>
            <XCircle
              size={56}
              style={{ color: "#6b6b6b", margin: "0 auto 20px", display: "block" }}
            />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
              Connection Cancelled
            </h2>
            <p style={{ color: "#6b6b6b" }}>
              You declined the Strava connection. Redirecting to your profile...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle
              size={56}
              style={{ color: "#d52d5d", margin: "0 auto 20px", display: "block" }}
            />
            <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800 }}>
              Connection Failed
            </h2>
            <p style={{ color: "#6b6b6b", marginBottom: 8 }}>{errorMsg}</p>
            <p style={{ fontSize: 13, color: "#999" }}>
              Redirecting back to your profile...
            </p>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
