CREATE TYPE role_names AS ENUM (
  'admin',
  'staff',
  'member'
);

ALTER TABLE ezpunishments_users 
ADD COLUMN user_role role_names NOT NULL DEFAULT 'member';