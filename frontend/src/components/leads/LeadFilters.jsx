import { STATUS_OPTIONS, SOURCE_OPTIONS } from '../../utils/constants';

export default function LeadFilters({ filters, onFilterChange, onSearch }) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-md-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search name, email, phone..."
          value={filters.search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div className="col-md-3">
        <select
          className="form-select"
          value={filters.source}
          onChange={(e) => onFilterChange({ source: e.target.value })}
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
