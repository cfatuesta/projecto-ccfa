import { useState, useEffect, useRef } from "react";
import {
  getRaces,
  confirmRaceAttendance,
  subscribeToRaceConfirmedAttendees,
  getUserProfile,
} from "../../services/firestoreService";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import { QrCode, Scan, Users, CheckCircle, Trophy, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const CITY_NAMES = {
  new_york: "New York",
  washington_dc: "Washington DC",
  boston: "Boston",
  atlanta: "Atlanta",
  london: "London",
};

export default function AdminAttendance() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [tab, setTab] = useState("scan");
  const [attendees, setAttendees] = useState([]);
  const [registeredParticipants, setRegisteredParticipants] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(false);
  const [loadingRaces, setLoadingRaces] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  const confirmUrl = selectedRace
    ? `${window.location.origin}/race/${selectedRace.id}/confirm`
    : "";

  useEffect(() => {
    async function load() {
      try {
        const data = await getRaces();
        setRaces(data);
      } catch (err) {
        toast.error("Failed to load races");
      } finally {
        setLoadingRaces(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedRace) return;
    const unsub = subscribeToRaceConfirmedAttendees(selectedRace.id, (data) => {
      setAttendees(data);
    });
    return unsub;
  }, [selectedRace]);

  useEffect(() => {
    if (!selectedRace) {
      setRegisteredParticipants([]);
      return;
    }
    async function loadRegistered() {
      setLoadingRegistered(true);
      try {
        const uids = selectedRace.participants || [];
        const profiles = await Promise.all(
          uids.map(async (uid) => {
            const profile = await getUserProfile(uid);
            return { id: uid, ...profile };
          })
        );
        setRegisteredParticipants(profiles.filter((p) => p.firstName));
      } catch (err) {
        console.error("Failed to load registered", err);
      } finally {
        setLoadingRegistered(false);
      }
    }
    loadRegistered();
  }, [selectedRace]);

  useEffect(() => {
    if (tab === "scan" && selectedRace && scanning) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [tab, scanning, selectedRace]);

  function startScanner() {
    if (scannerInstanceRef.current || !scannerRef.current) return;
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false,
    );
    scanner.render(onScanSuccess, onScanError);
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
    const uid = decodedText.trim();
    try {
      const profile = await getUserProfile(uid);
      const name = profile
        ? `${profile.firstName} ${profile.lastName}`
        : `User ${uid.slice(0, 8)}`;

      await confirmRaceAttendance(selectedRace.id, uid);
      setLastScanned({ uid, name, success: true });
      toast.success(`✓ ${name} confirmed!`);
    } catch (err) {
      console.error("Scan confirm error:", err);
      setLastScanned({ uid, name: uid.slice(0, 12), success: false });
      toast.error("Could not confirm attendance.");
    }
  }

  function onScanError() {}

  const raceDate = selectedRace?.date?.toDate?.();

  return (
    <div className="manager-container">
      <h2 style={{ margin: "0 0 4px" }}>Race Attendance</h2>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: 14 }}>
        Scan runner QR codes or show the race QR for self-check-in.
      </p>

      {/* Race Selector */}
      <div className="admin-form-card" style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 600, fontSize: 14, display: "block", marginBottom: 8 }}>
          Select Race
        </label>
        {loadingRaces ? (
          <p style={{ color: "#666", fontSize: 14 }}>Loading races...</p>
        ) : (
          <select
            className="admin-select"
            value={selectedRace?.id || ""}
            onChange={(e) => {
              const race = races.find((r) => r.id === e.target.value) || null;
              setSelectedRace(race);
              setLastScanned(null);
              setScanning(false);
            }}
          >
            <option value="">— Select a race —</option>
            {races.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.distance} · {CITY_NAMES[r.city] || r.city})
              </option>
            ))}
          </select>
        )}

        {selectedRace && (
          <div style={{ marginTop: 12, display: "flex", gap: 16, fontSize: 13, color: "#666", flexWrap: "wrap" }}>
            {raceDate && <span>📅 {raceDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>}
            <span><Trophy size={13} style={{ display: "inline" }} /> {selectedRace.pointValue || 0} pts</span>
            <span><Users size={13} style={{ display: "inline" }} /> {attendees.length} confirmed</span>
          </div>
        )}
      </div>

      {selectedRace && (
        <>
          {/* Tabs */}
          <div className="admin-tabs" style={{ marginBottom: 24 }}>
            <button
              className={`admin-tab${tab === "scan" ? " active" : ""}`}
              onClick={() => { setTab("scan"); setScanning(false); }}
            >
              <Scan size={16} /> Scan User QR
            </button>
            <button
              className={`admin-tab${tab === "qr" ? " active" : ""}`}
              onClick={() => { setTab("qr"); setScanning(false); }}
            >
              <QrCode size={16} /> Show Race QR
            </button>
            <button
              className={`admin-tab${tab === "list" ? " active" : ""}`}
              onClick={() => { setTab("list"); setScanning(false); }}
            >
              <Users size={16} /> Confirmed ({attendees.length})
            </button>
          </div>

          {/* Scan Tab */}
          {tab === "scan" && (
            <div className="admin-form-card" style={{ textAlign: "center" }}>
              {!scanning ? (
                <>
                  <p style={{ color: "#666", marginBottom: 16, fontSize: 14 }}>
                    Ask the runner to show their profile QR code, then press scan.
                  </p>
                  <button className="admin-btn-primary" onClick={() => setScanning(true)} style={{ fontSize: 15, padding: "12px 28px" }}>
                    <Scan size={18} /> Start Scanning
                  </button>
                </>
              ) : (
                <>
                  <p style={{ color: "#666", marginBottom: 12, fontSize: 14 }}>
                    Point camera at the runner's QR code.
                  </p>
                  <div id="qr-reader" ref={scannerRef} style={{ margin: "0 auto", maxWidth: 320 }} />
                  <button
                    className="admin-btn-secondary"
                    onClick={() => { setScanning(false); stopScanner(); }}
                    style={{ marginTop: 16 }}
                  >
                    Cancel
                  </button>
                </>
              )}

              {lastScanned && (
                <div
                  className="admin-scan-result"
                  style={{ borderColor: lastScanned.success ? "var(--lrc-teal)" : "var(--lrc-pink)", background: lastScanned.success ? "var(--lrc-teal-light)" : "var(--lrc-pink-light)" }}
                >
                  {lastScanned.success ? (
                    <CheckCircle size={20} style={{ color: "var(--lrc-teal)" }} />
                  ) : (
                    <span style={{ fontSize: 20 }}>❌</span>
                  )}
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{lastScanned.name}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {lastScanned.success ? "Attendance confirmed" : "Could not confirm"}
                    </div>
                  </div>
                </div>
              )}

              {lastScanned?.success && (
                <button
                  className="admin-btn-secondary"
                  onClick={() => { setLastScanned(null); setScanning(true); }}
                  style={{ marginTop: 12 }}
                >
                  Scan Next Runner
                </button>
              )}
            </div>
          )}

          {/* Race QR Tab */}
          {tab === "qr" && (
            <div className="admin-form-card" style={{ textAlign: "center" }}>
              <p style={{ color: "#666", marginBottom: 20, fontSize: 14 }}>
                Show this QR code to runners. When they scan it, their attendance is automatically confirmed.
              </p>
              <div style={{ display: "inline-block", padding: 24, background: "white", borderRadius: 16, border: "1px solid #e5e7eb" }}>
                <QRCode value={confirmUrl} size={240} />
              </div>
              <p style={{ fontSize: 12, color: "#999", marginTop: 12, wordBreak: "break-all" }}>
                {confirmUrl}
              </p>
              <div style={{ marginTop: 8, fontWeight: 700, fontSize: 18 }}>{selectedRace.name}</div>
              <div style={{ fontSize: 14, color: "#666" }}>{selectedRace.pointValue || 0} points</div>
            </div>
          )}

          {/* Confirmed List Tab */}
          {tab === "list" && (
            <div className="admin-form-card">
              <h3 style={{ margin: "0 0 16px" }}>Registered (Not Checked In)</h3>
              {loadingRegistered ? (
                <p style={{ color: "#666", fontSize: 14 }}>Loading registered runners...</p>
              ) : (
                (() => {
                  const unconfirmed = registeredParticipants.filter(
                    (rp) => !attendees.find((a) => a.id === rp.id)
                  );
                  if (unconfirmed.length === 0) {
                    return <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>All registered runners are checked in!</p>;
                  }
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                      {unconfirmed.map((a) => (
                        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{a.firstName} {a.lastName}</div>
                            <div style={{ fontSize: 12, color: "#888" }}>
                              <MapPin size={11} style={{ display: "inline" }} /> {CITY_NAMES[a.city] || a.city}
                              {a.runningLevel && ` · Level: ${a.runningLevel}`}
                            </div>
                          </div>
                          <button
                            className="admin-btn-secondary"
                            style={{ padding: "6px 12px", fontSize: 12 }}
                            onClick={async () => {
                              try {
                                await confirmRaceAttendance(selectedRace.id, a.id);
                                toast.success(`✓ ${a.firstName} marked present`);
                              } catch (e) {
                                toast.error("Could not mark present");
                              }
                            }}
                          >
                            Mark Present
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}

              <h3 style={{ margin: "0 0 16px" }}>Confirmed Attendees</h3>
              {attendees.length === 0 ? (
                <p style={{ color: "#666", fontSize: 14 }}>No confirmed attendees yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {attendees.map((a) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                      <CheckCircle size={18} style={{ color: "var(--lrc-teal)", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.firstName} {a.lastName}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>
                          <MapPin size={11} style={{ display: "inline" }} /> {CITY_NAMES[a.city] || a.city}
                          {a.runningLevel && ` · Level: ${a.runningLevel}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
