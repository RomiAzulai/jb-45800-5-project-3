import { Vacation } from '../types';
import { getImageUrl } from '../services/api';

interface VacationCardProps {
  vacation: Vacation;
  showLike?: boolean;
  showAdminActions?: boolean;
  onLike?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const VacationCard = ({
  vacation,
  showLike = true,
  showAdminActions = false,
  onLike,
  onEdit,
  onDelete,
}: VacationCardProps) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  return (
    <div className="vacation-card">
      <div className="card-image">
        <img
          src={getImageUrl(vacation.imageFilename)}
          alt={vacation.destination}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-vacation.svg';
          }}
        />
        {showLike && (
          <button
            className={`like-btn ${vacation.isLiked ? 'liked' : ''}`}
            onClick={() => onLike?.(vacation.id)}
            title={vacation.isLiked ? 'Unlike' : 'Like'}
          >
            {vacation.isLiked ? '❤️' : '🤍'} {vacation.likesCount}
          </button>
        )}
        {!showLike && (
          <span className="likes-badge">❤️ {vacation.likesCount}</span>
        )}
      </div>
      <div className="card-content">
        <h3>{vacation.destination}</h3>
        <p className="description">{vacation.description}</p>
        <div className="card-details">
          <span>📅 {formatDate(vacation.startDate)} - {formatDate(vacation.endDate)}</span>
          <span className="price">{formatPrice(vacation.price)}</span>
        </div>
        {showAdminActions && (
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={() => onEdit?.(vacation.id)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={() => onDelete?.(vacation.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacationCard;
