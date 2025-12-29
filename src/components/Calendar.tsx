import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  eventDates: Set<string>;
}

export function Calendar({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onDateSelect,
  selectedDate,
  eventDates
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() &&
           month === selectedDate.getMonth() &&
           year === selectedDate.getFullYear();
  };

  const hasEvent = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventDates.has(dateStr);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {monthNames[month]} {year}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <button
                onClick={() => onDateSelect(new Date(year, month, day))}
                className={`
                  w-full h-full rounded-lg text-sm font-medium transition-all
                  ${isSelected(day) ? 'bg-blue-500 text-white shadow-md' : ''}
                  ${isToday(day) && !isSelected(day) ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' : ''}
                  ${!isSelected(day) && !isToday(day) ? 'hover:bg-gray-100 text-gray-700' : ''}
                  ${hasEvent(day) ? 'relative' : ''}
                `}
              >
                {day}
                {hasEvent(day) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected(day) ? 'bg-white' : 'bg-blue-500'}`} />
                  </div>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
