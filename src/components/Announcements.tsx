import React from "react";

type Announcement = {
  id: number;
  title: string;
  message: string;
};

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Road Closure",
    message: "Main Street will be closed from 10 AM to 2 PM on 5th Jan."
  },
  {
    id: 2,
    title: "Community Meeting",
    message: "Village Hall meeting at 7 PM on 3rd Jan."
  }
];

export default function Announcements() {
  return (
    <div>
      <h2>Community Updates</h2>
      {announcements.map((a) => (
        <div key={a.id} style={{ border: "1px solid #ccc", padding: "8px", margin: "8px 0" }}>
          <strong>{a.title}</strong>
          <p>{a.message}</p>
        </div>
      ))}
    </div>
  );
}
