CREATE TABLE users (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  google_tokens jsonb NOT NULL DEFAULT '{}' :: jsonb,
  picture text
);

CREATE TABLE professionals (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  specialty text NOT NULL,
  email text UNIQUE NOT NULL
);

CREATE TABLE bookings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  professional_email text NOT NULL,
  date timestamp NOT NULL,
  status text NOT NULL
);

CREATE TABLE payments (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint REFERENCES users (id),
  booking_id bigint REFERENCES bookings (id),
  amount numeric(10, 2) NOT NULL,
  status text NOT NULL, 
  date timestamp NOT NULL,
  reference text NOT NULL,
  payment_method text NOT NULL
);