BEGIN;

TRUNCATE
  ezpunishments_users,
  ezpunishments_punishments
  RESTART IDENTITY CASCADE;

INSERT INTO ezpunishments_users (email, user_name, password)
VALUES
  ('dunder@test.com', 'dunderMifflin29', '$2a$12$Pkxp8JTF90HG6gYbIKJiiuzPjBHSOcpe1oUY6c1ESHcZ0ISUHmm0K'),
  ('bodeep@test.com', 'b.deboop', '$2a$12$F3FfnzwFNV4UzR5yfompGuguHf/2BQ.UQIJV31I1EnnoLlQYp4bJK'),
  ('cbloggs@test.com', 'c.bloggs', '$2a$12$vGNF/O9PxrqwBznaHTahiO8XjQHn/l.hDkWgfNEQ5ByR3yO6W5wK6'),
  ('ssmith@test.com', 's.smith', '$2a$12$p8iB9hvjQ/2Cq4.t8weY6eb9pnsHBi4DO8Z.ImjE1uohgMBAjUXW.'),
  ('ataylor@test.com', 'lexlor', '$2a$12$2c6qdB4kkNtncAWwg2180.3ZiKNbqGnetdwQ8CP3Y5xY3ANs3ToNm'),
  ('ping@test.com', 'wippy', '$2a$12$RAC6HoaOZ2GvWp6ZAqPk5eDX.z3wTIZTsyOhHBJJt8OBtKF7rdkS.');

INSERT INTO ezpunishments_punishments (name, reason, punished_by, active, expires)
VALUES
  ('AveraqeDev', 'Hacking', 'CONSOLE', TRUE, now()),
  ('hackerdude200', 'Hacking', 'CONSOLE', TRUE, now()),
  ('masterdisrespect', 'Disrespect', 'CONSOLE', TRUE, now()),
  ('seniorspammer', 'Spamming', 'CONSOLE', TRUE, now()),
  ('sirhacksolot', 'Hacking', 'CONSOLE', TRUE, now()),
  ('swearingallday', 'Swearing', 'CONSOLE', TRUE, now()),
  ('ddoser2000', 'DDoS Threats', 'CONSOLE', TRUE, now()),
  ('hax4life', 'Hacking', 'CONSOLE', TRUE, now()),
  ('harrassing4sport', 'Harrassing', 'CONSOLE', TRUE, now()),
  ('deaththreat1', 'Death Threats', 'CONSOLE', TRUE, now());
  
COMMIT;