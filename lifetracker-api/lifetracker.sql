-- Prompt the user to confirm the deletion of the lifetracker database
-- and create a new lifetracker database.
DROP DATABASE IF EXISTS lifetracker;
CREATE DATABASE lifetracker;

-- Connect to the lifetracker database
\c lifetracker;

-- Run the lifetracker-schema.sql script to create the database schema
\i lifetracker-schema.sql;


-- Prompt the user to confirm the deletion of the lifetracker_test database
-- and create a new lifetracker_test database.
DROP DATABASE IF EXISTS lifetracker_test;
CREATE DATABASE lifetracker_test;

-- Connect to the lifetracker_test database
\c lifetracker_test;

-- Run the lifetracker-schema.sql script to create the database schema
\i ./lifetracker-schema.sql;