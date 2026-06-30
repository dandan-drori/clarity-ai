CREATE TABLE clarity_ai_transactions (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  transaction_date TIMESTAMPTZ NOT NULL,
  merchant VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  user_id INTEGER REFERENCES users(id),
);