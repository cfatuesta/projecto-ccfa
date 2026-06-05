import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Trophy,
  ScanLine,
  Calendar,
  MessageSquareQuote,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import './admin.css';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/races', label: 'Races', icon: Trophy },
  { to: '/admin/attendance', label: 'Attendance', icon: ScanLine },
  { to: '/admin/events', label: 'Events', icon: Calendar },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setDrawerOpen(false);
      await logout();
      navigate('/signin');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="admin-container">
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button
          className="admin-mobile-hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="admin-mobile-brand">
          LRC <span>Admin</span>
        </span>
        <div style={{ width: 38 }} /> {/* spacer for centering */}
      </div>

      {/* Drawer Overlay */}
      <div
        className={`admin-drawer-overlay${drawerOpen ? ' active' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar${drawerOpen ? ' mobile-open' : ''}`}>
        <div className="admin-logo">
          LRC <span>Admin</span>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/dashboard"
            className="admin-link-back"
            onClick={() => setDrawerOpen(false)}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </NavLink>

          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-link${isActive ? ' active' : ''}`}
              onClick={() => setDrawerOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button onClick={handleLogout} className="admin-logout">
          <LogOut size={16} />
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
