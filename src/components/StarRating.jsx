import { FiStar } from 'react-icons/fi';
import { renderStars } from '../utils/helpers';
import './StarRating.css';

export default function StarRating({ rating = 0, size = 16, interactive = false, onChange }) {
  const stars = renderStars(rating);

  if (interactive) {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            className={`star-btn ${val <= rating ? 'star-active' : ''}`}
            onClick={() => onChange?.(val)}
            style={{ fontSize: size }}
          >
            <FiStar />
          </button>
        ))}
        {rating > 0 && <span className="star-value">{rating}.0</span>}
      </div>
    );
  }

  return (
    <div className="star-rating">
      {stars.map((type, i) => (
        <span
          key={i}
          className={`star-icon star-${type}`}
          style={{ fontSize: size }}
        >
          <FiStar />
        </span>
      ))}
      {rating > 0 && <span className="star-value">{rating.toFixed(1)}</span>}
    </div>
  );
}
