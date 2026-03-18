import { useState } from 'react';
import { Search, Edit, MessageSquare, User, Clock, ArrowRight } from 'lucide-react';

interface Message {
  id: number;
  subject: string;
  from: string;
  role: string;
  date: string;
  time: string;
  preview: string;
  isUrgent: boolean;
  isReceived: boolean;
  replyCount: number;
}

export function MessagesPage() {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      subject: 'Medication Adjustment Needed',
      from: 'Dr. Sarah Johnson',
      role: 'Neurologist',
      date: 'March 13, 2026',
      time: '9:30 AM',
      preview: 'Hi John, based on your recent health logs, I think we should adjust your evening Levodopa dose. Please schedule an appointment this week so we can discuss the changes.',
      isUrgent: true,
      isReceived: true,
      replyCount: 0,
    },
    {
      id: 2,
      subject: 'Appointment Reminder',
      from: 'Mary Doe (Caregiver)',
      role: 'Caregiver',
      date: 'March 12, 2026',
      time: '4:15 PM',
      preview: "Hi Dad, just a reminder that you have a physical therapy appointment tomorrow at 2:00 PM. I'll pick you up at 1:30 PM. Don't forget to bring your medication list!",
      isUrgent: false,
      isReceived: true,
      replyCount: 1,
    },
  ]);

  return (
    <div>

      {/* ── PAGE HEADER ── */}
      {/* CHANGED: icon box 48→64px, icon 24→32px, h1 30→36px, subtitle 14→18px, gap 12→16px */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32, justifyContent: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#EDE9FE',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MessageSquare size={32} color="#7C3AED" />
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Caretaker Messages
          </h1>
          <p style={{ fontSize: 18, color: '#64748B', margin: 0 }}>Communicate with your care team</p>
        </div>
      </div>

      {/* ── SEARCH AND ACTIONS BAR ── */}
      {/* CHANGED: card padding 16→24px, search input minHeight 52px font 13→16px,
                  search icon 20→22px, filter select minHeight 52px font 14→16px,
                  Compose button minHeight 52px font 14→16px icon 20→22px */}
      <div style={{
        background: '#FFFFFF', border: '1px solid #E2E8F0',
        borderRadius: 16, padding: '24px 28px', marginBottom: 28,
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>

          {/* Search */}
          <div style={{ flex: 2, minWidth: 220, position: 'relative' }}>
            <Search size={22} style={{
              position: 'absolute', left: 14, top: '50%',
              transform: 'translateY(-50%)', color: '#9CA3AF',
            }} />
            <input
              type="text"
              placeholder="Search by sender, subject, or content..."
              style={{
                width: '100%', padding: '14px 16px 14px 46px',
                border: '1px solid #E2E8F0', borderRadius: 10,
                fontSize: 16, color: '#0F172A', outline: 'none',
                boxSizing: 'border-box', minHeight: 52,
              }}
            />
          </div>

          {/* Filter */}
          <select style={{
            padding: '14px 16px', border: '1px solid #E2E8F0',
            borderRadius: 10, fontSize: 16, color: '#0F172A',
            background: '#fff', cursor: 'pointer', minHeight: 52, minWidth: 180,
          }}>
            <option>All Messages</option>
            <option>Urgent</option>
            <option>Received</option>
            <option>Sent</option>
          </select>
        </div>

        {/* Compose Button */}
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 26px', background: '#7C3AED', color: '#fff',
          border: 'none', borderRadius: 10, cursor: 'pointer',
          fontSize: 16, fontWeight: 700, minHeight: 52,
        }}>
          <Edit size={22} /> Compose Message
        </button>
      </div>

      {/* ── MESSAGES LIST ── */}
      {/* CHANGED: card padding 24→32px, user avatar 48→60px icon 24→30px,
                  subject font 18→22px, URGENT badge font 12→15px padding 4→8px,
                  Received badge font 12→15px, from font 14→17px,
                  date/time font 14→17px clock icon 16→20px,
                  preview text font 14→18px, preview padding 16→20px,
                  action buttons minHeight 52px font 14→17px, reply count font 14→17px */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              background: message.isUrgent ? '#FFF5F5' : '#FFFFFF',
              border: `2px solid ${message.isUrgent ? '#FECACA' : '#E2E8F0'}`,
              borderRadius: 18, padding: '32px 32px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 20 }}>
              <div style={{
                width: 60, height: 60, background: '#DBEAFE',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <User size={30} color="#2563EB" />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {message.subject}
                      </h3>
                      {message.isUrgent && (
                        <span style={{
                          padding: '5px 12px', background: '#DC2626', color: '#fff',
                          borderRadius: 7, fontSize: 15, fontWeight: 700,
                        }}>
                          URGENT
                        </span>
                      )}
                      {message.isReceived && (
                        <span style={{
                          padding: '5px 12px', background: '#DBEAFE', color: '#1D4ED8',
                          borderRadius: 7, fontSize: 15, fontWeight: 600,
                        }}>
                          Received
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>
                      From: <strong style={{ color: '#0F172A' }}>{message.from}</strong>
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={20} color="#94A3B8" />
                  <span style={{ fontSize: 17, color: '#64748B' }}>
                    {message.date} at {message.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div style={{
              background: '#F8FAFC', borderRadius: 12,
              padding: '20px 22px', marginBottom: 20,
            }}>
              <p style={{ fontSize: 18, color: '#374151', margin: 0, lineHeight: 1.7 }}>
                {message.preview}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button style={{
                flex: 1, minWidth: 140, padding: '14px 20px',
                border: '1px solid #E2E8F0', color: '#374151',
                borderRadius: 10, background: '#fff', cursor: 'pointer',
                fontSize: 17, fontWeight: 600, minHeight: 52,
              }}>
                View Full Thread
              </button>
              <button style={{
                flex: 1, minWidth: 140, padding: '14px 20px',
                background: '#7C3AED', color: '#fff',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontSize: 17, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 8, minHeight: 52,
              }}>
                <ArrowRight size={20} /> Reply
              </button>
            </div>

            {/* Reply Count */}
            {message.replyCount > 0 && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #E2E8F0' }}>
                <p style={{ fontSize: 17, color: '#64748B', margin: 0 }}>
                  {message.replyCount} Reply
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}