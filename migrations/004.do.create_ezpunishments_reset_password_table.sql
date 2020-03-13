CREATE TABLE ezpunishments_reset_password (
  user_id INTEGER REFERENCES (ezpunishments_users.id) NOT NULL CASCADE,
  token TEXT NOT NULL,
  expire TIMESTAMP NOT NULL,
  status INTEGER NOT NULL
)