CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(36) PRIMARY KEY,
  lead_id VARCHAR(36) NOT NULL,
  performed_by VARCHAR(36) NOT NULL,
  action VARCHAR(50) CHECK (action IN ('created', 'updated', 'assigned', 'status_changed')) NOT NULL,
  meta JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id)
);

CREATE INDEX idx_activity_logs_lead_id ON activity_logs(lead_id);
