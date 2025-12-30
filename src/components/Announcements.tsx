import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type AnnouncementType = {
  id: number;
  title: string;
  message: string;
  image_url?: string | null;
  created_at: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<AnnouncementType[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-600 text-lg">Loading announcements…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Community Updates</h2>

      {announcements.length === 0 ? (
        <p className="text-gray-700 text-lg">
          No announcements at the moment.
        </p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            {/* 🖼 Announcement image */}
            {a.image_url && (
              <img
                src={a.image_url}
                alt={a.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {a.title}
              </h3>

              {a.message && (
                <p className="text-gray-700 text-lg mt-2">
                  {a.message}
                </p>
              )}

              <p className="text-gray-400 text-sm mt-3">
                Posted on{" "}
                {new Date(a.created_at).toLocaleString("en-GB", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
