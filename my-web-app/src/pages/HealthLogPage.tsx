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
    energy: 7,
    tremor: 3,
    stiffness: 4,
    symptoms: ['Mild tremor'],
    notes: 'Good morning. Slept well. Feeling energized.',
    medications: 'Levodopa 100mg at 8:00 AM',
  },
  {
    id: 2,
    date: 'Thursday, March 12, 2026',
    time: '2:00 PM',
    mood: 'Neutral Mood',
    energy: 5,
    tremor: 6,
    stiffness: 7,
    symptoms: ['Tremor', 'Stiffness', 'Fatigue'],
    notes: 'Afternoon energy dip. Tremor increased before medication.',
    medications: 'Levodopa 100mg at 2:00 PM',
  },
];

const moodConfig = {
  'Good Mood':    { icon: <Smile size={22} />,  color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0' },
  'Neutral Mood': { icon: <Meh size={22} />,    color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' },
  'Poor Mood':    { icon: <Frown size={22} />,  color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' },
};

const levelColor = (_val: number, type: 'energy' | 'tremor' | 'stiffness') => {
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: '#CCFBF1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Activity size={26} color="#0D9488" />
        </div>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: 0 }}>Health Log</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Track your daily health and symptoms</p>
        </div>
      </div>

      {/* Add Button */}
      <div style={{ maxWidth: 680, margin: '0 auto 24px' }}>
        <button onClick={() => setShowModal(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '11px 22px', background: '#0D9488', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600,
        }}>
          <Plus size={16} /> Add Health Entry
        </button>
      </div>

      {/* Entries */}
      <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {entries.map((entry) => {
          const mood = moodConfig[entry.mood];
          return (
            <div key={entry.id} style={{
              background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: 14, overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            }}>
              <div style={{ padding: '20px 22px' }}>
                {/* Entry Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: mood.bg, color: mood.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {mood.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>{entry.date}</p>
                    <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 4px 0' }}>{entry.time}</p>
                    <span style={{
                      display: 'inline-block', padding: '2px 10px',
                      background: mood.bg, color: mood.color,
                      borderRadius: 6, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${mood.border}`,
                    }}>{entry.mood}</span>
                  </div>
                </div>

                {/* Level Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
                  {(['energy', 'tremor', 'stiffness'] as const).map((type) => {
                    const c = levelColor(entry[type], type);
                    const labels = { energy: 'Energy Level', tremor: 'Tremor Level', stiffness: 'Stiffness Level' };
                    return (
                      <div key={type} style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 9, padding: '10px 14px' }}>
                        <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 4px 0' }}>{labels[type]}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, color: c.color, margin: 0 }}>{entry[type]}/10</p>
                      </div>
                    );
                  })}
                </div>

                {/* Symptoms */}
                {entry.symptoms.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Symptoms</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {entry.symptoms.map((s) => (
                        <span key={s} style={{
                          padding: '3px 10px', background: '#FFF1F2',
                          border: '1px solid #FECDD3', borderRadius: 6,
                          fontSize: 12, fontWeight: 500, color: '#E11D48',
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div style={{ background: '#FEFCE8', border: '1px solid #FDE68A', borderRadius: 9, padding: '10px 14px', marginBottom: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#92400E', margin: '0 0 3px 0' }}>Notes</p>
                  <p style={{ fontSize: 13, color: '#78350F', margin: 0 }}>{entry.notes}</p>
                </div>

                {/* Medications */}
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 9, padding: '10px 14px', marginBottom: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#166534', margin: '0 0 3px 0' }}>Medications Taken</p>
                  <p style={{ fontSize: 13, color: '#14532D', margin: 0 }}>{entry.medications}</p>
                </div>

                {/* View Details */}
                <button style={{
                  width: '100%', padding: '10px', border: '1px solid #E2E8F0',
                  borderRadius: 9, background: '#fff', cursor: 'pointer',
                  fontSize: 13, fontWeight: 500, color: '#64748B',
                }}>View Full Details</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: 480, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#0F172A' }}>Add Health Entry</h3>
            {([['date','Date (e.g. Friday, March 14, 2026)'],['time','Time (e.g. 8:00 AM)'],['notes','Notes'],['medications','Medications Taken'],['symptoms','Symptoms (comma separated)']] as [keyof typeof newEntry, string][]).map(([key,label]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                <input style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, color: '#0F172A', boxSizing: 'border-box', outline: 'none' }}
                  value={newEntry[key] as string} onChange={(e) => setNewEntry((p) => ({ ...p, [key]: e.target.value }))} placeholder={label} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>Mood</label>
              <select style={{ width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 13, background: '#fff' }}
                value={newEntry.mood} onChange={(e) => setNewEntry((p) => ({ ...p, mood: e.target.value as HealthEntry['mood'] }))}>
                <option>Good Mood</option>
                <option>Neutral Mood</option>
                <option>Poor Mood</option>
              </select>
            </div>
            {(['energy','tremor','stiffness'] as const).map((key) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{key.charAt(0).toUpperCase() + key.slice(1)} Level (1-10): <strong>{newEntry[key]}</strong></label>
                <input type="range" min={1} max={10} value={newEntry[key]}
                  onChange={(e) => setNewEntry((p) => ({ ...p, [key]: Number(e.target.value) }))}
                  style={{ width: '100%' }} />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13, color: '#334155' }}>Cancel</button>
              <button onClick={handleAdd} style={{ padding: '9px 18px', background: '#0D9488', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}