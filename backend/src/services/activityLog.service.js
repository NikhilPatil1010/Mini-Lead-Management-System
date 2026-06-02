const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const logger = require('../utils/logger');

const log = (leadId, performedBy, action, meta = {}) => {
  const id = uuidv4();
  // Fire-and-forget — never await this in the calling code
  db.query(
    `INSERT INTO activity_logs (id, lead_id, performed_by, action, meta)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, leadId, performedBy, action, JSON.stringify(meta)]
  ).catch((err) => {
    logger.warn('Failed to write activity log', { leadId, action, error: err.message });
  });
};

const getByLeadId = async (leadId, queryParams = {}) => {
  const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(queryParams.limit, 10) || 20, 1), 100);
  const offset = (page - 1) * limit;

  const countResult = await db.query(
    'SELECT COUNT(*) as count FROM activity_logs WHERE lead_id = $1',
    [leadId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  const result = await db.query(
    `SELECT a.*, u.name AS performed_by_name
     FROM activity_logs a
     LEFT JOIN users u ON a.performed_by = u.id
     WHERE a.lead_id = $1
     ORDER BY a.created_at DESC
     LIMIT $2 OFFSET $3`,
    [leadId, limit, offset]
  );

  return {
    logs: result.rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getRecent = async (user, limit = 10) => {
  let whereClause = '';
  let values = [];

  if (user.role === 'manager') {
    whereClause = 'WHERE l.created_by = $1';
    values = [user.id, limit];
  } else if (user.role === 'agent') {
    whereClause = 'WHERE l.assigned_to = $1';
    values = [user.id, limit];
  } else {
    values = [limit];
  }

  const result = await db.query(
    `SELECT a.*, u.name AS performed_by_name, l.name AS lead_name
     FROM activity_logs a
     LEFT JOIN users u ON a.performed_by = u.id
     LEFT JOIN leads l ON a.lead_id = l.id
     ${whereClause}
     ORDER BY a.created_at DESC
     LIMIT $${values.length}`,
    values
  );

  return result.rows;
};

module.exports = { log, getByLeadId, getRecent };
