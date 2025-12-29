import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type AnnouncementType = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Community Updates</h2>
      {announcements.length === 0 ? (
        <p className="text-gray-700 text-lg">No announcements at the moment.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
          >
            <strong className="text-lg">{a.title}</strong>
            <p className="text-gray-700 mt-1">{a.message}</p>
            <p className="text-gray-400 text-sm mt-1">
              Posted on {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
