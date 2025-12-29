import { Calendar, Clock, MapPin } from "lucide-react";
import { Event } from "../lib/supabase";

interface EventCardProps {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-100 text-blue-700",
      social: "bg-green-100 text-green-700",
      maintenance: "bg-orange-100 text-orange-700",
      emergency: "bg-red-100 text-red-700",
      general: "bg-gray-100 text-gray-700",
    };
    return colors[category] || colors.general;
  };

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all text-left overflow-hidden"
    >
      {/* 🖼 Event Image (optional) */}
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {event.title}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor(
              event.category
            )}`}
          >
            {event.category}
          </span>
        </div>

        {event.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.event_date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatTime(event.event_time)}</span>
          </div>

          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
