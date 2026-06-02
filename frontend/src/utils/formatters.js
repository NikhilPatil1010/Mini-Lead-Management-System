import { STATUS_OPTIONS } from './constants';

export const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusBadgeColor = (status) => {
  const option = STATUS_OPTIONS.find((s) => s.value === status);
  return option?.color || 'secondary';
};

export const getStatusLabel = (status) => {
  const option = STATUS_OPTIONS.find((s) => s.value === status);
  return option?.label || status;
};
