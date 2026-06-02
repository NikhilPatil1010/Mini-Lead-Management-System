import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchLeadStats } from '../api/leads.api';
import { fetchRecentActivity } from '../api/activity.api';
import Spinner from '../components/ui/Spinner';
import ActivityTimeline from '../components/leads/ActivityTimeline';
import Navbar from '../components/layout/Navbar';

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetchLeadStats(),
          fetchRecentActivity(10),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <><Navbar /><Spinner /></>;

  const cards = [
    { label: 'Total Leads', value: stats?.total || 0, color: 'primary', icon: 'bi-people' },
    { label: 'Assigned', value: stats?.assigned || 0, color: 'info', icon: 'bi-person-check' },
    { label: 'Won', value: stats?.won || 0, color: 'success', icon: 'bi-trophy' },
    { label: 'Lost', value: stats?.lost || 0, color: 'danger', icon: 'bi-x-circle' },
  ];

  return (
    <div className="min-vh-100 pb-5">
      <Navbar />
      <div className="container-fluid px-4 mx-auto" style={{ maxWidth: '1400px' }}>
        <div className="d-flex justify-content-between align-items-end mb-4 mt-2">
          <div>
            <h3 className="fw-bold text-secondary mb-1">Dashboard</h3>
            <p className="text-muted mb-0">Welcome back, {user?.name}. Here's what's happening.</p>
          </div>
        </div>

        {error && <div className="alert alert-danger border-0 shadow-sm"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

        <div className="row g-4 mb-5">
          {cards.map((card) => (
            <div key={card.label} className="col-12 col-sm-6 col-xl-3">
              <div className="card h-100 border-0 shadow-sm" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div className="card-body p-4 d-flex align-items-center">
                  <div className={`rounded-circle d-flex align-items-center justify-content-center bg-${card.color} bg-opacity-10 text-${card.color} me-3`} style={{ width: '56px', height: '56px' }}>
                    <i className={`bi ${card.icon} fs-3`}></i>
                  </div>
                  <div>
                    <p className="text-muted fw-semibold mb-0" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{card.label}</p>
                    <h2 className="mb-0 fw-bold text-secondary" style={{ fontSize: '2rem' }}>{card.value}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom-0 pt-4 pb-0 px-4">
                <h5 className="fw-bold text-secondary mb-0">Recent Activity</h5>
              </div>
              <div className="card-body p-4">
                {activity.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-clock-history fs-1 mb-3 d-block opacity-50"></i>
                    <p>No recent activity found.</p>
                  </div>
                ) : (
                  <ActivityTimeline logs={activity} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
