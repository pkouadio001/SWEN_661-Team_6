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
      const matchSearch =
        m.name.toLowerCase().includes(search.toLowerCase()) ||
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

      {/* ── PAGE HEADER ── */}
      {/* CHANGED: icon size 26→32, h1 font 30→36, subtitle font 14→18 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#DCFCE7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Pill size={32} color="#16A34A" />
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0 }}>My Medications</h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0 }}>Manage your medication schedule</p>
        </div>
      </div>

      {/* ── SEARCH / FILTER BAR ── */}
      {/* CHANGED: padding 20px→26px, label font 12→15, input minHeight added 52px,
                  select minHeight added 52px, Add button minHeight 52px font 13→16 */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 16, padding: '26px 28px', marginBottom: 28,
        maxWidth: 780, margin: '0 auto 28px',
      }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 20, flexWrap: 'wrap' }}>

          {/* Search */}
          <div style={{ flex: 2, minWidth: 200 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Search Medications
            </p>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#9CA3AF',
              }} />
              <input
                placeholder="Search by name or category..."
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

          {/* Category */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Category
            </p>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%', padding: '14px 12px',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 16, color: '#0F172A', background: '#fff',
                minHeight: 52,
              }}
            >
              <option>All Categories</option>
              <option>Parkinson's Treatment</option>
              <option>Supplement</option>
              <option>General</option>
            </select>
          </div>

          {/* Sort */}
          <div style={{ flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Sort By
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                width: '100%', padding: '14px 12px',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 16, color: '#0F172A', background: '#fff',
                minHeight: 52,
              }}
            >
              <option>Name</option>
              <option>Category</option>
            </select>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 26px', background: '#16A34A', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 16, fontWeight: 700, minHeight: 52,
          }}
        >
          <Plus size={20} /> Add Medication
        </button>
      </div>

      {/* ── MEDICATION CARDS ── */}
      {/* CHANGED: card padding 18px→24px, name font 17→22, category badge font 12→15,
                  dosage box padding increased, dosage value font 18→24,
                  frequency font 12→16, times font 13→16, times box padding increased,
                  prescribedBy font 12→16, instructions font 13→16,
                  action button icons 14→18, minHeight 52px added to buttons */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24, maxWidth: 780, margin: '0 auto',
      }}>
        {filtered.map((med) => (
          <div key={med.id} style={{
            background: '#FFFFFF', border: '1px solid #E2E8F0',
            borderRadius: 16, overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
          }}>
            <div style={{ padding: '24px 24px 0' }}>

              {/* Name */}
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 10px 0' }}>
                {med.name}
              </h3>

              {/* Category Badge */}
              <span style={{
                display: 'inline-block', padding: '5px 14px',
                background: med.categoryBg, color: med.categoryColor,
                borderRadius: 8, fontSize: 15, fontWeight: 600, marginBottom: 20,
              }}>
                {med.category}
              </span>

              {/* Dosage */}
              <div style={{
                background: '#EFF6FF', border: '1px solid #BFDBFE',
                borderRadius: 10, padding: '14px 18px', marginBottom: 16,
              }}>
                <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 4px 0' }}>Dosage</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: '#2563EB', margin: 0 }}>
                  {med.dosage}
                </p>
              </div>

              {/* Frequency */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Clock size={18} color="#F97316" />
                <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>
                  Frequency: <strong style={{ color: '#0F172A' }}>{med.frequency}</strong>
                </p>
              </div>

              {/* Times */}
              <p style={{ fontSize: 14, color: '#64748B', marginBottom: 8, fontWeight: 600 }}>Times</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {med.times.map((t) => (
                  <div key={t} style={{
                    background: '#FAF5FF', border: '1px solid #E9D5FF',
                    borderRadius: 9, padding: '10px 16px',
                    fontSize: 16, fontWeight: 600, color: '#7C3AED',
                  }}>
                    {t}
                  </div>
                ))}
              </div>

              {/* Prescribed By */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <User size={18} color="#94A3B8" />
                <p style={{ fontSize: 16, color: '#64748B', margin: 0 }}>
                  Prescribed by <strong style={{ color: '#0F172A' }}>{med.prescribedBy}</strong>
                </p>
              </div>

              {/* Instructions */}
              <div style={{
                background: '#FEFCE8', border: '1px solid #FDE68A',
                borderRadius: 10, padding: '14px 16px', marginBottom: 20,
              }}>
                <p style={{ fontSize: 14, color: '#92400E', fontWeight: 700, margin: '0 0 4px 0' }}>
                  Instructions
                </p>
                <p style={{ fontSize: 16, color: '#78350F', margin: 0 }}>{med.instructions}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              borderTop: '1px solid #F1F5F9', padding: '16px 24px',
              display: 'flex', gap: 10,
            }}>
              <button style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                padding: '12px', border: '1px solid #E2E8F0',
                borderRadius: 10, background: '#fff', cursor: 'pointer',
                fontSize: 15, color: '#64748B', fontWeight: 600, minHeight: 52,
              }}>
                <Pencil size={18} /> Edit
              </button>
              <button
                onClick={() => handleDelete(med.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  padding: '12px', border: '1px solid #FECDD3',
                  borderRadius: 10, background: '#FFF1F2', cursor: 'pointer',
                  fontSize: 15, color: '#E11D48', fontWeight: 600, minHeight: 52,
                }}
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD MEDICATION MODAL ── */}
      {/* CHANGED: modal padding 28→36, title font 18→24, label font 12→15,
                  input minHeight 52px font 13→16, buttons minHeight 52px font 13→16 */}
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
              width: 520, maxWidth: '90vw',
              maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 24px', color: '#0F172A' }}>
              Add Medication
            </h3>

            {([
              ['name',         'Medication Name'],
              ['category',     'Category (e.g. Supplement)'],
              ['dosage',       'Dosage (e.g. 100mg)'],
              ['frequency',    'Frequency (e.g. Once daily)'],
              ['times',        'Times (comma separated, e.g. 8:00 AM, 2:00 PM)'],
              ['prescribedBy', 'Prescribed By'],
              ['instructions', 'Instructions'],
            ] as [keyof typeof newMed, string][]).map(([key, label]) => (
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
                  value={newMed[key]}
                  onChange={(e) => setNewMed((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
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
                  padding: '12px 24px', background: '#16A34A', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
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