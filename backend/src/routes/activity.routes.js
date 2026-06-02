const { Router } = require('express');
const activityController = require('../controllers/activity.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/leads/recent:
 *   get:
 *     tags: [Activity]
 *     summary: Get recent activity logs across leads
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List of recent activity logs }
 */
router.get('/recent', activityController.getRecent);

/**
 * @swagger
 * /api/leads/{id}/activity:
 *   get:
 *     tags: [Activity]
 *     summary: Get activity logs for a specific lead
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Paginated list of activity logs }
 */
router.get('/:id/activity', activityController.getByLeadId);

module.exports = router;
