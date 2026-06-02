const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const logger = require('../utils/logger');

const ALLOWED_SORT_COLUMNS = ['created_at', 'updated_at', 'name', 'status', 'source'];

const buildWhereClause = (user, filters) => {
  const conditions = [];
  const values = [];

  // Role-based scoping
  if (user.role === 'manager') {
    values.push(user.id);
    conditions.push(`l.created_by = $${values.length}`);
  } else if (user.role === 'agent') {
    values.push(user.id);
    conditions.push(`l.assigned_to = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`l.status = $${values.length}`);
  }

  if (filters.source) {
    values.push(filters.source);
    conditions.push(`l.source = $${values.length}`);
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`;
    values.push(searchPattern, searchPattern, searchPattern);
    const vLen = values.length;
    conditions.push(`(l.name ILIKE $${vLen - 2} OR l.email ILIKE $${vLen - 1} OR l.phone ILIKE $${vLen})`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  return { whereClause, values };
};

const list = async (user, queryParams) => {
  const page = Math.max(parseInt(queryParams.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(queryParams.limit, 10) || 10, 1), 100);
  const offset = (page - 1) * limit;

  const sortBy = ALLOWED_SORT_COLUMNS.includes(queryParams.sortBy) ? queryParams.sortBy : 'created_at';
  const order = queryParams.order === 'asc' ? 'ASC' : 'DESC';

  const { whereClause, values } = buildWhereClause(user, queryParams);

  const countQuery = `SELECT COUNT(*) as count FROM leads l ${whereClause}`;
  const countResult = await db.query(countQuery, values);
  const total = parseInt(countResult.rows[0].count, 10);

  values.push(limit, offset);
  const vLen = values.length;
  const dataQuery = `
    SELECT l.*, u.name AS assigned_agent_name
    FROM leads l
    LEFT JOIN users u ON l.assigned_to = u.id
    ${whereClause}
    ORDER BY l.${sortBy} ${order}
    LIMIT $${vLen - 1} OFFSET $${vLen}
  `;

  const dataResult = await db.query(dataQuery, values);

  return {
    leads: dataResult.rows,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findById = async (id, user) => {
  const result = await db.query(
    `SELECT l.*, u.name AS assigned_agent_name, creator.name AS created_by_name
     FROM leads l
     LEFT JOIN users u ON l.assigned_to = u.id
     LEFT JOIN users creator ON l.created_by = creator.id
     WHERE l.id = $1`,
    [id]
  );

  const lead = result.rows[0];
  if (!lead) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'manager' && lead.created_by !== user.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }
  if (user.role === 'agent' && lead.assigned_to !== user.id) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    throw error;
  }

  return lead;
};

const create = async (data, userId) => {
  const { name, email, phone, source, status, notes } = data;
  const id = uuidv4();

  await db.query(
    `INSERT INTO leads (id, name, email, phone, source, status, notes, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, name, email || null, phone || null, source || null, status || 'new', notes || null, userId]
  );

  const result = await db.query('SELECT * FROM leads WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, data, user) => {
  const existing = await findById(id, user);

  const fields = ['name', 'email', 'phone', 'source', 'status', 'notes', 'assigned_to'];
  const updates = [];
  const values = [];

  for (const field of fields) {
    if (data[field] !== undefined) {
      values.push(data[field] === '' ? null : data[field]);
      updates.push(`${field} = $${values.length}`);
    }
  }

  if (updates.length === 0) {
    return existing;
  }

  values.push(id);
  await db.query(`UPDATE leads SET ${updates.join(', ')} WHERE id = $${values.length}`, values);

  const result = await db.query('SELECT * FROM leads WHERE id = $1', [id]);
  return { before: existing, after: result.rows[0] };
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM leads WHERE id = $1', [id]);

  if (result.rowCount === 0) {
    const error = new Error('Lead not found');
    error.statusCode = 404;
    throw error;
  }
};

const getStats = async (user) => {
  let whereClause = '';
  const values = [];

  if (user.role === 'manager') {
    values.push(user.id);
    whereClause = 'WHERE created_by = $1';
  } else if (user.role === 'agent') {
    values.push(user.id);
    whereClause = 'WHERE assigned_to = $1';
  }

  const result = await db.query(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN assigned_to IS NOT NULL THEN 1 ELSE 0 END) AS assigned,
       SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS won,
       SUM(CASE WHEN status = 'lost' THEN 1 ELSE 0 END) AS lost
     FROM leads
     ${whereClause}`,
    values
  );

  return result.rows[0];
};

module.exports = { list, findById, create, update, remove, getStats };
