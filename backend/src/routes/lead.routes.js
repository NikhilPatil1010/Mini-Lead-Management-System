const { Router } = require('express');
const leadController = require('../controllers/lead.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');
const { createLeadSchema, updateLeadSchema } = require('../validators/lead.validator');

const router = Router();

router.use(verifyToken);

/**
 * @swagger
 * /api/leads/stats:
 *   get:
 *     tags: [Leads]
 *     summary: Get dashboard stats (Total, Assigned, Won, Lost)
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Stats fetched }
 */
router.get('/stats', leadController.stats);

/**
 * @swagger
 * /api/leads:
 *   get:
 *     tags: [Leads]
 *     summary: List leads with pagination, search, sorting, and filters
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: created_at }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc], default: desc }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [new, contacted, qualified, lost, won] }
 *       - in: query
 *         name: source
 *         schema: { type: string }
 *     responses:
 *       200: { description: Paginated list of leads }
 */
router.get('/', leadController.list);

/**
 * @swagger
 * /api/leads/{id}:
 *   get:
 *     tags: [Leads]
 *     summary: Get a single lead by ID
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Lead details }
 *       404: { description: Lead not found }
 */
router.get('/:id', leadController.getById);

/**
 * @swagger
 * /api/leads:
 *   post:
 *     tags: [Leads]
 *     summary: Create a new lead (manager/admin only)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               source: { type: string }
 *               status: { type: string, enum: [new, contacted, qualified, lost, won] }
 *               notes: { type: string }
 *     responses:
 *       201: { description: Lead created }
 *       403: { description: Forbidden }
 */
router.post('/', requireRole('manager', 'admin'), validate(createLeadSchema), leadController.create);

/**
 * @swagger
 * /api/leads/{id}:
 *   put:
 *     tags: [Leads]
 *     summary: Update a lead (manager/admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Lead updated }
 */
router.put('/:id', requireRole('manager', 'admin'), validate(updateLeadSchema), leadController.update);

/**
 * @swagger
 * /api/leads/{id}:
 *   delete:
 *     tags: [Leads]
 *     summary: Delete a lead (admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Lead deleted }
 */
router.delete('/:id', requireRole('admin'), leadController.remove);

module.exports = router;
