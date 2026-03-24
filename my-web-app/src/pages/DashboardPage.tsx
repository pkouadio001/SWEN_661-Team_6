import { useNavigate } from 'react-router-dom';
import { Heart, Settings, LogOut, Pill, Calendar, Activity, MessageSquare, Phone, Clock } from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();

  const quickActions = [
    { label: 'Medications',     sub: 'Track your daily doses',           path: '/medications',  icon: <Pill size={48} />,         iconBg: '#DBEAFE', iconColor: '#3B82F6', border: '#BFDBFE', badge: null },
    { label: 'Appointments',    sub: 'View upcoming visits',             path: '/appointments', icon: <Calendar size={48} />,      iconBg: '#CCFBF1', iconColor: '#0D9488', border: '#99F6E4', badge: null },
    { label: 'Health Log',      sub: 'Log symptoms and mood',            path: '/healthlog',    icon: <Activity size={48} />,      iconBg: '#EDE9FE', iconColor: '#7C3AED', border: '#DDD6FE', badge: null },
    { label: 'Caretaker Notes', sub: 'Messages from your care team',     path: '/messages',     icon: <MessageSquare size={48} />, iconBg: '#FEF9C3', iconColor: '#CA8A04', border: '#FDE68A', badge: 1    },
    { label: 'Emergency',       sub: 'Quick access to emergency help',   path: '/emergency',    icon: <Phone size={48} />,         iconBg: '#FFE4E6', iconColor: '#E11D48', border: '#FECDD3', badge: null },
  ];

  const schedule = [
    { id: 1, title: 'Morning Medication',   sub: 'Levodopa 100mg + Vitamin D',    time: '8:00 AM',  status: 'Completed', statusBg: '#DCFCE7', statusColor: '#16A34A', iconBg: '#DBEAFE', iconColor: '#3B82F6', border: '#E2E8F0', bg: '#FFFFFF' },
    { id: 2, title: 'Afternoon Medication', sub: 'Levodopa 100mg',                time: '2:00 PM',  status: 'Upcoming',  statusBg: '#FEF9C3', statusColor: '#CA8A04', iconBg: '#FEF9C3', iconColor: '#CA8A04', border: '#FDE68A', bg: '#FFFBEB' },
    { id: 3, title: 'Physical Therapy', sub: 'Weekly session with Dr. Smith', time: '3:30 PM', status: 'Scheduled', statusBg: '#F1F5F9', statusColor: '#64748B', iconBg: '#CCFBF1', iconColor: '#0D9488', border: '#E2E8F0', bg: '#FFFFFF', scheduleIcon: 'calendar' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <header style={{
        background: '#FFFFFF', borderBottom: '2px solid #E2E8F0',
        padding: '0 40px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 80,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12,
            background: 'linear-gradient(135deg, #6D28D9, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Heart size={26} color="#fff" fill="white" />
          </div>
          <div>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>CareConnect</p>
            <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>Welcome, John Doe</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/account-settings')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', border: '2px solid #E2E8F0',
            borderRadius: 10, background: '#FFFFFF', cursor: 'pointer',
            fontSize: 17, fontWeight: 600, color: '#334155', minHeight: 52,
          }}>
            <Settings size={20} /> Account
          </button>
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', border: '2px solid #E2E8F0',
            borderRadius: 10, background: '#FFFFFF', cursor: 'pointer',
            fontSize: 17, fontWeight: 600, color: '#334155', minHeight: 52,
          }}>
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>

        {/* ── QUICK ACTIONS ── */}
        {/* CHANGED: switched from 5-column narrow vertical tiles
            to 2-3 column wide horizontal cards matching landing page style.
            Icon on LEFT, text on RIGHT. Much wider and more accessible. */}
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', marginBottom: 24 }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 20,
          marginBottom: 44,
        }}>
          {quickActions.map((a) => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 24,
                padding: '28px 32px',
                background: '#FFFFFF',
                border: `2px solid ${a.border}`,
                borderRadius: 20,
                cursor: 'pointer',
                minHeight: 120,
                textAlign: 'left',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Badge */}
              {a.badge && (
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#EF4444', color: '#fff',
                  fontSize: 15, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{a.badge}</span>
              )}

              {/* Icon */}
              <div style={{
                width: 88, height: 88, borderRadius: 20,
                background: a.iconBg, color: a.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {a.icon}
              </div>

              {/* Text */}
              <div>
                <p style={{
                  fontSize: 22, fontWeight: 700, color: '#0F172A',
                  margin: '0 0 6px 0', lineHeight: 1.2,
                }}>
                  {a.label}
                </p>
                <p style={{
                  fontSize: 16, color: '#64748B',
                  margin: 0, lineHeight: 1.5,
                }}>
                  {a.sub}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* ── MESSAGE BANNER ── */}
        <div style={{
          background: '#FFFBEB', border: '2px solid #FCD34D',
          borderRadius: 20, padding: '28px 36px',
          display: 'flex', alignItems: 'center', gap: 24, marginBottom: 44,
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 76, height: 76, borderRadius: 18,
              background: '#FEF3C7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MessageSquare size={38} color="#D97706" />
            </div>
            <span style={{
              position: 'absolute', top: -8, right: -8,
              width: 26, height: 26, borderRadius: '50%',
              background: '#EF4444', color: '#fff',
              fontSize: 14, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>1</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              New Message from Your Caretaker!
            </p>
            <p style={{ fontSize: 17, color: '#64748B', margin: '0 0 4px 0' }}>
              Sarah Doe has sent you an important reminder
            </p>
            <p style={{ fontSize: 17, color: '#78716C', margin: 0, fontStyle: 'italic' }}>
              "Remember to take your Levodopa with food today..."
            </p>
          </div>
          <button onClick={() => navigate('/messages')} style={{
            padding: '18px 32px', background: '#D97706', color: '#FFFFFF',
            border: 'none', borderRadius: 14, cursor: 'pointer',
            fontSize: 19, fontWeight: 700, flexShrink: 0,
            whiteSpace: 'nowrap', minHeight: 60,
          }}>
            Read Message
          </button>
        </div>

        {/* ── TODAY'S SCHEDULE ── */}
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
          Today's Schedule
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 44 }}>
          {schedule.map((item) => (
            <div key={item.id} style={{
              background: item.bg, border: `1px solid ${item.border}`,
              borderRadius: 18, padding: '26px 32px',
              display: 'flex', alignItems: 'center', gap: 24,
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 16,
                background: item.iconBg, color: item.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {item.scheduleIcon === 'calendar' ? <Calendar size={30} /> :
                <Pill size={30} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 5px 0' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>{item.sub}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#3B82F6', margin: '0 0 8px 0' }}>
                  {item.time}
                </p>
                <span style={{
                  padding: '7px 16px', borderRadius: 9, fontSize: 16, fontWeight: 700,
                  background: item.statusBg, color: item.statusColor,
                }}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── EMERGENCY CONTACTS ── */}
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
          Emergency Contacts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 44 }}>

          <div style={{
            background: '#FFFFFF', border: '2px solid #FECDD3',
            borderRadius: 18, padding: '26px 28px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: '#FFE4E6', color: '#E11D48',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Phone size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                Emergency Services
              </p>
              <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>911</p>
            </div>
            <button style={{
              padding: '14px 22px', background: '#EF4444', color: '#fff',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              fontSize: 18, fontWeight: 700, minHeight: 56,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Phone size={20} /> Call
            </button>
          </div>

          <div style={{
            background: '#FFFFFF', border: '2px solid #BFDBFE',
            borderRadius: 18, padding: '26px 28px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: '#DBEAFE', color: '#3B82F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Phone size={30} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                Primary Caregiver
              </p>
              <p style={{ fontSize: 17, color: '#64748B', margin: '0 0 3px 0' }}>Sarah Doe</p>
              <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>(555) 123-4567</p>
            </div>
            <button style={{
              padding: '14px 22px', background: '#3B82F6', color: '#fff',
              border: 'none', borderRadius: 12, cursor: 'pointer',
              fontSize: 18, fontWeight: 700, minHeight: 56,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Phone size={20} /> Call
            </button>
          </div>
        </div>

        {/* ── HEALTH SUMMARY ── */}
        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
          Health Summary
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {[
            { label: 'Steps Today', value: '3,245',  sub: 'Goal: 5,000',  icon: <Activity size={28} />, iconColor: '#7C3AED', iconBg: '#EDE9FE', valColor: '#7C3AED' },
            { label: 'Heart Rate',  value: '72 bpm',  sub: 'Normal range', icon: <Heart size={28} />,   iconColor: '#0D9488', iconBg: '#CCFBF1', valColor: '#0D9488' },
            { label: 'Sleep',       value: '7.5 hrs', sub: 'Last night',   icon: <Clock size={28} />,   iconColor: '#D97706', iconBg: '#FEF3C7', valColor: '#D97706', border: '#FDE68A' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 18, padding: '32px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: stat.iconBg, color: stat.iconColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {stat.icon}
                </div>
                <p style={{ fontSize: 19, color: '#64748B', margin: 0, fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
              <p style={{ fontSize: 36, fontWeight: 800, color: stat.valColor, margin: '0 0 6px 0' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: 16, color: '#94A3B8', margin: 0 }}>{stat.sub}</p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}