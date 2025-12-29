import { useState, useEffect } from 'react';
import { Home, CalendarDays } from 'lucide-react';
import { supabase, Event, Reminder } from './lib/supabase';
import { Calendar } from './components/Calendar';
import { EventCard } from './components/EventCard';
import { EventModal } from './components/EventModal';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('calendar');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchRemindersForEvent(selectedEvent.id);
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const filtered = events.filter(event => event.event_date === dateStr);
      setFilteredEvents(filtered.sort((a, b) => a.event_time.localeCompare(b.event_time)));
    } else {
      const today = new Date();
      const upcoming = events.filter(event => {
        const eventDate = new Date(event.event_date);
        return eventDate >= today;
      });
      setFilteredEvents(upcoming.sort((a, b) => {
        const dateCompare = a.event_date.localeCompare(b.event_date);
        if (dateCompare !== 0) return dateCompare;
        return a.event_time.localeCompare(b.event_time);
      }));
    }
  }, [selectedDate, events]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRemindersForEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('event_id', eventId)
        .eq('is_active', true);

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const handleSetReminder = async (eventId: string, minutes: number, userIdentifier: string) => {
    const { error } = await supabase
      .from('reminders')
      .insert({
        event_id: eventId,
        reminder_minutes: minutes,
        user_identifier: userIdentifier,
        is_active: true
      });

    if (error) throw error;
    await fetchRemindersForEvent(eventId);
  };

  const handleRemoveReminder = async (reminderId: string) => {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId);

    if (error) {
      console.error('Error removing reminder:', error);
      return;
    }

    if (selectedEvent) {
      await fetchRemindersForEvent(selectedEvent.id);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setView('list');
  };

  const eventDates = new Set(events.map(event => event.event_date));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-xl">
                <Home className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Village Connect</h1>
                <p className="text-sm text-gray-600">Stay connected with your community</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('calendar')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'calendar'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Calendar
              </button>
              <button
                onClick={() => {
                  setView('list');
                  setSelectedDate(null);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={view === 'calendar' ? 'lg:col-span-2' : 'lg:col-span-3'}>
            {view === 'calendar' && (
              <Calendar
                currentDate={currentDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                eventDates={eventDates}
              />
            )}

            {view === 'list' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedDate
                        ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                        : 'Upcoming Events'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
                    </p>
                  </div>
                  {selectedDate && (
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Show All
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {filteredEvents.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                      <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                      <p className="text-gray-600">
                        {selectedDate
                          ? 'There are no events scheduled for this date.'
                          : 'There are no upcoming events at the moment.'}
                      </p>
                    </div>
                  ) : (
                    filteredEvents.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {view === 'calendar' && (
            <div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  {selectedDate
                    ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                    : 'Upcoming Events'}
                </h2>
                <div className="space-y-3">
                  {filteredEvents.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      {selectedDate ? 'No events on this date' : 'No upcoming events'}
                    </p>
                  ) : (
                    filteredEvents.slice(0, 5).map(event => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                      >
                        <div className="font-medium text-gray-900 mb-1">{event.title}</div>
                        <div className="text-sm text-gray-500">
                          {event.event_time.substring(0, 5)}
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {filteredEvents.length > 5 && (
                  <button
                    onClick={() => setView('list')}
                    className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all {filteredEvents.length} events
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setSelectedEvent(null);
            setReminders([]);
          }}
          onSetReminder={handleSetReminder}
          reminders={reminders}
          onRemoveReminder={handleRemoveReminder}
        />
      )}
    </div>
  );
}

export default App;
