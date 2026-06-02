import Badge from '../ui/Badge';
import { formatDate } from '../../utils/formatters';

const ACTION_LABELS = {
  created: { label: 'Created', color: 'success' },
  updated: { label: 'Updated', color: 'info' },
  assigned: { label: 'Assigned', color: 'primary' },
  status_changed: { label: 'Status Changed', color: 'warning' },
};

export default function ActivityTimeline({ logs }) {
  if (!logs || logs.length === 0) {
    return <p className="text-muted text-center py-3">No activity yet.</p>;
  }

  return (
    <div className="list-group list-group-flush">
      {logs.map((log) => {
        const actionInfo = ACTION_LABELS[log.action] || { label: log.action, color: 'secondary' };
        return (
          <div key={log.id} className="list-group-item px-0">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Badge color={actionInfo.color}>{actionInfo.label}</Badge>
                <span className="ms-2 text-muted small">by {log.performed_by_name || 'System'}</span>
              </div>
              <small className="text-muted">{formatDate(log.created_at)}</small>
            </div>
            {log.meta && Object.keys(log.meta).length > 0 && (
              <div className="mt-1 small text-muted">
                {log.action === 'assigned' && (
                  <span>Agent changed</span>
                )}
                {log.action === 'status_changed' && (
                  <span>{log.meta.from} → {log.meta.to}</span>
                )}
                {log.action === 'updated' && log.meta.after && (
                  <span>Fields changed: {Object.keys(log.meta.after).join(', ')}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
