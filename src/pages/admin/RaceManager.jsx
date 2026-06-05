import { useState, useEffect } from "react";
import {
  getRaces,
  createRace,
  updateRace,
  deleteRace,
} from "../../services/firestoreService";
import { Timestamp } from "firebase/firestore";
import { Plus, Edit3, Trash2, Save, X, Trophy } from "lucide-react";
import toast from "react-hot-toast";

const CITY_OPTIONS = [
  { value: "new_york", label: "New York" },
  { value: "washington_dc", label: "Washington DC" },
  { value: "boston", label: "Boston" },
  { value: "atlanta", label: "Atlanta" },
  { value: "london", label: "London" },
];

const DISTANCE_OPTIONS = ["5K", "10K", "Half Marathon", "Marathon", "Ultra"];

const EMPTY_FORM = {
  name: "",
  distance: "5K",
  city: "new_york",
  location: "",
  date: "",
  time: "",
  url: "",
  pointValue: 0,
};

export default function RaceManager() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadRaces();
  }, []);

  async function loadRaces() {
    setLoading(true);
    try {
      const data = await getRaces();
      setRaces(data);
    } catch (err) {
      toast.error("Failed to load races");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(race) {
    const dateStr = race.date?.toDate
      ? race.date.toDate().toISOString().slice(0, 10)
      : "";
    setForm({
      name: race.name || "",
      distance: race.distance || "5K",
      city: race.city || "new_york",
      location: race.location || "",
      date: dateStr,
      time: race.time || "",
      url: race.url || "",
      pointValue: race.pointValue || 0,
    });
    setEditingId(race.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.date) {
      toast.error("Name and date are required.");
      return;
    }
    setSaving(true);
    try {
      const dateObj = new Date(form.date + "T08:00:00");
      const payload = {
        name: form.name.trim(),
        distance: form.distance,
        city: form.city,
        location: form.location.trim(),
        date: Timestamp.fromDate(dateObj),
        time: form.time.trim(),
        url: form.url.trim(),
        pointValue: Number(form.pointValue) || 0,
      };

      if (editingId) {
        await updateRace(editingId, payload);
        toast.success("Race updated!");
      } else {
        await createRace(payload);
        toast.success("Race created!");
      }
      setShowForm(false);
      setEditingId(null);
      await loadRaces();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save race.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(raceId) {
    if (!window.confirm("Delete this race? This cannot be undone.")) return;
    setDeletingId(raceId);
    try {
      await deleteRace(raceId);
      toast.success("Race deleted.");
      setRaces((prev) => prev.filter((r) => r.id !== raceId));
    } catch (err) {
      toast.error("Failed to delete race.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePointValueChange(raceId, value) {
    const pts = Number(value);
    setRaces((prev) => prev.map((r) => r.id === raceId ? { ...r, pointValue: pts } : r));
    try {
      await updateRace(raceId, { pointValue: pts });
      toast.success("Points updated!");
    } catch (err) {
      toast.error("Failed to update points.");
    }
  }

  return (
    <div className="manager-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0 }}>Race Manager</h2>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
            Create races, set point values, and manage entries.
          </p>
        </div>
        <button className="admin-btn-primary" onClick={openCreate}>
          <Plus size={16} /> New Race
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <div className="admin-form-card">
          <h3 style={{ margin: "0 0 20px" }}>{editingId ? "Edit Race" : "New Race"}</h3>
          <div className="admin-form-grid">
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Race Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. NYC Half Marathon"
              />
            </div>
            <div className="admin-form-group">
              <label>Distance</label>
              <select value={form.distance} onChange={(e) => setForm((p) => ({ ...p, distance: e.target.value }))}>
                {DISTANCE_OPTIONS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label>City</label>
              <select value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}>
                {CITY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Central Park, New York"
              />
            </div>
            <div className="admin-form-group">
              <label>Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div className="admin-form-group">
              <label>Start Time</label>
              <input
                type="text"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                placeholder="e.g. 7:00 AM"
              />
            </div>
            <div className="admin-form-group">
              <label>
                <Trophy size={13} style={{ display: "inline", marginRight: 4 }} />
                Point Value
              </label>
              <input
                type="number"
                min="0"
                value={form.pointValue}
                onChange={(e) => setForm((p) => ({ ...p, pointValue: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div className="admin-form-group" style={{ gridColumn: "1 / -1" }}>
              <label>Registration URL</label>
              <input
                type="url"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="admin-btn-primary" onClick={handleSave} disabled={saving}>
              <Save size={15} /> {saving ? "Saving..." : "Save Race"}
            </button>
            <button className="admin-btn-secondary" onClick={cancelForm}>
              <X size={15} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Races Table */}
      {loading ? (
        <p style={{ color: "#666" }}>Loading races...</p>
      ) : races.length === 0 ? (
        <div className="admin-empty-state">
          <p>No races yet. Create one above!</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Distance</th>
                <th>City</th>
                <th>Date &amp; Time</th>
                <th>Participants</th>
                <th>Points</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr key={race.id}>
                  <td style={{ fontWeight: 600 }}>{race.name}</td>
                  <td>{race.distance}</td>
                  <td>{CITY_OPTIONS.find((c) => c.value === race.city)?.label || race.city}</td>
                  <td>
                    {race.date?.toDate
                      ? race.date.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "—"}
                    {race.time && <span style={{ display: "block", fontSize: 11, color: "#999", marginTop: 2 }}>{race.time}</span>}
                  </td>
                  <td>{race.participants?.length || 0}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={race.pointValue || 0}
                      onChange={(e) => handlePointValueChange(race.id, e.target.value)}
                      className="admin-points-input"
                    />
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="admin-btn-icon" onClick={() => openEdit(race)} title="Edit">
                        <Edit3 size={15} />
                      </button>
                      <button
                        className="admin-btn-icon admin-btn-danger"
                        onClick={() => handleDelete(race.id)}
                        disabled={deletingId === race.id}
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
