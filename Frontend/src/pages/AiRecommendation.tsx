import { useState, FormEvent } from 'react';
import api from '../services/api';

const AiRecommendation = () => {
  const [destination, setDestination] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setRecommendation('');
    setLoading(true);

    try {
      const response = await api.post('/api/ai/recommend', { destination });
      setRecommendation(response.data.recommendation);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to get recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>AI Travel Recommendation</h1>
      <p className="page-description">
        Enter a travel destination and get AI-powered recommendations for your trip.
      </p>

      <form className="query-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Travel Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g., Paris, Tokyo, Bali..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Getting Recommendation...' : 'Get Recommendation'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}

      {recommendation && (
        <div className="recommendation-result">
          <h3>Recommendation for {destination}</h3>
          <div className="recommendation-text">
            {recommendation.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiRecommendation;
