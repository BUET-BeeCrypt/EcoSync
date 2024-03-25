DROP TABLE IF EXISTS ticket_stops CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS train_stops CASCADE;
DROP TABLE IF EXISTS trains CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS stations CASCADE;



CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  balance INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS stations (
  station_id INTEGER PRIMARY KEY,
  station_name TEXT NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS trains (
  train_id INTEGER PRIMARY KEY,
  train_name TEXT NOT NULL,
  capacity INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS train_stops (
  train_stop_id SERIAL PRIMARY KEY,
  next_stop_id INTEGER,
  train_id INTEGER,
  station_id INTEGER,
  arrival_time TEXT,
  departure_time TEXT,
  fare INTEGER NOT NULL,
  FOREIGN KEY (train_id) REFERENCES trains (train_id),
  FOREIGN KEY (station_id) REFERENCES stations (station_id),
  FOREIGN KEY (next_stop_id) REFERENCES train_stops (train_stop_id)
);

CREATE TABLE IF NOT EXISTS tickets (
  ticket_id SERIAL PRIMARY KEY,
  wallet_id INTEGER NOT NULL,
  FOREIGN KEY (wallet_id) REFERENCES users (user_id)
);

CREATE TABLE IF NOT EXISTS ticket_stops (
    ticket_stop_id SERIAL PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    train_stop_id INTEGER NOT NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets (ticket_id),
    FOREIGN KEY (train_stop_id) REFERENCES train_stops (train_stop_id)
);


