import React, { useEffect, useState } from 'react'
import supabase from './supabaseClient'

interface Announcement {
  id: number
  title: string
  message: string
}

interface Event {
  id: number
  name: string
  date: string
  location: string
}

const App: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: ann } = await supabase.from<Announcement>('announcements').select('*')
    setAnnouncements(ann || [])

    const { data: ev } = await supabase.from<Event>('events').select('*')
    setEvents(ev || [])
  }

  return (
    <div>
      <h1>Announcements</h1>
      <ul>
        {announcements.map(a => <li key={a.id}>{a.title}: {a.message}</li>)}
      </ul>

      <h1>Events</h1>
      <ul>
        {events.map(e => <li key={e.id}>{e.name} on {e.date} at {e.location}</li>)}
      </ul>
    </div>
  )
}

export default App
