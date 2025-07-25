-- Initialize staging databases
-- This script creates separate databases for each staging environment

-- Create databases for staging environments 1-20 (expandable)
DO $$
BEGIN
    FOR i IN 1..20 LOOP
        EXECUTE format('CREATE DATABASE staging_db_%s WITH OWNER ${STAG_DB_USER}', i);
    END LOOP;
END $$;

-- Grant all privileges to staging user on all created databases
DO $$
BEGIN
    FOR i IN 1..20 LOOP
        EXECUTE format('GRANT ALL PRIVILEGES ON DATABASE staging_db_%s TO ${STAG_DB_USER}', i);
    END LOOP;
END $$;