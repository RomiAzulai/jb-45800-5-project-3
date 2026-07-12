import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Vacation } from '../types';
import VacationCard from '../components/VacationCard';

const Admin = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVacations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/vacations', {
        params: { page, filter: 'all' },
      });
      setVacations(response.data.vacations);
      setTotalPages(response.data.pagination.totalPages);
    } catch {
      setError('Failed to load vacations');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  const handleEdit = (id: number) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const vacation = vacations.find((v) => v.id === id);
    const confirmed = window.confirm(
      `Are you sure you want to delete the vacation to ${vacation?.destination}?`
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/vacations/${id}`);
      fetchVacations();
    } catch {
      setError('Failed to delete vacation');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Vacations</h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/add')}>
          + Add New Vacation
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading vacations...</div>
      ) : (
        <>
          <div className="vacations-grid">
            {vacations.map((vacation) => (
              <VacationCard
                key={vacation.id}
                vacation={vacation}
                showLike={false}
                showAdminActions={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                className="btn btn-outline"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
