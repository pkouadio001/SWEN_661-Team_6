import { useState } from 'react';
import { Calendar, Search, Plus, User, MapPin, Clock, Info, Pencil, Trash2 } from 'lucide-react';

interface Appointment {
  id: number;
  title: string;
  status: 'Past' | 'Upcoming';
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  address: string;
  notes: string;
}

const INITIAL: Appointment[] = [
  { id: 1, title: 'General Checkup',         status: 'Past',     doctor: 'Dr. Emily Rodriguez', specialty: 'Primary Care',     date: 'Feb 27, 2026', time: '9:30 AM',  location: 'Family Health Clinic',  address: '789 Care Ave',                notes: 'Annual physical exam. Blood work completed.' },
  { id: 2, title: 'Physical Therapy Session', status: 'Upcoming', doctor: 'Dr. Michael Chen',    specialty: 'Physical Therapy', date: 'Mar 14, 2026', time: '2:00 PM',  location: 'Wellness Rehab Center', address: '456 Health St, Building B',   notes: 'Wear comfortable clothing. Focus on balance exercises.' },
  { id: 3, title: 'Neurologist Follow-up',    status: 'Upcoming', doctor: 'Dr. Sarah Johnson',   specialty: 'Neurology',        date: 'Mar 17, 2026', time: '10:00 AM', location: 'City Medical Center',   address: '123 Medical Plaza, Suite 400', notes: 'Bring current medication list. Discuss tremor management.' },
];

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Appointments');
  const [sort, setSort] = useState('Date');
  const [showModal, setShowModal] = useState(false);
  const [newAppt, setNewAppt] = useState({
    title: '', doctor: '', specialty: '', date: '', time: '',
    location: '', address: '', notes: '', status: 'Upcoming' as 'Upcoming' | 'Past',
  });

  const filtered = appointments
    .filter((a) => {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.doctor.toLowerCase().includes(q) ||
        a.specialty.toLowerCase().includes(q)
      ) && (filter === 'All Appointments' || a.status === filter);
    })
    .sort((a, b) =>
      sort === 'Doctor' ? a.doctor.localeCompare(b.doctor) :
      sort === 'Type'   ? a.title.localeCompare(b.title) :
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const handleDelete = (id: number) => setAppointments((p) => p.filter((a) => a.id !== id));

  const handleAdd = () => {
    if (!newAppt.title) return;
    setAppointments((p) => [...p, { id: Date.now(), ...newAppt }]);
    setNewAppt({ title: '', doctor: '', specialty: '', date: '', time: '', location: '', address: '', notes: '', status: 'Upcoming' });
    setShowModal(false);
  };

  return (
    <div>

      {/* ── PAGE HEADER ── */}
      {/* CHANGED: icon box 48→64px, icon 26→32px, h1 30→36px, subtitle 14→18px, gap 14→16px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#DBEAFE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Calendar size={32} color="#2563EB" />
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0 }}>My Appointments</h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0 }}>Manage your healthcare schedule</p>
        </div>
      </div>

      {/* ── SEARCH / FILTER BAR ── */}
      {/* CHANGED: padding 20px→26px, labels 12→15px, inputs minHeight 52px font 13→16px,
                  selects minHeight 52px font 13→16px, Add button minHeight 52px font 14→16px */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 16, padding: '26px 28px', marginBottom: 28,
        maxWidth: 820, margin: '0 auto 28px',
      }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 20 }}>

          {/* Search */}
          <div style={{ flex: 2, minWidth: 220 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Search Appointments
            </p>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', color: '#9CA3AF',
              }} />
              <input
                placeholder="Search by doctor, specialty, or title..."
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

          {/* Filter */}
          <div style={{ flex: 1, minWidth: 160 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Filter</p>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%', padding: '14px 12px',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 16, color: '#0F172A', background: '#fff', minHeight: 52,
              }}
            >
              <option>All Appointments</option>
              <option>Upcoming</option>
              <option>Past</option>
            </select>
          </div>

          {/* Sort */}
          <div style={{ flex: 1, minWidth: 140 }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Sort By</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                width: '100%', padding: '14px 12px',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 16, color: '#0F172A', background: '#fff', minHeight: 52,
              }}
            >
              <option>Date</option>
              <option>Doctor</option>
              <option>Type</option>
            </select>
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 26px', background: '#2563EB', color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontSize: 16, fontWeight: 700, minHeight: 52,
          }}
        >
          <Plus size={20} /> Add Appointment
        </button>
      </div>

      {/* ── APPOINTMENT CARDS ── */}
      {/* CHANGED: card minWidth 300→340px, gap 20→28px, card padding 18→24px,
                  title font 17→22px, status badge font 12→15px padding 3px→6px,
                  doctor section padding 10→14px, doctor icon 36→48px, doctor name 14→18px,
                  specialty 12→15px, date/time box padding 8→12px, date/time font 13→17px,
                  location font 13→16px, notes font 13→16px,
                  action buttons minHeight 52px font 12→15px icons 14→18px */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 28, maxWidth: 820, margin: '0 auto',
      }}>
        {filtered.length === 0 && (
          <p style={{ color: '#94A3B8', textAlign: 'center', gridColumn: '1/-1', padding: '48px 0', fontSize: 18 }}>
            No appointments found.
          </p>
        )}

        {filtered.map((apt) => (
          <div key={apt.id} style={{
            background: apt.status === 'Upcoming' ? '#F0F7FF' : '#FFFFFF',
            border: `2px solid ${apt.status === 'Upcoming' ? '#93C5FD' : '#E2E8F0'}`,
            borderRadius: 16, overflow: 'hidden',
          }}>
            <div style={{ padding: '24px 24px 0' }}>

              {/* Title + Status Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>{apt.title}</h3>
                <span style={{
                  padding: '6px 14px', borderRadius: 8, fontSize: 15,
                  fontWeight: 700, flexShrink: 0, marginLeft: 10,
                  background: apt.status === 'Upcoming' ? '#2563EB' : '#6B7280',
                  color: '#fff',
                }}>
                  {apt.status}
                </span>
              </div>

              {/* Doctor Info */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px', background: '#EFF6FF',
                borderRadius: 12, marginBottom: 16,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: '#DBEAFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <User size={24} color="#2563EB" />
                </div>
                <div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 2px 0' }}>Doctor</p>
                  <p style={{ fontSize: 18, fontWeight: 700, color: '#0F172A', margin: 0 }}>{apt.doctor}</p>
                  <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>{apt.specialty}</p>
                </div>
              </div>

              {/* Date & Time */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                <div style={{
                  background: '#FAF5FF', border: '1px solid #E9D5FF',
                  borderRadius: 10, padding: '12px 16px',
                }}>
                  <p style={{
                    fontSize: 13, color: '#64748B', margin: '0 0 4px 0',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Calendar size={14} color="#7C3AED" /> Date
                  </p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: '#7C3AED', margin: 0 }}>{apt.date}</p>
                </div>
                <div style={{
                  background: '#FFF7ED', border: '1px solid #FED7AA',
                  borderRadius: 10, padding: '12px 16px',
                }}>
                  <p style={{
                    fontSize: 13, color: '#64748B', margin: '0 0 4px 0',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Clock size={14} color="#EA580C" /> Time
                  </p>
                  <p style={{ fontSize: 17, fontWeight: 700, color: '#EA580C', margin: 0 }}>{apt.time}</p>
                </div>
              </div>

              {/* Location */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px 16px', background: '#F8FAFC',
                borderRadius: 10, marginBottom: 16,
              }}>
                <MapPin size={20} color="#22C55E" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: '0 0 2px 0' }}>Location</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#0F172A', margin: 0 }}>{apt.location}</p>
                  <p style={{ fontSize: 15, color: '#64748B', margin: 0 }}>{apt.address}</p>
                </div>
              </div>

              {/* Notes */}
              <div style={{
                background: '#FEFCE8', border: '1px solid #FDE68A',
                borderRadius: 10, padding: '12px 16px', marginBottom: 20,
              }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 4px 0' }}>Notes</p>
                <p style={{ fontSize: 16, color: '#78350F', margin: 0 }}>{apt.notes}</p>
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
                <Info size={18} /> View
              </button>
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
                onClick={() => handleDelete(apt.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                  padding: '12px', border: '1px solid #FECDD3',
                  borderRadius: 10, background: '#FFF1F2', cursor: 'pointer',
                  fontSize: 15, color: '#E11D48', fontWeight: 600, minHeight: 52,
                }}
              >
                <Trash2 size={18} /> Cancel
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD APPOINTMENT MODAL ── */}
      {/* CHANGED: modal padding 28→36px, title 18→24px, labels 12→15px,
                  inputs minHeight 52px font 13→16px, buttons minHeight 52px font 13→16px */}
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
              Add Appointment
            </h3>

            {([
              ['title',    'Appointment Title'],
              ['doctor',   'Doctor Name'],
              ['specialty','Specialty'],
              ['date',     'Date (e.g. Mar 17, 2026)'],
              ['time',     'Time (e.g. 10:00 AM)'],
              ['location', 'Location'],
              ['address',  'Address'],
              ['notes',    'Notes'],
            ] as [keyof typeof newAppt, string][]).map(([key, label]) => (
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
                  value={newAppt[key] as string}
                  onChange={(e) => setNewAppt((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={label}
                />
              </div>
            ))}

            <div style={{ marginBottom: 16 }}>
              <label style={{
                fontSize: 15, color: '#64748B',
                display: 'block', marginBottom: 6, fontWeight: 600,
              }}>
                Status
              </label>
              <select
                style={{
                  width: '100%', padding: '12px 16px',
                  border: '1px solid #E2E8F0', borderRadius: 10,
                  fontSize: 16, background: '#fff', minHeight: 52,
                }}
                value={newAppt.status}
                onChange={(e) => setNewAppt((p) => ({ ...p, status: e.target.value as 'Upcoming' | 'Past' }))}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
              </select>
            </div>

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
                  padding: '12px 24px', background: '#2563EB', color: '#fff',
                  border: 'none', borderRadius: 10, cursor: 'pointer',
                  fontSize: 16, fontWeight: 700, minHeight: 52,
                }}
              >
                Add Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}