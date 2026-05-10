CREATE TABLE IF NOT EXISTS usage_tracking (
  id BIGSERIAL PRIMARY KEY,
  ip_address TEXT NOT NULL,
  date TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(ip_address, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_ip_date ON usage_tracking(ip_address, date);
