-- SomosCasa Database Initialization
-- This script runs only on first container creation

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS somoscasa;

-- Grant privileges
GRANT ALL PRIVILEGES ON SCHEMA somoscasa TO somoscasa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA somoscasa TO somoscasa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA somoscasa GRANT ALL ON TABLES TO somoscasa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA somoscasa GRANT ALL ON SEQUENCES TO somoscasa_user;
