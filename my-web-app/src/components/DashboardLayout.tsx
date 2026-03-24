import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, LayoutDashboard, Pill, Calendar, Activity, Phone, Settings, LogOut } from 'lucide-react';

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getPageLabel = () => {
    const path = location.pathname;
    if (path.includes('medications')) return 'Medications';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('healthlog')) return 'Health Log';
    if (path.includes('messages')) return 'Messages';
    if (path.includes('emergency')) return 'Emergency';
    if (path.includes('account-settings')) return 'Account Settings';
    return '';
  };

  const allNavLinks = [
    { path: '/dashboard',        label: 'Dashboard',   icon: <LayoutDashboard size={20} />, red: false },
    { path: '/medications',      label: 'Medications',  icon: <Pill size={20} />,            red: false },
    { path: '/appointments',     label: 'Appointments', icon: <Calendar size={20} />,        red: false },
    { path: '/healthlog',        label: 'Health Log',   icon: <Activity size={20} />,        red: false },
    { path: '/emergency',        label: 'Emergency',    icon: <Phone size={20} />,           red: true  },
    { path: '/account-settings', label: 'Account',      icon: <Settings size={20} />,        red: false },
  ];

  const navLinks = allNavLinks.filter(
    (link) => !location.pathname.includes(link.path.replace('/', ''))
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8' }}>
      <nav style={{
        background: '#FFFFFF',
        borderBottom: '2px solid #E2E8F0',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 28px',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 76,
        }}>
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'linear-gradient(135deg, #6D28D9, #3B82F6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Heart size={26} color="#fff" fill="white" />
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                CareConnect
              </p>
              {getPageLabel() && (
                <p style={{ fontSize: 14, color: '#6D28D9', margin: 0, fontWeight: 600 }}>
                  {getPageLabel()}
                </p>
              )}
            </div>
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px', borderRadius: 10,
                  textDecoration: 'none',
                  fontSize: 16, fontWeight: 500,
                  color: link.red ? '#E11D48' : '#64748B',
                  transition: 'all 0.15s',
                  minHeight: 52,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ color: link.red ? '#E11D48' : '#94A3B8' }}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => navigate('/')}
            style={{
              width: 52, height: 52,
              border: '2px solid #E2E8F0',
              borderRadius: 10, background: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748B',
            }}
            title="Sign Out"
          >
            <LogOut size={22} />
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px' }}>
        <Outlet />
      </main>
    </div>
  );
}