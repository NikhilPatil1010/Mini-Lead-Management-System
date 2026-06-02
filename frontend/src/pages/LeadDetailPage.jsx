import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { fetchLeadById, updateLead, deleteLead } from '../api/leads.api';
import { fetchActivityByLead } from '../api/activity.api';
import Navbar from '../components/layout/Navbar';
import LeadForm from '../components/leads/LeadForm';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { formatDate, getStatusBadgeColor, getStatusLabel } from '../utils/formatters';
import { ROLES } from '../utils/constants';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [lead, setLead] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = async () => {
    try {
      const [leadRes, actRes] = await Promise.all([
        fetchLeadById(id),
        fetchActivityByLead(id),
      ]);
      setLead(leadRes.data.data);
      setActivity(actRes.data.data.logs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load lead');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleUpdate = async (data) => {
    setEditLoading(true);
    setEditError('');
    try {
      await updateLead(id, data);
      setShowEditModal(false);
      loadData();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update lead');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteLead(id);
      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lead');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <><Navbar /><Spinner /></>;
  if (error) return <><Navbar /><div className="container py-4"><div className="alert alert-danger">{error}</div></div></>;

  const canEdit = user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER;
  const canDelete = user?.role === ROLES.ADMIN;

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />
      <div className="container-fluid px-4 mx-auto" style={{ maxWidth: '1400px' }}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 mt-2">
          <div className="mb-3 mb-md-0 d-flex align-items-center">
            <button className="btn btn-light rounded-circle shadow-sm p-2 me-3 d-flex align-items-center justify-content-center" onClick={() => navigate('/leads')} style={{ width: '40px', height: '40px' }} title="Back to Leads">
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h3 className="fw-bold text-secondary mb-1">{lead.name}</h3>
              <p className="text-muted mb-0">Lead Details & Activity History</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            {canEdit && (
              <Button variant="outline-primary" className="shadow-sm bg-white" onClick={() => setShowEditModal(true)}>
                <i className="bi bi-pencil me-2"></i>Edit Lead
              </Button>
            )}
            {canDelete && (
              <Button variant="outline-danger" className="shadow-sm bg-white" onClick={() => setShowDeleteModal(true)}>
                <i className="bi bi-trash me-2"></i>Delete
              </Button>
            )}
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold text-secondary mb-0">Lead Details</h5>
              </div>
              <div className="card-body p-4">
                <div className="row g-4">
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Status</small>
                    <div className="mt-1"><Badge color={getStatusBadgeColor(lead.status)}>{getStatusLabel(lead.status)}</Badge></div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Source</small>
                    <div className="mt-1 fw-medium">{lead.source || '—'}</div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Email</small>
                    <div className="mt-1 fw-medium">{lead.email || '—'}</div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Phone</small>
                    <div className="mt-1 fw-medium">{lead.phone || '—'}</div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Assigned Agent</small>
                    <div className="mt-1 fw-medium d-flex align-items-center">
                      <i className="bi bi-person-badge text-primary me-2"></i>
                      {lead.assigned_agent_name || '—'}
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Created By</small>
                    <div className="mt-1 fw-medium text-muted">{lead.created_by_name || '—'}</div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Created</small>
                    <div className="mt-1 fw-medium text-muted">{formatDate(lead.created_at)}</div>
                  </div>
                  <div className="col-sm-6">
                    <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Updated</small>
                    <div className="mt-1 fw-medium text-muted">{formatDate(lead.updated_at)}</div>
                  </div>
                  {lead.notes && (
                    <div className="col-12 mt-4">
                      <small className="text-muted fw-semibold text-uppercase" style={{ letterSpacing: '0.5px', fontSize: '0.75rem' }}>Notes</small>
                      <div className="mt-2 p-3 bg-light rounded border border-light">
                        <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{lead.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold text-secondary mb-0">Activity Log</h5>
              </div>
              <div className="card-body p-4">
                {activity.length === 0 ? (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-clock-history fs-2 d-block opacity-50 mb-2"></i>
                    <small>No activity recorded yet.</small>
                  </div>
                ) : (
                  <ActivityTimeline logs={activity} />
                )}
              </div>
            </div>
          </div>
        </div>

        <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Lead">
          {editError && <div className="alert alert-danger border-0"><i className="bi bi-exclamation-triangle me-2"></i>{editError}</div>}
          <LeadForm initialData={lead} onSubmit={handleUpdate} loading={editLoading} />
        </Modal>

        <Modal
          show={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={<span className="text-danger"><i className="bi bi-exclamation-triangle-fill me-2"></i>Confirm Delete</span>}
          footer={
            <>
              <Button variant="light" className="border" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" loading={deleteLoading} onClick={handleDelete}>Delete Lead</Button>
            </>
          }
        >
          <p className="mb-0">Are you sure you want to delete <strong>{lead.name}</strong>? This action cannot be undone and will permanently remove all associated activity logs.</p>
        </Modal>
      </div>
    </div>
  );
}
