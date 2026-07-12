import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { getImageUrl } from '../services/api';

const EditVacation = () => {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [price, setPrice] = useState('');
  const [currentImage, setCurrentImage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVacation = async () => {
      try {
        const response = await api.get(`/api/vacations/${id}`);
        const v = response.data;
        setDestination(v.destination);
        setDescription(v.description);
        setStartDate(v.startDate.split('T')[0]);
        setEndDate(v.endDate.split('T')[0]);
        setPrice(v.price.toString());
        setCurrentImage(v.imageFilename);
      } catch {
        setError('Failed to load vacation');
      }
    };
    fetchVacation();
  }, [id]);

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

    setLoading(true);
    const formData = new FormData();
    formData.append('destination', destination);
    formData.append('description', description);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('price', priceNum.toString());
    if (image) {
      formData.append('image', image);
    }

    try {
      await api.put(`/api/vacations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to update vacation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Edit Vacation</h1>
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
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              value={endDate}
              min={startDate}
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
          <label>Current Image</label>
          {currentImage && (
            <img
              src={getImageUrl(currentImage)}
              alt="Current"
              className="current-image-preview"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-vacation.svg';
              }}
            />
          )}
        </div>
        <div className="form-group">
          <label>Change Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVacation;
