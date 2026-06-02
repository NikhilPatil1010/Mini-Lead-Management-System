import api from './axios';

export const fetchActivityByLead = (leadId, params) =>
  api.get(`/leads/${leadId}/activity`, { params });

export const fetchRecentActivity = (limit = 10) =>
  api.get('/leads/recent', { params: { limit } });
