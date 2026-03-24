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
    <div style={{ background: '#FFF5F5', minHeight: '100vh', paddingBottom: 48 }}>

      {/* ── PAGE HEADER ── */}
      {/* CHANGED: icon box 48→64px, icon 26→32px, h1 30→36px, subtitle 14→18px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, justifyContent: 'center', paddingTop: 10 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#FEE2E2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <AlertTriangle size={32} color="#DC2626" />
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0 }}>Emergency Center</h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0 }}>
            Quick access to emergency contacts and medical information
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px' }}>

        {/* ── 911 BUTTON ── */}
        {/* CHANGED: button padding 20→26px, font 20→26px, icon 22→28px,
                    disclaimer font 13→16px, outer border 2px */}
        <div style={{
          background: '#FFFFFF', border: '2px solid #FECACA',
          borderRadius: 16, padding: 8, marginBottom: 28,
        }}>
          <button style={{
            width: '100%', padding: '26px',
            background: '#DC2626', color: '#fff', border: 'none',
            borderRadius: 12, cursor: 'pointer', fontSize: 26, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            minHeight: 80,
          }}>
            <Phone size={28} /> CALL 911 - EMERGENCY
          </button>
          <p style={{ textAlign: 'center', fontSize: 16, color: '#DC2626', fontWeight: 600, margin: '12px 0 6px' }}>
            For life-threatening emergencies only
          </p>
        </div>

        {/* ── TABS ── */}
        {/* CHANGED: tab padding 9→14px, font 13→16px, icon 14→18px,
                    minHeight 52px added, border radius 8→10px */}
        <div style={{
          display: 'flex', background: '#FFFFFF',
          border: '1px solid #E2E8F0', borderRadius: 14,
          padding: 6, marginBottom: 24, gap: 6,
        }}>
          {(['Contacts', 'Medical Info', 'Protocols'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '14px', border: 'none', borderRadius: 10,
                cursor: 'pointer', fontSize: 16, fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab
                  ? (tab === 'Medical Info' ? '#DC2626' : '#0F172A')
                  : '#64748B',
                background: activeTab === tab ? '#F1F5F9' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, minHeight: 52,
              }}
            >
              {tab === 'Contacts'     && <Phone size={18} />}
              {tab === 'Medical Info' && <Shield size={18} color={activeTab === tab ? '#DC2626' : '#94A3B8'} />}
              {tab === 'Protocols'    && <FileText size={18} />}
              {tab}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════
            TAB 1 — CONTACTS
        ══════════════════════════════ */}
        {/* CHANGED: search bar padding 18→26px, labels 12→15px, input minHeight 52px font 13→16px,
                    select minHeight 52px font 13→16px, Add button minHeight 52px font 13→16px,
                    contact card padding 18→24px, name font 15→20px, relationship 13→16px,
                    phone font 13→16px, phone icon 14→18px, Call Now button minHeight 52px font 13→16px,
                    edit/delete buttons 44px icon 13→18px */}
        {activeTab === 'Contacts' && (
          <>
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 14, padding: '22px 24px', marginBottom: 24,
            }}>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 18 }}>
                <div style={{ flex: 2, minWidth: 200 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Search Contacts
                  </p>
                  <div style={{ position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                    <input
                      placeholder="Search by name or relationship..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: '100%', padding: '14px 16px 14px 42px',
                        border: '1px solid #E2E8F0', borderRadius: 10,
                        fontSize: 16, color: '#0F172A', outline: 'none',
                        boxSizing: 'border-box', minHeight: 52,
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                    Filter by Priority
                  </p>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                      width: '100%', padding: '14px 12px',
                      border: '1px solid #E2E8F0', borderRadius: 10,
                      fontSize: 16, color: '#0F172A', background: '#fff', minHeight: 52,
                    }}
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
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '14px 24px', background: '#16A34A', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
              >
                <Plus size={20} /> Add Emergency Contact
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
              {filtered.map((c) => {
                const ps = priorityStyle[c.priority];
                return (
                  <div key={c.id} style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 16, padding: '24px 22px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>{c.name}</p>
                      <span style={{
                        padding: '4px 10px', background: ps.bg, color: ps.color,
                        border: `1px solid ${ps.border}`, borderRadius: 7,
                        fontSize: 13, fontWeight: 700, flexShrink: 0, marginLeft: 8,
                      }}>
                        {c.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 18px 0' }}>{c.relationship}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <Phone size={18} color="#3B82F6" />
                      <p style={{ fontSize: 16, color: '#374151', margin: 0, fontWeight: 500 }}>{c.phone}</p>
                    </div>

                    <button style={{
                      width: '100%', padding: '12px', background: '#16A34A', color: '#fff',
                      border: 'none', borderRadius: 10, cursor: 'pointer',
                      fontSize: 16, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 8, marginBottom: 12, minHeight: 52,
                    }}>
                      <Phone size={18} /> Call Now
                    </button>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button style={{
                        flex: 1, padding: '10px', border: '1px solid #E2E8F0',
                        borderRadius: 10, background: '#fff', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#64748B', minHeight: 44,
                      }}>
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        style={{
                          flex: 1, padding: '10px', border: '1px solid #FECDD3',
                          borderRadius: 10, background: '#FFF1F2', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#E11D48', minHeight: 44,
                        }}
                      >
                        <Trash2 size={18} />
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
        {/* CHANGED: card padding 20→28px, section title 15→20px, icon 18→22px,
                    field labels 13→16px, field values 14→17px, field box padding 9→14px,
                    condition name 14→18px, condition badge font 11→14px,
                    condition sub 13→16px, insurance grid gap 16→20px */}
        {activeTab === 'Medical Info' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Personal Medical Info */}
              <div style={{
                background: '#FFFFFF', border: '1px solid #BFDBFE',
                borderRadius: 16, padding: '28px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <User size={22} color="#3B82F6" />
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Personal Medical Information
                  </p>
                </div>

                {[
                  { label: 'Blood Type', value: 'O+', bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' },
                ].map((item) => (
                  <div key={item.label}>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{item.label}</p>
                    <div style={{ background: item.bg, border: `1px solid ${item.border}`, borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
                      <p style={{ fontSize: 17, color: item.color, margin: 0 }}>{item.value}</p>
                    </div>
                  </div>
                ))}

                <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Allergies</p>
                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={18} color="#E11D48" />
                  <p style={{ fontSize: 17, color: '#E11D48', margin: 0 }}>Penicillin, Peanuts</p>
                </div>

                <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Current Medications</p>
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px', marginBottom: 18 }}>
                  <p style={{ fontSize: 17, color: '#166534', margin: 0 }}>
                    Levodopa 100mg (3x daily), Vitamin D 1000 IU (1x daily)
                  </p>
                </div>

                <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Medical ID</p>
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px' }}>
                  <p style={{ fontSize: 17, color: '#334155', margin: 0 }}>MED-123456</p>
                </div>
              </div>

              {/* Medical Conditions */}
              <div style={{
                background: '#FFFFFF', border: '1px solid #FED7AA',
                borderRadius: 16, padding: '28px 24px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                  <Activity size={22} color="#EA580C" />
                  <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>Medical Conditions</p>
                </div>

                {[
                  { name: "Parkinson's Disease", badge: 'moderate', badgeColor: '#F97316', sub: 'Diagnosed 2020, on medication' },
                  { name: 'Hypertension', badge: 'mild', badgeColor: '#FFFFFF', sub: 'Controlled with medication' },
                ].map((cond) => (
                  <div key={cond.name} style={{
                    background: '#FFFFFF', border: '1px solid #E2E8F0',
                    borderRadius: 12, padding: '16px 18px', marginBottom: 14,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>{cond.name}</p>
                      <span style={{
                        padding: '4px 12px', background: '#1E293B', color: cond.badgeColor,
                        borderRadius: 7, fontSize: 14, fontWeight: 700,
                      }}>
                        {cond.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>{cond.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insurance */}
            <div style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 16, padding: '28px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
                <FileIcon size={22} color="#7C3AED" />
                <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: 0 }}>Insurance Information</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                  ['Provider',     'HealthCare Plus'],
                  ['Insurance ID', 'INS-789012'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{label}</p>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '12px 16px' }}>
                      <p style={{ fontSize: 17, color: '#334155', margin: 0 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════
            TAB 3 — PROTOCOLS
        ══════════════════════════════ */}
        {/* CHANGED: card padding 24→32px, section title 16→22px, icon 18→22px,
                    protocol card padding 18→24px, protocol title 15→20px,
                    step font 13→17px, bullet font 13→17px, gap between steps 6→10px */}
        {activeTab === 'Protocols' && (
          <div style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, padding: '32px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <AlertTriangle size={22} color="#DC2626" />
              <p style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>Emergency Protocols</p>
            </div>

            {/* If You Fall */}
            <div style={{
              background: '#FFF5F5', border: '1px solid #FECACA',
              borderRadius: 14, padding: '24px 26px', marginBottom: 18,
            }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#DC2626', margin: '0 0 16px 0' }}>If You Fall</p>
              <ol style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  "Stay calm. Don't try to get up immediately.",
                  'Check yourself for injuries.',
                  'If injured, call 911 immediately.',
                  'If not injured, slowly roll onto your side, then get onto hands and knees.',
                  'Crawl to sturdy furniture and slowly stand up.',
                  'Call Sarah (Primary Contact) to inform them.',
                ].map((step, i) => (
                  <li key={i} style={{ fontSize: 17, color: '#374151', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Medication Emergency */}
            <div style={{
              background: '#FFFBEB', border: '1px solid #FDE68A',
              borderRadius: 14, padding: '24px 26px', marginBottom: 18,
            }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#D97706', margin: '0 0 16px 0' }}>
                Medication Emergency
              </p>
              <ol style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'If you miss a dose, take it as soon as you remember.',
                  "If it's almost time for the next dose, skip the missed dose.",
                  'NEVER double up on doses.',
                  'If you experience severe side effects, call Dr. Roberts immediately.',
                  'Keep poison control number handy: 1-800-222-1222',
                ].map((step, i) => (
                  <li key={i} style={{ fontSize: 17, color: '#374151', lineHeight: 1.6 }}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Severe Parkinson's Symptoms */}
            <div style={{
              background: '#FFFBEB', border: '1px solid #FCD34D',
              borderRadius: 14, padding: '24px 26px',
            }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#D97706', margin: '0 0 8px 0' }}>
                Severe Parkinson's Symptoms
              </p>
              <p style={{ fontSize: 17, fontWeight: 600, color: '#374151', margin: '0 0 14px 0' }}>
                Call Dr. Roberts if you experience:
              </p>
              <ul style={{ margin: 0, paddingLeft: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  'Sudden worsening of tremors or rigidity',
                  'Difficulty swallowing or breathing',
                  'Severe confusion or hallucinations',
                  'Unable to move or "freezing" episodes lasting more than a few minutes',
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: 17, color: '#374151', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── ADD CONTACT MODAL ── */}
      {/* CHANGED: modal padding 28→38px, title 18→24px, labels 12→16px,
                  inputs minHeight 52px font 13→17px, buttons minHeight 52px font 13→17px */}
      {showModal && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: '#fff', borderRadius: 18, padding: 38, width: 480, maxWidth: '90vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#0F172A' }}>
              Add Emergency Contact
            </h3>
            {([
              ['name',         'Full Name'],
              ['relationship', 'Relationship'],
              ['phone',        'Phone Number'],
            ] as [keyof typeof newContact, string][]).map(([key, label]) => (
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
                  value={newContact[key] as string}
                  onChange={(e) => setNewContact((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 16, color: '#64748B', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                Priority
              </label>
              <select
                style={{
                  width: '100%', padding: '12px 16px', border: '1px solid #E2E8F0',
                  borderRadius: 10, fontSize: 17, background: '#fff', minHeight: 52,
                }}
                value={newContact.priority}
                onChange={(e) => setNewContact((p) => ({ ...p, priority: e.target.value as 'Primary' | 'Secondary' }))}
              >
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '12px 24px', border: '2px solid #E2E8F0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 17, color: '#334155', fontWeight: 600, minHeight: 52 }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                style={{ padding: '12px 24px', background: '#16A34A', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 17, fontWeight: 700, minHeight: 52 }}
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