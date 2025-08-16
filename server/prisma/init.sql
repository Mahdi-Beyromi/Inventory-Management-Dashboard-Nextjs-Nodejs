-- Initialize the inventory database
-- This script runs when the PostgreSQL container starts

-- Create the database if it doesn't exist
-- (PostgreSQL creates it automatically based on POSTGRES_DB env var)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;

-- Connect to the inventory_db
\c inventory_db;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO inventory_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO inventory_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO inventory_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO inventory_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO inventory_user;
