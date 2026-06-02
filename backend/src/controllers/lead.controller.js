const leadService = require('../services/lead.service');
const activityLogService = require('../services/activityLog.service');
const assignmentService = require('../services/assignment.service');
const mailer = require('../utils/mailer');
const db = require('../db');
const logger = require('../utils/logger');
const { sendResponse } = require('../utils/response');

const list = async (req, res) => {
  const result = await leadService.list(req.user, req.query);
  sendResponse(res, 200, true, result, 'Leads fetched');
};

const getById = async (req, res) => {
  const lead = await leadService.findById(req.params.id, req.user);
  sendResponse(res, 200, true, lead, 'Lead fetched');
};

const create = async (req, res) => {
  const lead = await leadService.create(req.body, req.user.id);

  activityLogService.log(lead.id, req.user.id, 'created', { lead });

  // Auto-assign if the creator is a manager
  if (req.user.role === 'manager') {
    await assignmentService.assignLead(lead.id, req.user.id);
  }

  // Re-fetch to get assigned agent info
  const freshLead = await leadService.findById(lead.id, req.user);
  sendResponse(res, 201, true, freshLead, 'Lead created successfully');
};

const update = async (req, res) => {
  const { before, after } = await leadService.update(req.params.id, req.body, req.user);

  // Determine what changed and log appropriately
  if (before.status !== after.status) {
    activityLogService.log(after.id, req.user.id, 'status_changed', {
      from: before.status,
      to: after.status,
    });

    // Notify manager when lead is won
    if (after.status === 'won') {
      db.query('SELECT name, email FROM users WHERE id = $1', [after.created_by])
        .then((result) => {
          if (result.rows[0]) {
            mailer.sendLeadWonEmail({
              managerEmail: result.rows[0].email,
              managerName: result.rows[0].name,
              leadName: after.name,
            }).catch((err) => logger.error('Failed to send lead won email', err));
          }
        })
        .catch((err) => logger.error('Failed to fetch manager for won email', err));
    }
  }

  if (before.assigned_to !== after.assigned_to) {
    activityLogService.log(after.id, req.user.id, 'assigned', {
      from: before.assigned_to,
      to: after.assigned_to,
    });
  }

  // Log generic update for other field changes
  const changedFields = {};
  const beforeFields = {};
  const trackFields = ['name', 'email', 'phone', 'source', 'notes'];
  for (const field of trackFields) {
    if (before[field] !== after[field]) {
      beforeFields[field] = before[field];
      changedFields[field] = after[field];
    }
  }
  if (Object.keys(changedFields).length > 0) {
    activityLogService.log(after.id, req.user.id, 'updated', {
      before: beforeFields,
      after: changedFields,
    });
  }

  sendResponse(res, 200, true, after, 'Lead updated successfully');
};

const remove = async (req, res) => {
  await leadService.remove(req.params.id);
  sendResponse(res, 200, true, null, 'Lead deleted successfully');
};

const stats = async (req, res) => {
  const data = await leadService.getStats(req.user);
  sendResponse(res, 200, true, data, 'Dashboard stats fetched');
};

module.exports = { list, getById, create, update, remove, stats };
