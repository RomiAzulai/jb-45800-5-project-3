import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddVacation = () => {
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const priceNum = parseFloat(price);
    if (priceNum < 0 || priceNum > 10000) {
      setError('Price must be between 0 and 10,000');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    if (new Date(startDate) < new Date(today) || new Date(endDate) < new Date(today)) {
      setError('Cannot use past dates');
      return;
    }

    if (!image) {
      setError('Image is required');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('destination', destination);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('price', priceNum.toString());
    formData.append('image', image);

    try {
      await api.post('/api/vacations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to create vacation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Add New Vacation</h1>
      {error && <div className="error-message">{error}</div>}
      <form className="vacation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Destination *</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              value={startDate}
              min={today}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              value={endDate}
              min={startDate || today}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Price (0 - 10,000) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            max={10000}
            step={0.01}
            required
          />
        </div>
        <div className="form-group">
          <label>Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Vacation'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVacation;
