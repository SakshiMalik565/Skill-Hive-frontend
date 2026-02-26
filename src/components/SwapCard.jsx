import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { getStatusColor, getInitials, getAvatarGradient, timeAgo, formatDate } from '../utils/helpers';
import StarRating from './StarRating';
import { useSwaps } from '../context/SwapContext';
import toast from 'react-hot-toast';
import './SwapCard.css';

export default function SwapCard({ swap, index = 0, currentUserId }) {
  const statusInfo = getStatusColor(swap.status);
  const isRequester = swap.requester._id === currentUserId;
  const otherUser = isRequester ? swap.receiver : swap.requester;
  const { deleteSwap } = useSwaps();

  const canDelete = isRequester && swap.status === 'pending';

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this swap request?');
    if (!confirmed) return;
    try {
      await deleteSwap(swap._id);
    } catch (error) {
      toast.error(error?.message || 'Unable to delete swap');
    }
  };

  return (
    <motion.div
      className="swap-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(255,107,107,0.15)' }}
      layout
    >
      <div className="swap-card-header">
        <div className="swap-card-users">
          <div className="swap-card-avatar" style={{ background: getAvatarGradient(swap.requester._id) }}>
            {getInitials(swap.requester.name)}
          </div>
          <motion.div
            className="swap-card-arrow"
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <HiOutlineSwitchHorizontal />
          </motion.div>
          <div className="swap-card-avatar" style={{ background: getAvatarGradient(swap.receiver._id) }}>
            {getInitials(swap.receiver.name)}
          </div>
        </div>
        <span
          className="swap-card-status"
          style={{ background: statusInfo.bg, color: statusInfo.text }}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="swap-card-body">
        <div className="swap-card-skills">
          <div className="swap-card-skill">
            <span className="swap-card-skill-label">Offering</span>
            <span className="swap-card-skill-name swap-skill-coral">{swap.skillOffered}</span>
          </div>
          <div className="swap-card-exchange-icon">⇄</div>
          <div className="swap-card-skill">
            <span className="swap-card-skill-label">Requesting</span>
            <span className="swap-card-skill-name swap-skill-teal">{swap.skillRequested}</span>
          </div>
        </div>

        <div className="swap-card-meta">
          <span className="swap-card-meta-item">
            <FiClock />
            {timeAgo(swap.createdAt)}
          </span>
          {swap.scheduledDate && (
            <span className="swap-card-meta-item">
              <FiCalendar />
              {formatDate(swap.scheduledDate)}
            </span>
          )}
        </div>

        <div className="swap-card-footer">
          <div className="swap-card-user-info">
            <span className="swap-card-with">
              {isRequester ? 'To: ' : 'From: '}
              <strong>{otherUser.name}</strong>
            </span>
            {otherUser.rating > 0 && <StarRating rating={otherUser.rating} size={13} />}
          </div>
          <div className="swap-card-actions">
            {canDelete && (
              <button type="button" className="swap-card-delete" onClick={handleDelete}>
                Delete
              </button>
            )}
            <Link to={`/swap/${swap._id}`} className="swap-card-link">
              View <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      <div className="swap-card-border-glow" />
    </motion.div>
  );
}
