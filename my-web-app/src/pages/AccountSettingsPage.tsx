import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, User, Pill, Calendar, Settings, LayoutDashboard, LogOut, Edit, Plus, Trash2 } from 'lucide-react';

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'medications' | 'appointments' | 'settings'>('profile');

  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'demo@careconnect.com',
    phone: '(555) 123-4567',
    dob: '5/14/1960',
    contactName: 'Sarah Doe',
    contactPhone: '(555) 987-6543',
  });
  const [editProfile, setEditProfile] = useState({ ...profile });
  const [showEditModal, setShowEditModal] = useState(false);

  const [medications, setMedications] = useState([
    { id: 1, name: 'Levodopa',  dosage: '100mg',   frequency: '3 times daily', times: '8:00 AM, 2:00 PM, 8:00 PM' },
    { id: 2, name: 'Vitamin D', dosage: '1000 IU',  frequency: 'Once daily',    times: '8:00 AM' },
  ]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', times: '' });

  const [appointments] = useState([
    { id: 1, name: 'Physical Therapy',    doctor: 'Dr. Smith',   location: 'Room 204',  date: 'March 15, 2026 at 3:30 PM',  color: '#0D9488', bg: '#E6F7F5', iconBg: '#CCEFEB' },
    { id: 2, name: 'Neurologist Check-up', doctor: 'Dr. Johnson', location: 'Suite 401', date: 'March 22, 2026 at 10:00 AM', color: '#7C3AED', bg: '#F5F3FF', iconBg: '#EDE9FE' },
  ]);

  const [settings, setSettings] = useState({
    textSize: 'Large (Current)',
    notifications: 'All Notifications',
    language: 'English',
  });
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setShowEditModal(false);
  };

  const handleAddMed = () => {
    if (!newMed.name) return;
    setMedications((p) => [...p, { id: Date.now(), ...newMed }]);
    setNewMed({ name: '', dosage: '', frequency: '', times: '' });
    setShowAddMed(false);
  };

  const handleDeleteMed = (id: number) => setMedications((p) => p.filter((m) => m.id !== id));

  const handleSaveSettings = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const tabs = [
    { id: 'profile',      label: 'Profile',      icon: <User size={14} /> },
    { id: 'medications',  label: 'Medications',  icon: <Pill size={14} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={14} /> },
    { id: 'settings',     label: 'Settings',     icon: <Settings size={14} /> },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
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
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>CareConnect</p>
            <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Account Settings</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', border: '1px solid #E2E8F0',
              borderRadius: 8, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#334155',
            }}
          >
            <LayoutDashboard size={15} /> Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 18px', border: '1px solid #E2E8F0',
              borderRadius: 8, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: '#334155',
            }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px' }}>

        {/* ── TAB BAR ── */}
        <div style={{
          display: 'flex', gap: 4,
          background: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 14, padding: 6, marginBottom: 24,
        }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                padding: '10px 0', borderRadius: 9, border: 'none',
                cursor: 'pointer', fontSize: 14,
                fontWeight: activeTab === t.id ? 600 : 400,
                color: activeTab === t.id ? '#FFFFFF' : '#64748B',
                background: activeTab === t.id ? '#2563EB' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB 1 — PROFILE
        ══════════════════════════════ */}
        {activeTab === 'profile' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Personal Information</h2>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your personal details</p>
              </div>
              <button
                onClick={() => { setEditProfile({ ...profile }); setShowEditModal(true); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', background: '#2563EB', color: '#FFFFFF',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                <Edit size={14} /> Edit Profile
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Full Name</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Email</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.email}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Phone Number</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.phone}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Date of Birth</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.dob}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', margin: '24px 0' }} />
            <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', marginBottom: 16 }}>Emergency Contact</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Contact Name</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.contactName}</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>Contact Phone</p>
                <p style={{ fontSize: 16, fontWeight: 500, color: '#0F172A', margin: 0 }}>{profile.contactPhone}</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB 2 — MEDICATIONS
        ══════════════════════════════ */}
        {activeTab === 'medications' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, padding: '24px 28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>My Medications</h2>
                <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Track and manage your medications</p>
              </div>
              <button
                onClick={() => setShowAddMed(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 18px', background: '#0D9488', color: '#FFFFFF',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600,
                }}
              >
                <Plus size={15} /> Add Medication
              </button>
            </div>

            {medications.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94A3B8', padding: '32px 0' }}>No medications added yet.</p>
            )}

            {medications.map((med) => (
              <div key={med.id} style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 12, padding: '16px 18px',
                display: 'flex', alignItems: 'flex-start', gap: 14,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: '#DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Pill size={20} color="#2563EB" />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>{med.name}</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
                    <div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Dosage</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: '1px 0 8px' }}>{med.dosage}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Frequency</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: '1px 0 8px' }}>{med.frequency}</p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Times</p>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#334155', margin: '1px 0 0' }}>{med.times}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMed(med.id)}
                  style={{
                    width: 34, height: 34, border: '1px solid #FCA5A5',
                    borderRadius: 8, background: '#FEF2F2', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#EF4444', flexShrink: 0,
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════
            TAB 3 — APPOINTMENTS
        ══════════════════════════════ */}
        {activeTab === 'appointments' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, padding: '24px 28px',
          }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>Upcoming Appointments</h2>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>View and manage your appointments</p>
            </div>

            {appointments.map((appt) => (
              <div key={appt.id} style={{
                background: appt.bg,
                border: `1px solid ${appt.color}33`,
                borderRadius: 12, padding: '16px 18px',
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 12,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: appt.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Calendar size={20} color={appt.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>{appt.name}</p>
                  <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 4px 0' }}>{appt.doctor} - {appt.location}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: appt.color, margin: 0 }}>{appt.date}</p>
                </div>

                <button style={{
                  padding: '9px 18px', background: appt.color, color: '#FFFFFF',
                  border: 'none', borderRadius: 8, cursor: 'pointer',
                  fontSize: 14, fontWeight: 600, flexShrink: 0,
                }}>
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════
            TAB 4 — SETTINGS
        ══════════════════════════════ */}
        {activeTab === 'settings' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, padding: '24px 28px',
          }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>App Settings</h2>
              <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Customize your experience</p>
            </div>

            {[
              { key: 'textSize',      label: 'Text Size',      options: ['Small', 'Medium', 'Large (Current)', 'Extra Large'] },
              { key: 'notifications', label: 'Notifications',  options: ['All Notifications', 'Appointments Only', 'Medications Only', 'None'] },
              { key: 'language',      label: 'Language',       options: ['English', 'Spanish', 'French', 'German'] },
            ].map((row, i, arr) => (
              <div
                key={row.key}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600, color: '#0F172A' }}>
                  {row.label} <span style={{ fontSize: 13, color: '#94A3B8' }}>ⓘ</span>
                </span>
                <select
                  value={settings[row.key as keyof typeof settings]}
                  onChange={(e) => setSettings((s) => ({ ...s, [row.key]: e.target.value }))}
                  style={{
                    padding: '8px 12px', border: '1px solid #E2E8F0',
                    borderRadius: 8, fontSize: 14, color: '#334155',
                    background: '#FFFFFF', cursor: 'pointer', minWidth: 170,
                  }}
                >
                  {row.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #E2E8F0', marginTop: 8, paddingTop: 20 }}>
              <button
                onClick={handleSaveSettings}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '11px 22px',
                  background: savedSettings ? '#0D9488' : '#2563EB',
                  color: '#FFFFFF', border: 'none', borderRadius: 8,
                  cursor: 'pointer', fontSize: 14, fontWeight: 600,
                  transition: 'background 0.2s',
                }}
              >
                <Settings size={15} />
                {savedSettings ? 'Settings Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════
          MODAL — EDIT PROFILE
      ══════════════════════════════ */}
      {showEditModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 28, width: 440, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#0F172A' }}>Edit Profile</h3>
            {([
              ['fullName',     'Full Name'],
              ['email',        'Email'],
              ['phone',        'Phone Number'],
              ['dob',          'Date of Birth'],
              ['contactName',  'Emergency Contact Name'],
              ['contactPhone', 'Emergency Contact Phone'],
            ] as [keyof typeof editProfile, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: '#64748B', display: 'block', marginBottom: 5 }}>{label}</label>
                <input
                  style={{
                    width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0',
                    borderRadius: 8, fontSize: 14, color: '#0F172A',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                  value={editProfile[key]}
                  onChange={(e) => setEditProfile((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, color: '#334155' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                style={{ padding: '9px 18px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          MODAL — ADD MEDICATION
      ══════════════════════════════ */}
      {showAddMed && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowAddMed(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#0F172A' }}>Add Medication</h3>
            {([
              ['name',      'Medication Name'],
              ['dosage',    'Dosage (e.g. 100mg)'],
              ['frequency', 'Frequency (e.g. Once daily)'],
              ['times',     'Times (e.g. 8:00 AM, 2:00 PM)'],
            ] as [keyof typeof newMed, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: '#64748B', display: 'block', marginBottom: 5 }}>{label}</label>
                <input
                  style={{
                    width: '100%', padding: '9px 12px', border: '1px solid #E2E8F0',
                    borderRadius: 8, fontSize: 14, color: '#0F172A',
                    boxSizing: 'border-box', outline: 'none',
                  }}
                  placeholder={label}
                  value={newMed[key]}
                  onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowAddMed(false)}
                style={{ padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 14, color: '#334155' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMed}
                style={{ padding: '9px 18px', background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
              >
                Add Medication
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}