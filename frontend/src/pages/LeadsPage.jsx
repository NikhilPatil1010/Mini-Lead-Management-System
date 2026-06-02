import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useLeads } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { createLead } from '../api/leads.api';
import Navbar from '../components/layout/Navbar';
import LeadTable from '../components/leads/LeadTable';
import LeadFilters from '../components/leads/LeadFilters';
import LeadForm from '../components/leads/LeadForm';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { ROLES } from '../utils/constants';

export default function LeadsPage() {
  const { user } = useSelector((state) => state.auth);
  const { items, meta, filters, loading, error, loadLeads, updateFilters } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  useEffect(() => {
    loadLeads({ page: 1 });
  }, [filters.search, filters.status, filters.source, filters.sortBy, filters.order]);

  const handlePageChange = (page) => {
    loadLeads({ page });
  };

  const handleSort = (sortBy, order) => {
    updateFilters({ sortBy, order });
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleCreate = async (data) => {
    setCreateLoading(true);
    setCreateError('');
    try {
      await createLead(data);
      setShowCreateModal(false);
      loadLeads({ page: 1 });
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create lead');
    } finally {
      setCreateLoading(false);
    }
  };

  const canCreate = user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN;

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />
      <div className="container-fluid px-4 mx-auto" style={{ maxWidth: '1400px' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-2">
          <div className="mb-3 mb-md-0">
            <h3 className="fw-bold text-secondary mb-1">Lead Directory</h3>
            <p className="text-muted mb-0">Manage and track your active leads in one place.</p>
          </div>
          {canCreate && (
            <Button onClick={() => setShowCreateModal(true)} className="px-4 py-2 shadow-sm d-flex align-items-center">
              <i className="bi bi-plus-lg me-2"></i> New Lead
            </Button>
          )}
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <LeadFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={setSearchTerm}
            />
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 shadow-sm"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="p-5 d-flex justify-content-center"><Spinner /></div>
            ) : (
              <>
                <div className="table-responsive">
                  <LeadTable
                    leads={items}
                    sortBy={filters.sortBy}
                    order={filters.order}
                    onSort={handleSort}
                  />
                </div>
                {items.length > 0 && (
                  <div className="p-4 border-top">
                    <Pagination meta={meta} onPageChange={handlePageChange} />
                  </div>
                )}
                {items.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 mb-3 d-block opacity-50"></i>
                    <p>No leads found matching your criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Modal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Lead"
        >
          {createError && <div className="alert alert-danger border-0"><i className="bi bi-exclamation-triangle me-2"></i>{createError}</div>}
          <LeadForm onSubmit={handleCreate} loading={createLoading} />
        </Modal>
      </div>
    </div>
  );
}
