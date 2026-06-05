import { useAuth } from '../../context/AuthContext';
import { NavLink } from 'react-router-dom';
import {
  Users,
  Trophy,
  ScanLine,
  Calendar,
  MessageSquareQuote,
  ArrowRight,
} from 'lucide-react';

const QUICK_LINKS = [
  {
    to: '/admin/members',
    icon: Users,
    label: 'Members',
    description: 'Manage users and assign admin roles',
    color: 'var(--lrc-purple)',
    bg: 'var(--lrc-purple-light)',
  },
  {
    to: '/admin/races',
    icon: Trophy,
    label: 'Races',
    description: 'Create and manage upcoming races',
    color: 'var(--lrc-orange)',
    bg: 'var(--lrc-orange-light)',
  },
  {
    to: '/admin/attendance',
    icon: ScanLine,
    label: 'Attendance',
    description: 'Scan QR codes and track check-ins',
    color: 'var(--lrc-teal)',
    bg: 'var(--lrc-teal-light)',
  },
  {
    to: '/admin/events',
    icon: Calendar,
    label: 'Events',
    description: 'Manage community events',
    color: 'var(--lrc-olive)',
    bg: 'var(--lrc-olive-light)',
  },
  {
    to: '/admin/testimonials',
    icon: MessageSquareQuote,
    label: 'Testimonials',
    description: 'Curate member stories and quotes',
    color: 'var(--lrc-pink)',
    bg: 'var(--lrc-pink-light)',
  },
];

export default function Dashboard() {
  const { userProfile } = useAuth();
  const firstName = userProfile?.firstName || 'Admin';

  return (
    <div className="admin-dashboard">
      <h1>Welcome back, {firstName} 👋</h1>
      <p style={{ marginBottom: 28 }}>
        Manage your Latin Run Club community from here. Select a module below to get started.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 16,
      }}>
        {QUICK_LINKS.map(({ to, icon: Icon, label, description, color, bg }) => (
          <NavLink
            key={to}
            to={to}
            style={{
              textDecoration: 'none',
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              padding: 20,
              background: 'var(--lrc-card-bg)',
              border: '1px solid var(--lrc-border)',
              borderRadius: 'var(--lrc-radius-lg)',
              boxShadow: 'var(--lrc-shadow-sm)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--lrc-shadow-md)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--lrc-shadow-sm)'; }}
          >
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--lrc-radius-sm)',
              background: bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 15,
                fontWeight: 700,
                color: 'var(--lrc-text-primary)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {label}
                <ArrowRight size={14} style={{ color: 'var(--lrc-text-muted)' }} />
              </div>
              <div style={{
                fontSize: 12,
                color: 'var(--lrc-text-secondary)',
                lineHeight: 1.4,
              }}>
                {description}
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
