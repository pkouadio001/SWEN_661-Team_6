import { useState } from 'react';
import { Pill, Search, Plus, Clock, User, Pencil, Trash2 } from 'lucide-react';

interface Medication {
  id: number;
  name: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  dosage: string;
  frequency: string;
  times: string[];
  prescribedBy: string;
  instructions: string;
}

const INITIAL_MEDS: Medication[] = [
  {
    id: 1,
    name: "Levodopa/Carbidopa",
    category: "Parkinson's Treatment",
    categoryColor: '#166534',
    categoryBg: '#DCFCE7',
    dosage: '100/25mg',
    frequency: '3 times daily',
    times: ['8:00 AM', '2:00 PM', '8:00 PM'],
    prescribedBy: 'Dr. Johnson',
    instructions: 'Take with food to reduce nausea',
  },
  {
    id: 2,
    name: 'Vitamin D3',
    category: 'Supplement',
    categoryColor: '#0F766E',
    categoryBg: '#CCFBF1',
    dosage: '2000 IU',
    frequency: 'Once daily',
    times: ['8:00 AM'],
    prescribedBy: 'Dr. Smith',
    instructions: 'Take with breakfast',
  },
];

export default function MedicationsPage() {
  const [meds, setMeds] = useState<Medication[]>(INITIAL_MEDS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('Name');
  const [showModal, setShowModal] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '', category: '', dosage: '', frequency: '',
    times: '', prescribedBy: '', instructions: '',
  });

  const filtered = meds
    .filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All Categories' || m.category === category;
      return matchSearch && matchCat;
    })
    .sort((a, b) => sort === 'Name' ? a.name.localeCompare(b.name) : 0);

  const handleAdd = () => {
    if (!newMed.name) return;
    setMeds((prev) => [...prev, {
      id: Date.now(),
      name: newMed.name,
      category: newMed.category || 'General',
      categoryColor: '#166534',
      categoryBg: '#DCFCE7',
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      times: newMed.times.split(',').map((t) => t.trim()),
      prescribedBy: newMed.prescribedBy,
      instructions: newMed.instructions,
    }]);
    setNewMed({ name: '', category: '', dosage: '', frequency: '', times: '', prescribedBy: '', instructions: '' });
    setShowModal(false);
  };

  const handleDelete = (id: number) => setMeds((prev) => prev.filter((m) => m.id !== id));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, justifyContent: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Pill size={26} color="#16A34A" />
        </div>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, color: '#0F172A', margin: 0 }}>My Medications</h1>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Manage your medication schedule</p>
        </div>
      </div>

      {/* Search / Filter Bar */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 14, padding: '20px 24px', marginBottom: 24,
        maxWidth: 700, margin: '0 auto 24px',
      }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 2, minWidth: 200 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Search Medications</p>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                placeholder="Search by name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 32px',
                  border: '1px solid #E2E8F0', borderRadius: 8,
                  fontSize: 13, color: '#0F172A', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Category</p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 13, color: '#0F172A', background: '#fff',
              }}
            >
              <option>All Categories</option>
              <option>Parkinson's Treatment</option>
              <option>Supplement</option>
              <option>General</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: 120 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Sort By</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid #E2E8F0', borderRadius: 8,
                fontSize: 13, color: '#0F172A', background: '#fff',
              }}
            >
              <option>Name</option>
              <option>Category</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', background: '#16A34A', color: '#fff',
            border: 'none', borderRadius: 9, cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
          }}
        >
          <Plus size={16} /> Add Medication
        </button>
      </div>

      {/* Medication Cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20, maxWidth: 700, margin: '0 auto',
      }}>
        {filtered.map((med) => (
          <div key={med.id} style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 14, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}>
            <div style={{ padding: '18px 18px 0' }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>{med.name}</h3>
              <span style={{
                display: 'inline-block', padding: '3px 10px',
                background: med.categoryBg, color: med.categoryColor,
                borderRadius: 6, fontSize: 12, fontWeight: 600, marginBottom: 16,
              }}>{med.category}</span>

              {/* Dosage */}
              <div style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 8, padding: '10px 14px', marginBottom: 12,
              }}>
                <p style={{ fontSize: 11, color: '#64748B', margin: '0 0 3px 0' }}>Dosage</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: '#2563EB', margin: 0 }}>{med.dosage}</p>
              </div>

              {/* Frequency */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <Clock size={14} color="#F97316" />
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>Frequency: <strong style={{ color: '#0F172A' }}>{med.frequency}</strong></p>
              </div>

              {/* Times */}
              <p style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>Times</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                {med.times.map((t) => (
                  <div key={t} style={{
                    background: '#FAF5FF', border: '1px solid #E9D5FF',
                    borderRadius: 7, padding: '6px 12px',
                    fontSize: 13, fontWeight: 600, color: '#7C3AED',
                  }}>{t}</div>
                ))}
              </div>

              {/* Prescribed by */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <User size={14} color="#94A3B8" />
                <p style={{ fontSize: 12, color: '#64748B', margin: 0 }}>
                  Prescribed by <strong style={{ color: '#0F172A' }}>{med.prescribedBy}</strong>
                </p>
              </div>

              {/* Instructions */}
              <div style={{
                background: '#FEFCE8', border: '1px solid #FDE68A',
                borderRadius: 8, padding: '10px 12px', marginBottom: 16,
              }}>
                <p style={{ fontSize: 11, color: '#92400E', fontWeight: 600, margin: '0 0 3px 0' }}>Instructions</p>
                <p style={{ fontSize: 13, color: '#78350F', margin: 0 }}>{med.instructions}</p>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              borderTop: '1px solid #F1F5F9', padding: '12px 18px',
              display: 'flex', gap: 8,
            }}>
              <button style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px', border: '1px solid #E2E8F0', borderRadius: 8,
                background: '#fff', cursor: 'pointer', fontSize: 13, color: '#64748B',
              }}>
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(med.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '8px', border: '1px solid #FECDD3', borderRadius: 8,
                  background: '#FFF1F2', cursor: 'pointer', fontSize: 13, color: '#E11D48',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 28,
            width: 460, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#0F172A' }}>Add Medication</h3>
            {([
              ['name', 'Medication Name'],
              ['category', 'Category (e.g. Supplement)'],
              ['dosage', 'Dosage (e.g. 100mg)'],
              ['frequency', 'Frequency (e.g. Once daily)'],
              ['times', 'Times (comma separated, e.g. 8:00 AM, 2:00 PM)'],
              ['prescribedBy', 'Prescribed By'],
              ['instructions', 'Instructions'],
            ] as [keyof typeof newMed, string][]).map(([key, label]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#64748B', display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  style={{
                    width: '100%', padding: '8px 12px', border: '1px solid #E2E8F0',
                    borderRadius: 8, fontSize: 13, color: '#0F172A', boxSizing: 'border-box', outline: 'none',
                  }}
                  value={newMed[key]}
                  onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '9px 18px', border: '1px solid #E2E8F0', borderRadius: 8,
                background: '#fff', cursor: 'pointer', fontSize: 13, color: '#334155',
              }}>Cancel</button>
              <button onClick={handleAdd} style={{
                padding: '9px 18px', background: '#16A34A', color: '#fff',
                border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}>Add Medication</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}