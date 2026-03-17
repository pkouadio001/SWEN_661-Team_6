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
      replyCount: 0
    },
    {
      id: 2,
      subject: 'Appointment Reminder',
      from: 'Mary Doe (Caregiver)',
      role: 'Caregiver',
      date: 'March 12, 2026',
      time: '4:15 PM',
      preview: 'Hi Dad, just a reminder that you have a physical therapy appointment tomorrow at 2:00 PM. I\'ll pick you up at 1:30 PM. Don\'t forget to bring your medication list!',
      isUrgent: false,
      isReceived: true,
      replyCount: 1
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-messages-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-messages-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Caretaker Messages</h1>
          <p className="text-gray-600">Communicate with your care team</p>
        </div>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by sender, subject, or content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-messages-500"
            />
          </div>

          {/* Filter */}
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-messages-500">
            <option>All Messages</option>
            <option>Urgent</option>
            <option>Received</option>
            <option>Sent</option>
          </select>
        </div>

        {/* Compose Button */}
        <button className="mt-4 w-full sm:w-auto px-6 py-3 bg-messages-500 hover:bg-messages-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
          <Edit className="w-5 h-5" />
          Compose Message
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`bg-white rounded-xl border-2 p-6 ${
              message.isUrgent ? 'border-red-200 bg-red-50/30' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
                      {message.subject}
                      {message.isUrgent && (
                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs font-bold">
                          URGENT
                        </span>
                      )}
                      {message.isReceived && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          Received
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">
                      From: <span className="font-medium">{message.from}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{message.date} at {message.time}</span>
                </div>
              </div>
            </div>

            {/* Message Preview */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700">{message.preview}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Full Thread
              </button>
              <button className="flex-1 px-4 py-2 bg-messages-500 hover:bg-messages-600 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Reply
              </button>
            </div>

            {/* Reply Count */}
            {message.replyCount > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">{message.replyCount} Reply</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}