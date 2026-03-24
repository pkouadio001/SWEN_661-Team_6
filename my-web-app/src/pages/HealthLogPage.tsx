import { useState } from 'react';
import { Activity, Plus, Smile, Meh, Frown } from 'lucide-react';

interface HealthEntry {
  id: number;
  date: string;
  time: string;
  mood: 'Good Mood' | 'Neutral Mood' | 'Poor Mood';
  energy: number;
  tremor: number;
  stiffness: number;
  symptoms: string[];
  notes: string;
  medications: string;
}

const INITIAL_ENTRIES: HealthEntry[] = [
  {
    id: 1,
    date: 'Friday, March 13, 2026',
    time: '8:00 AM',
    mood: 'Good Mood',
    energy: 7, tremor: 3, stiffness: 4,
    symptoms: ['Mild tremor'],
    notes: 'Good morning. Slept well. Feeling energized.',
    medications: 'Levodopa 100mg at 8:00 AM',
  },
  {
    id: 2,
    date: 'Thursday, March 12, 2026',
    time: '2:00 PM',
    mood: 'Neutral Mood',
    energy: 5, tremor: 6, stiffness: 7,
    symptoms: ['Tremor', 'Stiffness', 'Fatigue'],
    notes: 'Afternoon energy dip. Tremor increased before medication.',
    medications: 'Levodopa 100mg at 2:00 PM',
  },
];

