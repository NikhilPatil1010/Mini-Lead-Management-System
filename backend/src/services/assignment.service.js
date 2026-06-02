const db = require('../db');
const logger = require('../utils/logger');
const mailer = require('../utils/mailer');

/**
 * Least-loaded agent assignment strategy.
 * Uses SELECT FOR UPDATE SKIP LOCKED inside a transaction
 * to prevent race conditions when multiple leads are created simultaneously.
 */
const assignLead = async (leadId, createdBy) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // Find agent with fewest active leads (status not in won/lost)
    // FOR UPDATE SKIP LOCKED prevents two concurrent transactions from picking the same agent
    const agentResult = await client.query(
      `SELECT u.id, u.name, u.email
       FROM users u
       WHERE u.role = 'agent'
       ORDER BY (
         SELECT COUNT(*) FROM leads l 
         WHERE l.assigned_to = u.id AND l.status NOT IN ('won', 'lost')
       ) ASC
       LIMIT 1
       FOR UPDATE SKIP LOCKED`
    );

    if (agentResult.rows.length === 0) {
      logger.warn('No agents available for auto-assignment');
      await client.query('COMMIT');
      return null;
    }

    const agent = agentResult.rows[0];

    await client.query(
      'UPDATE leads SET assigned_to = $1 WHERE id = $2',
      [agent.id, leadId]
    );

    await client.query('COMMIT');

    // Fetch lead name for the email
    const leadResult = await db.query('SELECT name FROM leads WHERE id = $1', [leadId]);
    const leadName = leadResult.rows[0]?.name || 'Unknown';

    // Fire-and-forget email notification
    mailer.sendLeadAssignedEmail({
      agentEmail: agent.email,
      agentName: agent.name,
      leadName,
    }).catch((err) => logger.error('Failed to send lead assigned email', err));

    logger.info(`Lead ${leadId} assigned to agent ${agent.id}`);
    return agent;
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('Assignment failed', err);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { assignLead };
