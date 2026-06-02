const { z } = require('zod');

const createLeadSchema = z.object({
  name: z.string().min(1, 'Lead name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  source: z.string().max(50).optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']).optional(),
  notes: z.string().optional().or(z.literal('')),
});

const updateLeadSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  source: z.string().max(50).optional().or(z.literal('')),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']).optional(),
  notes: z.string().optional().or(z.literal('')),
  assigned_to: z.string().uuid().nullable().optional(),
});

module.exports = { createLeadSchema, updateLeadSchema };
