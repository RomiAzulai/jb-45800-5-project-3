import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Vacation, VacationFilter } from '../types';
import VacationCard from '../components/VacationCard';

const Vacations = () => {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<VacationFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchVacations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/vacations', {
        params: { page, filter },
      });
      setVacations(response.data.vacations);
      setTotalPages(response.data.pagination.totalPages);
    } catch {
      setError('Failed to load vacations');
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => {
    fetchVacations();
  }, [fetchVacations]);

  const handleLike = async (id: number) => {
    try {
      await api.post(`/api/vacations/${id}/like`);
      fetchVacations();
    } catch {
      setError('Failed to update like');
    }
  };

  const handleFilterChange = (newFilter: VacationFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div className="page-container">
      <h1>Vacations</h1>

      <div className="filter-buttons">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFilterChange('all')}
        >
          All Vacations
        </button>
        <button
          className={`btn ${filter === 'liked' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFilterChange('liked')}
        >
          My Likes
        </button>
        <button
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFilterChange('active')}
        >
          Active Now
        </button>
        <button
          className={`btn ${filter === 'future' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => handleFilterChange('future')}
        >
          Upcoming
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading vacations...</div>
      ) : vacations.length === 0 ? (
        <div className="empty-state">No vacations found.</div>
      ) : (
        <>
          <div className="vacations-grid">
            {vacations.map((vacation) => (
              <VacationCard
                key={vacation.id}
                vacation={vacation}
                showLike={true}
                onLike={handleLike}
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

export default Vacations;
