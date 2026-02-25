import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import './AssetCard.css';

const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleString();
};

const getInitials = (value) => {
  if (!value) return 'U';
  const parts = value.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
};

export default function AssetCard({ asset, index }) {
  const user = asset.user || {};
  const hasBackground = Boolean(asset.backgroundPhoto);

  return (
    <motion.article
      className="asset-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <div className="asset-card-media">
        {hasBackground ? (
          <img src={asset.backgroundPhoto} alt={asset.skillOffered} />
        ) : (
          <div className="asset-media-fallback" />
        )}
      </div>
      <div className="asset-card-body">
        <div className="asset-user">
          <div className="asset-avatar">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.name || 'User'} />
            ) : (
              <span>{getInitials(user.name || user.email)}</span>
            )}
          </div>
          <div>
            <Link to={`/profile/${user._id}`} className="asset-username">
              {user.name || user.email || 'Unknown User'}
            </Link>
            <span className="asset-timestamp">{formatTime(asset.createdAt)}</span>
          </div>
        </div>

        <h3 className="asset-skill">{asset.skillOffered}</h3>
        <p className="asset-description">{asset.description}</p>

        <div className="asset-actions">
          <Link to={`/profile/${user._id}`}>
            <Button variant="secondary" size="sm">
              View Profile
            </Button>
          </Link>
          <Link to={`/create-swap?receiverId=${user._id}`}>
            <Button variant="primary" size="sm">
              Request Skill Swap
            </Button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
