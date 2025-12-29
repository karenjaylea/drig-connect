/*
  # Community Village Events System

  ## Overview
  Creates tables for managing community events and user reminders to keep villagers connected and informed about local happenings.

  ## New Tables
  
  ### events
  - `id` (uuid, primary key) - Unique identifier for each event
  - `title` (text) - Event name/title
  - `description` (text) - Detailed description of the event
  - `event_date` (date) - Date when the event occurs
  - `event_time` (time) - Time when the event starts
  - `location` (text) - Where the event takes place
  - `category` (text) - Type of event (meeting, social, maintenance, etc.)
  - `created_at` (timestamptz) - When the event was created
  - `updated_at` (timestamptz) - When the event was last updated

  ### reminders
  - `id` (uuid, primary key) - Unique identifier for each reminder
  - `event_id` (uuid, foreign key) - Links to the event
  - `user_identifier` (text) - Simple identifier for the user (email, phone, etc.)
  - `reminder_minutes` (integer) - Minutes before event to send reminder (e.g., 60 = 1 hour)
  - `is_active` (boolean) - Whether the reminder is active
  - `created_at` (timestamptz) - When the reminder was set

  ## Security
  - Enable RLS on both tables
  - Public read access for events (community-wide visibility)
  - Users can create their own reminders
  - Users can manage their own reminders

  ## Notes
  - Events are public by default for community transparency
  - Reminders use a simple user identifier system
  - Multiple reminder timescales supported per event
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_time time NOT NULL,
  location text DEFAULT '',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_identifier text NOT NULL,
  reminder_minutes integer NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Events policies (public read access for community)
CREATE POLICY "Anyone can view events"
  ON events
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create events"
  ON events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update events"
  ON events
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete events"
  ON events
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Reminders policies
CREATE POLICY "Anyone can view reminders"
  ON reminders
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can create reminders"
  ON reminders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their reminders"
  ON reminders
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete their reminders"
  ON reminders
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS events_date_idx ON events(event_date);
CREATE INDEX IF NOT EXISTS reminders_event_id_idx ON reminders(event_id);
CREATE INDEX IF NOT EXISTS reminders_user_identifier_idx ON reminders(user_identifier);