const moodConfig = {
  'Good Mood':    { icon: <Smile size={28} />,  color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' },
  'Neutral Mood': { icon: <Meh size={28} />,    color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  'Poor Mood':    { icon: <Frown size={28} />,  color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};

const levelColor = (type: 'energy' | 'tremor' | 'stiffness') => {
  if (type === 'energy')    return { bg: '#EFF6FF', border: '#BFDBFE', color: '#1D4ED8' };
  if (type === 'tremor')    return { bg: '#FFF7ED', border: '#FED7AA', color: '#C2410C' };
  return                           { bg: '#FAF5FF', border: '#E9D5FF', color: '#7E22CE' };
};

export default function HealthLogPage() {
  const [entries, setEntries] = useState<HealthEntry[]>(INITIAL_ENTRIES);
  const [showModal, setShowModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: '', time: '', mood: 'Good Mood' as HealthEntry['mood'],
    energy: 5, tremor: 3, stiffness: 3,
    symptoms: '', notes: '', medications: '',
  });

  const handleAdd = () => {
    if (!newEntry.date) return;
    setEntries((p) => [{
      id: Date.now(),
      date: newEntry.date,
      time: newEntry.time,
      mood: newEntry.mood,
      energy: newEntry.energy,
      tremor: newEntry.tremor,
      stiffness: newEntry.stiffness,
      symptoms: newEntry.symptoms.split(',').map((s) => s.trim()).filter(Boolean),
      notes: newEntry.notes,
      medications: newEntry.medications,
    }, ...p]);
    setShowModal(false);
  };

  return (
    <div>

      {/* ── PAGE HEADER ── */}
      {/* CHANGED: icon box 48→64px, icon 26→32px, h1 30→36px, subtitle 14→18px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#CCFBF1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Activity size={32} color="#0D9488" />
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0 }}>Health Log</h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0 }}>Track your daily health and symptoms</p>
        </div>
      </div>

      {/* ── ADD BUTTON ── */}
      {/* CHANGED: padding 11px→14px, font 14→16px, icon 16→20px, minHeight 52px added */}
      <div style={{ maxWidth: 720, margin: '0 auto 28px' }}>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 26px', background: '#0D9488', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 16, fontWeight: 700, minHeight: 52,
          }}
        >
          <Plus size={20} /> Add Health Entry
        </button>
      </div>

      {/* ── LOG ENTRIES ── */}
      {/* CHANGED: card padding 20→26px, date font 16→20px, time font 13→16px,
                  mood badge font 12→15px, mood icon 22→28px, mood circle 42→56px,
                  level card padding 10→14px, level label 11→14px, level value 20→26px,
                  symptoms badge font 12→15px padding 3px→6px,
                  notes/medications font 13→16px, section labels 12→15px,
                  View Full Details button minHeight 52px font 13→16px */}
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {entries.map((entry) => {
          const mood = moodConfig[entry.mood];
          return (
            <div key={entry.id} style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}>
              <div style={{ padding: '26px 26px 22px' }}>

                {/* Entry Header — Mood + Date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: mood.bg, color: mood.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {mood.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
                      {entry.date}
                    </p>
                    <p style={{ fontSize: 16, color: '#64748B', margin: '0 0 6px 0' }}>{entry.time}</p>
                    <span style={{
                      display: 'inline-block', padding: '4px 14px',
                      background: mood.bg, color: mood.color,
                      borderRadius: 8, fontSize: 15, fontWeight: 700,
                      border: `1px solid ${mood.border}`,
                    }}>
                      {entry.mood}
                    </span>
                  </div>
                </div>

                {/* Level Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
                  {(['energy', 'tremor', 'stiffness'] as const).map((type) => {
                    const c = levelColor(type);
                    const labels = { energy: 'Energy Level', tremor: 'Tremor Level', stiffness: 'Stiffness Level' };
                    return (
                      <div key={type} style={{
                        background: c.bg, border: `1px solid ${c.border}`,
                        borderRadius: 12, padding: '14px 18px',
                      }}>
                        <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 6px 0' }}>{labels[type]}</p>
                        <p style={{ fontSize: 26, fontWeight: 700, color: c.color, margin: 0 }}>
                          {entry[type]}/10
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Symptoms */}
                {entry.symptoms.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Symptoms</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {entry.symptoms.map((s) => (
                        <span key={s} style={{
                          padding: '6px 14px', background: '#FFF1F2',
                          border: '1px solid #FECDD3', borderRadius: 8,
                          fontSize: 15, fontWeight: 600, color: '#E11D48',
                        }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div style={{
                  background: '#FEFCE8', border: '1px solid #FDE68A',
                  borderRadius: 10, padding: '14px 18px', marginBottom: 12,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#92400E', margin: '0 0 4px 0' }}>Notes</p>
                  <p style={{ fontSize: 16, color: '#78350F', margin: 0 }}>{entry.notes}</p>
                </div>

                {/* Medications */}
                <div style={{
                  background: '#F0FDF4', border: '1px solid #BBF7D0',
                  borderRadius: 10, padding: '14px 18px', marginBottom: 18,
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#166534', margin: '0 0 4px 0' }}>
                    Medications Taken
                  </p>
                  <p style={{ fontSize: 16, color: '#14532D', margin: 0 }}>{entry.medications}</p>
                </div>

                {/* View Details Button */}
                <button style={{
                  width: '100%', padding: '14px',
                  border: '1px solid #E2E8F0', borderRadius: 10,
                  background: '#fff', cursor: 'pointer',
                  fontSize: 16, fontWeight: 600, color: '#64748B', minHeight: 52,
                }}>
                  View Full Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── ADD ENTRY MODAL ── */}
      {/* CHANGED: modal padding 28→36px, title 18→24px, labels 12→15px font weight added,
                  inputs minHeight 52px font 13→16px, slider labels 12→15px,
                  buttons minHeight 52px font 13→16px */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#fff', borderRadius: 18, padding: 36,
              width: 520, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#0F172A' }}>
              Add Health Entry
            </h3>

            {([
              ['date',        'Date (e.g. Friday, March 14, 2026)'],
              ['time',        'Time (e.g. 8:00 AM)'],
              ['notes',       'Notes'],
              ['medications', 'Medications Taken'],
              ['symptoms',    'Symptoms (comma separated)'],
            ] as [keyof typeof newEntry, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{
                  fontSize: 15, color: '#64748B',
                  display: 'block', marginBottom: 6, fontWeight: 600,
                }}>
                  {label}
                </label>
                <input
                  style={{
                    width: '100%', padding: '12px 16px',
                    border: '1px solid #E2E8F0', borderRadius: 10,
                    fontSize: 16, color: '#0F172A',
                    boxSizing: 'border-box', outline: 'none', minHeight: 52,
                  }}
                  value={newEntry[key] as string}
                  onChange={(e) => setNewEntry((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}

            {/* Mood Select */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 15, color: '#64748B',
                display: 'block', marginBottom: 6, fontWeight: 600,
              }}>
                Mood
              </label>
              <select
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '1px solid #E2E8F0', borderRadius: 10,
                  fontSize: 16, background: '#fff', minHeight: 52,
                }}
                value={newEntry.mood}
                onChange={(e) => setNewEntry((p) => ({ ...p, mood: e.target.value as HealthEntry['mood'] }))}
              >
                <option>Good Mood</option>
                <option>Neutral Mood</option>
                <option>Poor Mood</option>
              </select>
            </div>

            {/* Level Sliders */}
            {(['energy', 'tremor', 'stiffness'] as const).map((key) => (
              <div key={key} style={{ marginBottom: 16 }}>
                <label style={{
                  fontSize: 15, color: '#64748B',
                  display: 'block', marginBottom: 6, fontWeight: 600,
                }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)} Level (1–10):
                  <strong style={{ color: '#0F172A', marginLeft: 8, fontSize: 18 }}>
                    {newEntry[key]}
                  </strong>
                </label>
                <input
                  type="range" min={1} max={10} step={1}
                  value={newEntry[key]}
                  onChange={(e) => setNewEntry((p) => ({ ...p, [key]: Number(e.target.value) }))}
                  style={{ width: '100%', height: 8, cursor: 'pointer' }}
                />
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '12px 24px', border: '1px solid #E2E8F0',
                  borderRadius: 10, background: '#fff', cursor: 'pointer',
                  fontSize: 16, color: '#334155', fontWeight: 600, minHeight: 52,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                style={{
                  padding: '12px 24px', background: '#0D9488', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}