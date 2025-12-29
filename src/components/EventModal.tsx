import { X, Calendar, Clock, MapPin, Bell, BellOff } from 'lucide-react';
import { Event, Reminder } from '../lib/supabase';
import { useState } from 'react';

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onSetReminder: (eventId: string, minutes: number, userIdentifier: string) => Promise<void>;
  reminders: Reminder[];
  onRemoveReminder: (reminderId: string) => Promise<void>;
}

const REMINDER_OPTIONS = [
  { label: '15 minutes before', minutes: 15 },
  { label: '30 minutes before', minutes: 30 },
  { label: '1 hour before', minutes: 60 },
  { label: '2 hours before', minutes: 120 },
  { label: '1 day before', minutes: 1440 },
  { label: '2 days before', minutes: 2880 },
  { label: '1 week before', minutes: 10080 }
];

export function EventModal({
  event,
  onClose,
  onSetReminder,
  reminders,
  onRemoveReminder
}: EventModalProps) {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSetReminder = async () => {
    if (!userIdentifier.trim()) {
      alert('Please enter your email or phone number');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSetReminder(event.id, selectedMinutes, userIdentifier);
      alert('Reminder set successfully!');
    } catch (error) {
      alert('Failed to set reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReminderLabel = (minutes: number) => {
    const option = REMINDER_OPTIONS.find(opt => opt.minutes === minutes);
    return option?.label || `${minutes} minutes before`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">{event.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {event.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{formatTime(event.event_time)}</span>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{event.location}</span>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Set a Reminder</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email or Phone
                </label>
                <input
                  type="text"
                  value={userIdentifier}
                  onChange={(e) => setUserIdentifier(e.target.value)}
                  placeholder="email@example.com or phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remind me
                </label>
                <select
                  value={selectedMinutes}
                  onChange={(e) => setSelectedMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {REMINDER_OPTIONS.map(option => (
                    <option key={option.minutes} value={option.minutes}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSetReminder}
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Setting Reminder...' : 'Set Reminder'}
              </button>
            </div>
          </div>

          {reminders.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Reminders</h3>
              <div className="space-y-2">
                {reminders.map(reminder => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between bg-blue-50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">
                        {getReminderLabel(reminder.reminder_minutes)} ({reminder.user_identifier})
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveReminder(reminder.id)}
                      className="p-1 hover:bg-blue-100 rounded transition-colors"
                    >
                      <BellOff className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
