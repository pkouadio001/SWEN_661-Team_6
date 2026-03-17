import { useNavigate } from 'react-router-dom';
import { Heart, Settings, LogOut, Pill, Calendar, Activity, MessageSquare, Phone } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Medications',     path: '/medications',  icon: <Pill size={28} />,         iconBg: '#DBEAFE', iconColor: '#3B82F6', border: '#BFDBFE', badge: null },
    { label: 'Appointments',    path: '/appointments', icon: <Calendar size={28} />,      iconBg: '#CCFBF1', iconColor: '#0D9488', border: '#99F6E4', badge: null },
    { label: 'Health Log',      path: '/healthlog',    icon: <Activity size={28} />,      iconBg: '#EDE9FE', iconColor: '#7C3AED', border: '#DDD6FE', badge: null },
    { label: 'Caretaker Notes', path: '/messages',     icon: <MessageSquare size={28} />, iconBg: '#FEF9C3', iconColor: '#CA8A04', border: '#FDE68A', badge: 1    },
    { label: 'Emergency',       path: '/emergency',    icon: <Phone size={28} />,         iconBg: '#FFE4E6', iconColor: '#E11D48', border: '#FECDD3', badge: null },
  ];

  const schedule = [
    { id: 1, title: 'Morning Medication',   sub: 'Levodopa 100mg + Vitamin D',    time: '8:00 AM',  status: 'Completed', statusBg: '#DCFCE7', statusColor: '#16A34A', iconBg: '#DBEAFE', iconColor: '#3B82F6', border: '#E2E8F0', bg: '#FFFFFF' },
    { id: 2, title: 'Afternoon Medication', sub: 'Levodopa 100mg',                time: '2:00 PM',  status: 'Upcoming',  statusBg: '#FEF9C3', statusColor: '#CA8A04', iconBg: '#FEF9C3', iconColor: '#CA8A04', border: '#FDE68A', bg: '#FFFBEB' },
    { id: 3, title: 'Physical Therapy',     sub: 'Weekly session with Dr. Smith', time: '3:30 PM',  status: 'Scheduled', statusBg: '#F1F5F9', statusColor: '#64748B', iconBg: '#CCFBF1', iconColor: '#0D9488', border: '#E2E8F0', bg: '#FFFFFF' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(135deg, #6D28D9, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={20} color="#fff" fill="white" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>CareConnect</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Welcome, John Doe</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/account-settings')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: '1px solid #E2E8F0',
              borderRadius: 8, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: '#334155',
            }}
          >
            <Settings size={15} /> Account
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', border: '1px solid #E2E8F0',
              borderRadius: 8, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 13, fontWeight: 500, color: '#334155',
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 500, margin: '0 auto', padding: '28px 16px' }}>

        {/* Quick Actions */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 24 }}>
          {quickActions.map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 10, padding: '18px 8px',
                background: '#FFFFFF', border: `2px solid ${a.border}`,
                borderRadius: 14, cursor: 'pointer', minHeight: 110,
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {a.badge && (
                <span style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 18, height: 18, borderRadius: '50%',
                  background: '#EF4444', color: '#fff',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {a.badge}
                </span>
              )}
              <div style={{
                width: 54, height: 54, borderRadius: 12,
                background: a.iconBg, color: a.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {a.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0F172A', textAlign: 'center', lineHeight: 1.3 }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>

        {/* Message Banner */}
        <div style={{
          background: '#FFFBEB', border: '2px solid #FCD34D',
          borderRadius: 14, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 10,
              background: '#FEF3C7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageSquare size={22} color="#D97706" />
            </div>
            <span style={{
              position: 'absolute', top: -6, right: -6,
              width: 18, height: 18, borderRadius: '50%',
              background: '#EF4444', color: '#fff',
              fontSize: 10, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              1
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
              New Message from Your Caretaker!
            </p>
            <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 3px 0' }}>
              Sarah Doe has sent you an important reminder
            </p>
            <p style={{ fontSize: 12, color: '#78716C', margin: 0, fontStyle: 'italic' }}>
              "Remember to take your Levodopa with food today..."
            </p>
          </div>
          <button
            onClick={() => navigate('/messages')}
            style={{
              padding: '10px 18px', background: '#D97706', color: '#FFFFFF',
              border: 'none', borderRadius: 9, cursor: 'pointer',
              fontSize: 13, fontWeight: 700, flexShrink: 0, whiteSpace: 'nowrap',
            }}
          >
            Read Message
          </button>
        </div>

        {/* Today's Schedule */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Today's Schedule</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {schedule.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.bg, border: `1px solid ${item.border}`,
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 9,
                background: item.iconBg, color: item.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Pill size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>{item.title}</p>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{item.sub}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#3B82F6', margin: '0 0 4px 0' }}>{item.time}</p>
                <span style={{
                  padding: '2px 9px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                  background: item.statusBg, color: item.statusColor,
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Contacts */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Emergency Contacts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
          <div style={{
            background: '#FFFFFF', border: '1px solid #FECDD3',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: '#FFE4E6', color: '#E11D48',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Phone size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 1px 0' }}>Emergency Services</p>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>911</p>
            </div>
            <button style={{
              padding: '6px 12px', background: '#EF4444', color: '#fff',
              border: 'none', borderRadius: 7, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Phone size={12} /> Call
            </button>
          </div>

          <div style={{
            background: '#FFFFFF', border: '1px solid #BFDBFE',
            borderRadius: 12, padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: '#DBEAFE', color: '#3B82F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Phone size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '0 0 1px 0' }}>Primary Caregiver</p>
              <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 1px 0' }}>Sarah Doe</p>
              <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>(555) 123-4567</p>
            </div>
            <button style={{
              padding: '6px 12px', background: '#3B82F6', color: '#fff',
              border: 'none', borderRadius: 7, cursor: 'pointer',
              fontSize: 12, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Phone size={12} /> Call
            </button>
          </div>
        </div>

        {/* Health Summary */}
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 14 }}>Health Summary</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Steps Today', value: '3,245', sub: 'Goal: 5,000',  icon: <Activity size={16} />, iconColor: '#7C3AED', iconBg: '#EDE9FE', valColor: '#7C3AED' },
            { label: 'Heart Rate',  value: '72 bpm', sub: 'Normal range', icon: <Heart size={16} />,   iconColor: '#0D9488', iconBg: '#CCFBF1', valColor: '#0D9488' },
            { label: 'Sleep',       value: '7.5 hrs', sub: 'Last night',  icon: <span style={{ fontSize: 14 }}>🕐</span>, iconColor: '#D97706', iconBg: '#FEF3C7', valColor: '#D97706' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#FFFFFF', border: '1px solid #E2E8F0',
                borderRadius: 12, padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: stat.iconBg, color: stat.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {stat.icon}
                </div>
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>{stat.label}</p>
              </div>
              <p style={{ fontSize: 22, fontWeight: 700, color: stat.valColor, margin: '0 0 2px 0' }}>{stat.value}</p>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}