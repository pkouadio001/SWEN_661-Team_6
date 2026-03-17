import { useState } from 'react';
import { AlertTriangle, Phone, Search, Plus, Pencil, Trash2, Shield, FileText, User, Activity, FileIcon } from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  relationship: string;
  priority: 'Primary' | 'Secondary';
  phone: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: 'Sarah Doe',         relationship: 'Spouse',                priority: 'Primary',   phone: '(555) 123-4567' },
  { id: 2, name: 'Dr. Emily Roberts', relationship: 'Primary Care Physician', priority: 'Primary',   phone: '(555) 234-5678' },
  { id: 3, name: 'Michael Doe',       relationship: 'Son',                   priority: 'Secondary', phone: '(555) 345-6789' },
];

const priorityStyle = {
  Primary:   { bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' },
  Secondary: { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
};

export default function EmergencyPage() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeTab, setActiveTab] = useState<'Contacts' | 'Medical Info' | 'Protocols'>('Contacts');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Priorities');
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '', relationship: '', priority: 'Primary' as 'Primary' | 'Secondary', phone: '',
  });

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (c.name.toLowerCase().includes(q) || c.relationship.toLowerCase().includes(q)) &&
      (filter === 'All Priorities' || c.priority === filter);
  });

  const handleAdd = () => {
    if (!newContact.name) return;
    setContacts((p) => [...p, { id: Date.now(), ...newContact }]);
    setNewContact({ name: '', relationship: '', priority: 'Primary', phone: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number) => setContacts((p) => p.filter((c) => c.id !== id));

  return (
    <div style={{ background: '#FFF5F5', minHeight: '100vh', paddingBottom: 40 }}>

      {/* ── PAGE HEADER ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, justifyContent: 'center', paddingTop: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={26} color="#DC2626" />
        </div>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: 0 }}>Emergency Center</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Quick access to emergency contacts and medical information</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 16px' }}>

        {/* ── 911 BUTTON ── */}
        <div style={{
          background: '#FFFFFF', border: '2px solid #FECACA',
          borderRadius: 14, padding: 6, marginBottom: 24,
        }}>
          <button style={{
            width: '100%', padding: '20px',
            background: '#DC2626', color: '#fff', border: 'none',
            borderRadius: 10, cursor: 'pointer', fontSize: 20, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Phone size={22} /> CALL 911 - EMERGENCY
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: '#DC2626', fontWeight: 500, margin: '10px 0 4px' }}>
            For life-threatening emergencies only
          </p>
        </div>

        {/* ── TABS ── */}
        <div style={{
          display: 'flex', background: '#FFFFFF',
          border: '1px solid #E2E8F0', borderRadius: 12,
          padding: 5, marginBottom: 20, gap: 4,
        }}>
          {(['Contacts', 'Medical Info', 'Protocols'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '9px', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontSize: 13,
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab
                  ? (tab === 'Medical Info' ? '#DC2626' : tab === 'Protocols' ? '#64748B' : '#0F172A')
                  : '#64748B',
                background: activeTab === tab ? '#F1F5F9' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}
            >
              {tab === 'Contacts'     && <Phone size={14} />}
              {tab === 'Medical Info' && <Shield size={14} color={activeTab === tab ? '#DC2626' : '#94A3B8'} />}
              {tab === 'Protocols'    && <FileText size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB 1 — CONTACTS
        ══════════════════════════════ */}
        {activeTab === 'Contacts' && (
          <>
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 14, padding: '18px 20px', marginBottom: 20,
            }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 14 }}>
                <div style={{ flex: 2, minWidth: 180 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Search Contacts</p>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      placeholder="Search by name or relationship..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px 8px 30px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#0F172A', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Filter by Priority</p>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#0F172A', background: '#fff' }}
                  >
                    <option>All Priorities</option>
                    <option>Primary</option>
                    <option>Secondary</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 18px', background: '#16A34A', color: '#fff',
                  border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >
                <Plus size={15} /> Add Emergency Contact
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
              {filtered.map((c) => {
                const ps = priorityStyle[c.priority];
                return (
                  <div key={c.id} style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 14, padding: '18px 18px 14px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>{c.name}</p>
                      <span style={{
                        padding: '2px 8px', background: ps.bg, color: ps.color,
                        border: `1px solid ${ps.border}`, borderRadius: 5,
                        fontSize: 11, fontWeight: 600, flexShrink: 0, marginLeft: 6,
                      }}>{c.priority}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 14px 0' }}>{c.relationship}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                      <Phone size={14} color="#3B82F6" />
                      <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{c.phone}</p>
                    </div>
                    <button style={{
                      width: '100%', padding: '9px', background: '#16A34A', color: '#fff',
                      border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 10,
                    }}>
                      <Phone size={14} /> Call Now
                    </button>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{ flex: 1, padding: '7px', border: '1px solid #E2E8F0', borderRadius: 7, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{ flex: 1, padding: '7px', border: '1px solid #FECDD3', borderRadius: 7, background: '#FFF1F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E11D48' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══════════════════════════════
            TAB 2 — MEDICAL INFO
        ══════════════════════════════ */}
        {activeTab === 'Medical Info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Top Row — two columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Personal Medical Information */}
              <div style={{
                background: '#FFFFFF', border: '1px solid #BFDBFE',
                borderRadius: 14, padding: '20px 20px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <User size={18} color="#3B82F6" />
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Personal Medical Information</p>
                </div>

                {/* Blood Type */}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Blood Type</p>
                <div style={{
                  background: '#EFF6FF', border: '1px solid #BFDBFE',
                  borderRadius: 8, padding: '9px 14px', marginBottom: 14,
                }}>
                  <p style={{ fontSize: 14, color: '#1D4ED8', margin: 0 }}>O+</p>
                </div>

                {/* Allergies */}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Allergies</p>
                <div style={{
                  background: '#FFF1F2', border: '1px solid #FECDD3',
                  borderRadius: 8, padding: '9px 14px', marginBottom: 14,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <AlertTriangle size={14} color="#E11D48" />
                  <p style={{ fontSize: 14, color: '#E11D48', margin: 0 }}>Penicillin, Peanuts</p>
                </div>

                {/* Current Medications */}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Current Medications</p>
                <div style={{
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  borderRadius: 8, padding: '9px 14px', marginBottom: 14,
                }}>
                  <p style={{ fontSize: 14, color: '#166534', margin: 0 }}>
                    Levodopa 100mg (3x daily), Vitamin D 1000 IU (1x daily)
                  </p>
                </div>

                {/* Medical ID */}
                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Medical ID</p>
                <div style={{
                  background: '#F8FAFC', border: '1px solid #E2E8F0',
                  borderRadius: 8, padding: '9px 14px',
                }}>
                  <p style={{ fontSize: 14, color: '#334155', margin: 0 }}>MED-123456</p>
                </div>
              </div>

              {/* Medical Conditions */}
              <div style={{
                background: '#FFFFFF', border: '1px solid #FED7AA',
                borderRadius: 14, padding: '20px 20px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <Activity size={18} color="#EA580C" />
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Medical Conditions</p>
                </div>

                {/* Parkinson's Disease */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #E2E8F0',
                  borderRadius: 10, padding: '14px 16px', marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Parkinson's Disease</p>
                    <span style={{
                      padding: '2px 10px', background: '#1E293B', color: '#F97316',
                      borderRadius: 5, fontSize: 11, fontWeight: 600,
                    }}>moderate</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Diagnosed 2020, on medication</p>
                </div>

                {/* Hypertension */}
                <div style={{
                  background: '#FFFFFF', border: '1px solid #E2E8F0',
                  borderRadius: 10, padding: '14px 16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: 0 }}>Hypertension</p>
                    <span style={{
                      padding: '2px 10px', background: '#1E293B', color: '#FFFFFF',
                      borderRadius: 5, fontSize: 11, fontWeight: 600,
                    }}>mild</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0 }}>Controlled with medication</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 14, padding: '20px 24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <FileIcon size={18} color="#7C3AED" />
                <p style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0 }}>Insurance Information</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Provider</p>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
                    <p style={{ fontSize: 14, color: '#334155', margin: 0 }}>HealthCare Plus</p>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Insurance ID</p>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '9px 14px' }}>
                    <p style={{ fontSize: 14, color: '#334155', margin: 0 }}>INS-789012</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB 3 — PROTOCOLS
        ══════════════════════════════ */}
        {activeTab === 'Protocols' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 14, padding: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <AlertTriangle size={18} color="#DC2626" />
              <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>Emergency Protocols</p>
            </div>

            {/* If You Fall */}
            <div style={{
              background: '#FFF5F5', border: '1px solid #FECACA',
              borderRadius: 12, padding: '18px 20px', marginBottom: 14,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', margin: '0 0 12px 0' }}>If You Fall</p>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  "Stay calm. Don't try to get up immediately.",
                  'Check yourself for injuries.',
                  'If injured, call 911 immediately.',
                  'If not injured, slowly roll onto your side, then get onto hands and knees.',
                  'Crawl to sturdy furniture and slowly stand up.',
                  'Call Sarah (Primary Contact) to inform them.',
                ].map((step, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Medication Emergency */}
            <div style={{
              background: '#FFFBEB', border: '1px solid #FDE68A',
              borderRadius: 12, padding: '18px 20px', marginBottom: 14,
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#D97706', margin: '0 0 12px 0' }}>Medication Emergency</p>
              <ol style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'If you miss a dose, take it as soon as you remember.',
                  "If it's almost time for the next dose, skip the missed dose.",
                  'NEVER double up on doses.',
                  'If you experience severe side effects, call Dr. Roberts immediately.',
                  'Keep poison control number handy: 1-800-222-1222',
                ].map((step, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Severe Parkinson's Symptoms */}
            <div style={{
              background: '#FFFBEB', border: '1px solid #FCD34D',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#D97706', margin: '0 0 6px 0' }}>Severe Parkinson's Symptoms</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 10px 0' }}>
                Call Dr. Roberts if you experience:
              </p>
              <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6, listStyleType: 'disc' }}>
                {[
                  'Sudden worsening of tremors or rigidity',
                  'Difficulty swallowing or breathing',
                  'Severe confusion or hallucinations',
                  'Unable to move or "freezing" episodes lasting more than a few minutes',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD CONTACT MODAL ── */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 16, padding: 28, width: 420, maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#0F172A' }}>Add Emergency Contact</h3>
            {([
              ['name',         'Full Name'],
              ['relationship', 'Relationship'],
              ['phone',        'Phone Number'],
            ] as [keyof typeof newContact, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#0F172A', boxSizing: 'border-box', outline: 'none' }}
                  value={newContact[key] as string}
                  onChange={(e) => setNewContact((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Priority</label>
              <select
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff' }}
                value={newContact.priority}
                onChange={(e) => setNewContact((p) => ({ ...p, priority: e.target.value as 'Primary' | 'Secondary' }))}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#334155' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                style={{ padding: '9px 18px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}