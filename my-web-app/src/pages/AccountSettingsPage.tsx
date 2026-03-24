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
    { id: 1, name: 'Levodopa',  dosage: '100mg',  frequency: '3 times daily', times: '8:00 AM, 2:00 PM, 8:00 PM' },
    { id: 2, name: 'Vitamin D', dosage: '1000 IU', frequency: 'Once daily',    times: '8:00 AM' },
  ]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', times: '' });

  const [appointments] = useState([
    { id: 1, name: 'Physical Therapy',     doctor: 'Dr. Smith',   location: 'Room 204',  date: 'March 15, 2026 at 3:30 PM',  color: '#0D9488', bg: '#E6F7F5', iconBg: '#CCEFEB' },
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
    { id: 'profile',      label: 'Profile',      icon: <User size={18} /> },
    { id: 'medications',  label: 'Medications',  icon: <Pill size={18} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} /> },
    { id: 'settings',     label: 'Settings',     icon: <Settings size={18} /> },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4F8', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      {/* CHANGED: height 64→76px, logo 42→52px, logo icon 20→26px,
                  title 16→20px, subtitle 12→15px, buttons minHeight 52px font 14→16px */}
      <header style={{
        background: '#FFFFFF', borderBottom: '2px solid #E2E8F0',
        padding: '0 28px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 76,
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
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
              CareConnect
            </p>
            <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Account Settings</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', border: '2px solid #E2E8F0',
              borderRadius: 10, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 16, fontWeight: 600, color: '#334155', minHeight: 52,
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', border: '2px solid #E2E8F0',
              borderRadius: 10, background: '#FFFFFF', cursor: 'pointer',
              fontSize: 16, fontWeight: 600, color: '#334155', minHeight: 52,
            }}
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── TAB BAR ── */}
        {/* CHANGED: tab padding 10→14px, font 14→17px, icon 14→18px,
                    border radius 9→11px, gap 4→6px */}
        <div style={{
          display: 'flex', gap: 6,
          background: '#FFFFFF', border: '1px solid #E2E8F0',
          borderRadius: 16, padding: 8, marginBottom: 28,
        }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 8,
                padding: '14px 0', borderRadius: 11, border: 'none',
                cursor: 'pointer', fontSize: 17,
                fontWeight: activeTab === t.id ? 700 : 500,
                color: activeTab === t.id ? '#FFFFFF' : '#64748B',
                background: activeTab === t.id ? '#2563EB' : 'transparent',
                transition: 'all 0.15s', minHeight: 52,
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB 1 — PROFILE
        ══════════════════════════════ */}
        {/* CHANGED: card padding 24→32px, section title 20→26px, subtitle 14→17px,
                    Edit button minHeight 52px font 14→16px icon 14→18px,
                    field labels 13→16px, field values 16→20px,
                    Emergency Contact title 16→20px, divider margin increased */}
        {activeTab === 'profile' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 18, padding: '32px 36px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                  Personal Information
                </h2>
                <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>Manage your personal details</p>
              </div>
              <button
                onClick={() => { setEditProfile({ ...profile }); setShowEditModal(true); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', background: '#2563EB', color: '#FFFFFF',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
              >
                <Edit size={18} /> Edit Profile
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px' }}>
              {[
                ['Full Name',    profile.fullName],
                ['Email',        profile.email],
                ['Phone Number', profile.phone],
                ['Date of Birth',profile.dob],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 6px 0' }}>{label}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid #E2E8F0', margin: '28px 0' }} />
            <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', marginBottom: 20 }}>
              Emergency Contact
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 40px' }}>
              {[
                ['Contact Name',  profile.contactName],
                ['Contact Phone', profile.contactPhone],
              ].map(([label, value]) => (
                <div key={label}>
                  <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 6px 0' }}>{label}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, color: '#0F172A', margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB 2 — MEDICATIONS
        ══════════════════════════════ */}
        {/* CHANGED: card padding 24→32px, title 20→26px, subtitle 14→17px,
                    Add button minHeight 52px font 14→16px, med card padding 16→22px,
                    pill icon box 44→54px icon 20→24px, med name 16→22px,
                    field labels 12→15px, field values 14→18px,
                    delete button 34→44px icon 15→20px */}
        {activeTab === 'medications' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 18, padding: '32px 36px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                  My Medications
                </h2>
                <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>Track and manage your medications</p>
              </div>
              <button
                onClick={() => setShowAddMed(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', background: '#0D9488', color: '#FFFFFF',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
              >
                <Plus size={18} /> Add Medication
              </button>
            </div>

            {medications.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94A3B8', padding: '40px 0', fontSize: 18 }}>
                No medications added yet.
              </p>
            )}

            {medications.map((med) => (
              <div key={med.id} style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 14, padding: '22px 24px',
                display: 'flex', alignItems: 'flex-start', gap: 18,
                marginBottom: 16,
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: '#DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Pill size={24} color="#2563EB" />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                    {med.name}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 28px' }}>
                    <div>
                      <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Dosage</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#334155', margin: '2px 0 10px' }}>
                        {med.dosage}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Frequency</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#334155', margin: '2px 0 10px' }}>
                        {med.frequency}
                      </p>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>Times</p>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#334155', margin: '2px 0 0' }}>
                        {med.times}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMed(med.id)}
                  style={{
                    width: 44, height: 44, border: '2px solid #FCA5A5',
                    borderRadius: 10, background: '#FEF2F2', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#EF4444', flexShrink: 0,
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ══════════════════════════════
            TAB 3 — APPOINTMENTS
        ══════════════════════════════ */}
        {/* CHANGED: card padding 24→32px, title 20→26px, subtitle 14→17px,
                    appt card padding 16→22px, calendar icon box 44→54px icon 20→24px,
                    appt name 16→22px, doctor/location 14→17px, date 14→18px,
                    View Details button minHeight 52px font 14→17px */}
        {activeTab === 'appointments' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 18, padding: '32px 36px',
          }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                Upcoming Appointments
              </h2>
              <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>View and manage your appointments</p>
            </div>

            {appointments.map((appt) => (
              <div key={appt.id} style={{
                background: appt.bg,
                border: `1px solid ${appt.color}33`,
                borderRadius: 14, padding: '22px 24px',
                display: 'flex', alignItems: 'center', gap: 18,
                marginBottom: 16,
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 12,
                  background: appt.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Calendar size={24} color={appt.color} />
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                    {appt.name}
                  </p>
                  <p style={{ fontSize: 17, color: '#64748B', margin: '0 0 6px 0' }}>
                    {appt.doctor} - {appt.location}
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: appt.color, margin: 0 }}>
                    {appt.date}
                  </p>
                </div>

                <button style={{
                  padding: '12px 22px', background: appt.color, color: '#FFFFFF',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 17, fontWeight: 700, flexShrink: 0, minHeight: 52,
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
        {/* CHANGED: card padding 24→32px, title 20→26px, subtitle 14→17px,
                    settings row padding 14→20px, label font 16→20px,
                    select minHeight 52px font 14→17px minWidth 170→200px,
                    Save button minHeight 52px font 14→17px icon 15→20px */}
        {activeTab === 'settings' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 18, padding: '32px 36px',
          }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                App Settings
              </h2>
              <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>Customize your experience</p>
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
                  padding: '20px 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #F1F5F9' : 'none',
                }}
              >
                <span style={{ fontSize: 20, fontWeight: 600, color: '#0F172A' }}>
                  {row.label} <span style={{ fontSize: 15, color: '#94A3B8' }}>ⓘ</span>
                </span>
                <select
                  value={settings[row.key as keyof typeof settings]}
                  onChange={(e) => setSettings((s) => ({ ...s, [row.key]: e.target.value }))}
                  style={{
                    padding: '12px 16px', border: '1px solid #E2E8F0',
                    borderRadius: 10, fontSize: 17, color: '#334155',
                    background: '#FFFFFF', cursor: 'pointer',
                    minWidth: 200, minHeight: 52,
                  }}
                >
                  {row.options.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #E2E8F0', marginTop: 10, paddingTop: 24 }}>
              <button
                onClick={handleSaveSettings}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 28px',
                  background: savedSettings ? '#0D9488' : '#2563EB',
                  color: '#FFFFFF', border: 'none', borderRadius: 10,
                  cursor: 'pointer', fontSize: 17, fontWeight: 700,
                  minHeight: 52, transition: 'background 0.2s',
                }}
              >
                <Settings size={20} />
                {savedSettings ? 'Settings Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── EDIT PROFILE MODAL ── */}
      {/* CHANGED: modal padding 28→38px, title 18→24px, labels 13→16px,
                  inputs minHeight 52px font 14→17px, buttons minHeight 52px font 14→17px */}
      {showEditModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 18, padding: 38, width: 500, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#0F172A' }}>
              Edit Profile
            </h3>
            {([
              ['fullName',     'Full Name'],
              ['email',        'Email'],
              ['phone',        'Phone Number'],
              ['dob',          'Date of Birth'],
              ['contactName',  'Emergency Contact Name'],
              ['contactPhone', 'Emergency Contact Phone'],
            ] as [keyof typeof editProfile, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 16, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {label}
                </label>
                <input
                  style={{
                    width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
                    borderRadius: 10, fontSize: 17, color: '#0F172A',
                    boxSizing: 'border-box', outline: 'none', minHeight: 52,
                  }}
                  value={editProfile[key]}
                  onChange={(e) => setEditProfile((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowEditModal(false)}
                style={{ padding: '12px 24px', border: '2px solid #E2E8F0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 17, color: '#334155', fontWeight: 600, minHeight: 52 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                style={{ padding: '12px 24px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 17, fontWeight: 700, minHeight: 52 }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MEDICATION MODAL ── */}
      {/* CHANGED: modal padding 28→38px, title 18→24px, labels 13→16px,
                  inputs minHeight 52px font 14→17px, buttons minHeight 52px font 14→17px */}
      {showAddMed && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowAddMed(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 18, padding: 38, width: 480, maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#0F172A' }}>
              Add Medication
            </h3>
            {([
              ['name',      'Medication Name'],
              ['dosage',    'Dosage (e.g. 100mg)'],
              ['frequency', 'Frequency (e.g. Once daily)'],
              ['times',     'Times (e.g. 8:00 AM, 2:00 PM)'],
            ] as [keyof typeof newMed, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 16, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  {label}
                </label>
                <input
                  style={{
                    width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
                    borderRadius: 10, fontSize: 17, color: '#0F172A',
                    boxSizing: 'border-box', outline: 'none', minHeight: 52,
                  }}
                  placeholder={label}
                  value={newMed[key]}
                  onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowAddMed(false)}
                style={{ padding: '12px 24px', border: '2px solid #E2E8F0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 17, color: '#334155', fontWeight: 600, minHeight: 52 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMed}
                style={{ padding: '12px 24px', background: '#0D9488', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 17, fontWeight: 700, minHeight: 52 }}
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