import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import { formatDate, getStatusBadgeColor, getStatusLabel } from '../../utils/formatters';

export default function LeadTable({ leads, sortBy, order, onSort }) {
  const navigate = useNavigate();

  const handleSort = (column) => {
    const newOrder = sortBy === column && order === 'asc' ? 'desc' : 'asc';
    onSort(column, newOrder);
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="text-muted ms-1">↕</span>;
    return <span className="ms-1">{order === 'asc' ? '↑' : '↓'}</span>;
  };

  if (!leads.length) {
    return (
      <div className="text-center text-muted py-5">
        <h5>No leads found</h5>
        <p>Try adjusting your filters or create a new lead.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th role="button" onClick={() => handleSort('name')}>Name <SortIcon column="name" /></th>
            <th>Email</th>
            <th role="button" onClick={() => handleSort('status')}>Status <SortIcon column="status" /></th>
            <th role="button" onClick={() => handleSort('source')}>Source <SortIcon column="source" /></th>
            <th>Assigned Agent</th>
            <th role="button" onClick={() => handleSort('created_at')}>Created <SortIcon column="created_at" /></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="fw-medium">{lead.name}</td>
              <td>{lead.email || '—'}</td>
              <td><Badge color={getStatusBadgeColor(lead.status)}>{getStatusLabel(lead.status)}</Badge></td>
              <td>{lead.source || '—'}</td>
              <td>{lead.assigned_agent_name || '—'}</td>
              <td>{formatDate(lead.created_at)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
