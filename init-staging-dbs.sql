-- Initialize staging databases
-- This script creates separate databases for each staging environment

-- Step 1: Generate CREATE DATABASE statements
-- Copy and execute the output from this query:
SELECT format('CREATE DATABASE staging_db_%s WITH OWNER ${STAG_DB_USER};', generate_series) AS create_statements
FROM generate_series(1, 20);

-- Step 2: Generate GRANT statements
-- Copy and execute the output from this query:
SELECT format('GRANT ALL PRIVILEGES ON DATABASE staging_db_%s TO ${STAG_DB_USER};', generate_series) AS grant_statements
FROM generate_series(1, 20);