const activityLogService = require('../services/activityLog.service');
const { sendResponse } = require('../utils/response');

const getByLeadId = async (req, res) => {
  const result = await activityLogService.getByLeadId(req.params.id, req.query);
  sendResponse(res, 200, true, result, 'Activity logs fetched');
};

const getRecent = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const logs = await activityLogService.getRecent(req.user, limit);
  sendResponse(res, 200, true, logs, 'Recent activity fetched');
};

module.exports = { getByLeadId, getRecent };
