-- Create the app_storage table for storing application data
CREATE TABLE IF NOT EXISTS app_storage (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE app_storage ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you may want to restrict this in production)
CREATE POLICY "Allow all operations on app_storage" ON app_storage
  FOR ALL USING (true);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_storage_key ON app_storage(key);