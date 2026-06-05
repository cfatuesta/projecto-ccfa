import { useState, useEffect } from "react";
import { getAllUsers, updateUserAdminStatus } from "../../services/firestoreService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Shield, User, Search, ShieldAlert, Check } from "lucide-react";

export default function MembersManager() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingUid, setTogglingUid] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // Sort so admins are at the top, then alphabetically by first name
      data.sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        const nameA = (a.firstName || "").toLowerCase();
        const nameB = (b.firstName || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
      toast.error("Failed to load members.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleAdmin(uid, currentStatus) {
    // Prevent removing your own admin status
    if (uid === currentUser.uid && currentStatus) {
      toast.error("You cannot remove your own admin status.");
      return;
    }

    const newStatus = !currentStatus;
    
    // Optional: add a confirmation dialogue if removing admin
    if (!newStatus) {
      if (!window.confirm("Are you sure you want to remove admin privileges from this user?")) {
        return;
      }
    }

    setTogglingUid(uid);
    try {
      await updateUserAdminStatus(uid, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, isAdmin: newStatus } : u)),
      );
      toast.success(newStatus ? "User is now an admin." : "Admin privileges removed.");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update admin status.");
    } finally {
      setTogglingUid(null);
    }
  }

  const filteredUsers = users.filter((u) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    return fullName.includes(s) || (u.email || "").toLowerCase().includes(s);
  });

  return (
    <div className="admin-page-container">
      <div className="admin-header">
        <div>
          <h1 className="admin-page-title">Members Manager</h1>
          <p className="admin-page-subtitle">
            Manage all registered users and assign admin privileges.
          </p>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-list-header">
          <div className="search-wrapper" style={{ maxWidth: 300 }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ fontSize: 13, color: "var(--lrc-text-secondary)", fontWeight: 500 }}>
            {filteredUsers.length} total members
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--lrc-text-secondary)" }}>
            Loading members...
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Runner</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Total Points</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center", padding: 30, color: "var(--lrc-text-secondary)" }}>
                      No members found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser.uid;
                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: "var(--lrc-text-primary)" }}>
                            {u.firstName || "Unknown"} {u.lastName || ""}
                          </div>
                          {isSelf && (
                            <span style={{ fontSize: 11, color: "var(--lrc-teal)", fontWeight: 600 }}>
                              (You)
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: 13, color: "var(--lrc-text-secondary)" }}>
                          {u.email || "No email"}
                        </td>
                        <td style={{ textTransform: "capitalize" }}>
                          {u.city ? u.city.replace("_", " ") : "—"}
                        </td>
                        <td>
                          {u.totalPoints || 0} pts
                        </td>
                        <td>
                          {u.isAdmin ? (
                            <span style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: 4, 
                              fontSize: 11, 
                              fontWeight: 700,
                              background: "var(--lrc-purple-light)",
                              color: "var(--lrc-purple)",
                              padding: "4px 10px",
                              borderRadius: 12
                            }}>
                              <Shield size={12} /> Admin
                            </span>
                          ) : (
                            <span style={{ 
                              display: "inline-flex", 
                              alignItems: "center", 
                              gap: 4, 
                              fontSize: 11, 
                              fontWeight: 600,
                              background: "var(--lrc-bg)",
                              color: "var(--lrc-text-secondary)",
                              padding: "4px 10px",
                              borderRadius: 12
                            }}>
                              <User size={12} /> Runner
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            style={{ 
                              padding: "6px 12px", 
                              fontSize: 12,
                              borderColor: u.isAdmin ? "var(--lrc-border)" : "var(--lrc-teal)",
                              color: u.isAdmin ? "var(--lrc-text-secondary)" : "var(--lrc-teal)",
                              opacity: isSelf ? 0.5 : 1
                            }}
                            onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                            disabled={togglingUid === u.id || isSelf}
                            title={isSelf ? "You cannot change your own role" : ""}
                          >
                            {togglingUid === u.id ? (
                              "Updating..."
                            ) : u.isAdmin ? (
                              <>Remove Admin</>
                            ) : (
                              <>Make Admin</>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
