import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiXCircle,
  FiMessageSquare, FiStar, FiUser,
} from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useSwaps } from '../context/SwapContext';
import { getStatusColor, getInitials, getAvatarGradient, formatDateTime, timeAgo } from '../utils/helpers';
import toast from 'react-hot-toast';
import './SwapDetails.css';

export default function SwapDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSwapById, updateSwapStatus, addFeedback, fetchSwaps, swaps } = useSwaps();

  const [loading, setLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (swaps.length === 0) fetchSwaps();
  }, [swaps.length, fetchSwaps]);

  const swap = getSwapById(id);

  if (!swap && swaps.length === 0) return <LoadingSpinner fullScreen text="Loading swap details..." />;

  if (!swap) {
    return (
      <AnimatedPage>
        <section className="swap-details-page">
          <div className="container">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">Swap not found</h3>
              <p className="empty-state-text">This swap request doesn't exist or has been removed.</p>
              <Button variant="teal" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            </div>
          </div>
        </section>
      </AnimatedPage>
    );
  }

  const isReceiver = swap.receiver._id === user?._id;
  const isRequester = swap.requester._id === user?._id;
  const statusInfo = getStatusColor(swap.status);

  const handleStatus = async (status) => {
    setLoading(true);
    try {
      await updateSwapStatus(swap._id, status);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async () => {
    if (!feedbackText.trim()) { toast.error('Please write some feedback'); return; }
    if (!feedbackRating) { toast.error('Please add a rating'); return; }
    setLoading(true);
    try {
      await addFeedback(swap._id, feedbackText, feedbackRating);
      setShowFeedback(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="swap-details-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>

          {/* Header */}
          <motion.div
            className="swap-details-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="sd-header-left">
              <h1 className="page-title">Swap Details</h1>
              <span
                className="swap-status-badge-lg"
                style={{ background: statusInfo.bg, color: statusInfo.text }}
              >
                {statusInfo.label}
              </span>
            </div>
            <span className="sd-date">
              <FiClock /> Created {timeAgo(swap.createdAt)}
            </span>
          </motion.div>

          {/* Main Content */}
          <div className="sd-grid">
            {/* Swap Info Card */}
            <motion.div
              className="sd-main card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Users */}
              <div className="sd-users-row">
                <div className="sd-user">
                  <div className="sd-user-avatar" style={{ background: getAvatarGradient(swap.requester._id) }}>
                    {getInitials(swap.requester.name)}
                  </div>
                  <div>
                    <strong>{swap.requester.name}</strong>
                    <span>Requester</span>
                  </div>
                </div>

                <motion.div
                  className="sd-swap-arrow"
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <HiOutlineSwitchHorizontal />
                </motion.div>

                <div className="sd-user">
                  <div className="sd-user-avatar" style={{ background: getAvatarGradient(swap.receiver._id) }}>
                    {getInitials(swap.receiver.name)}
                  </div>
                  <div>
                    <strong>{swap.receiver.name}</strong>
                    <span>Receiver</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="sd-skills">
                <div className="sd-skill-box sd-skill-coral">
                  <span className="sd-skill-label">Offering</span>
                  <h3>{swap.skillOffered}</h3>
                </div>
                <div className="sd-skill-divider">⇄</div>
                <div className="sd-skill-box sd-skill-teal">
                  <span className="sd-skill-label">Requesting</span>
                  <h3>{swap.skillRequested}</h3>
                </div>
              </div>

              {/* Meta */}
              <div className="sd-meta-grid">
                <div className="sd-meta-item">
                  <FiCalendar />
                  <div>
                    <span className="sd-meta-label">Scheduled</span>
                    <span className="sd-meta-value">{formatDateTime(swap.scheduledDate)}</span>
                  </div>
                </div>
                <div className="sd-meta-item">
                  <FiClock />
                  <div>
                    <span className="sd-meta-label">Last Updated</span>
                    <span className="sd-meta-value">{timeAgo(swap.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {swap.status === 'pending' && isReceiver && (
                <div className="sd-actions">
                  <Button
                    variant="teal"
                    icon={<FiCheckCircle />}
                    onClick={() => handleStatus('accepted')}
                    loading={loading}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline-coral"
                    icon={<FiXCircle />}
                    onClick={() => handleStatus('rejected')}
                    loading={loading}
                  >
                    Decline
                  </Button>
                </div>
              )}

              {swap.status === 'accepted' && (isRequester || isReceiver) && (
                <div className="sd-actions">
                  <Button
                    variant="primary"
                    icon={<FiCheckCircle />}
                    onClick={() => handleStatus('completed')}
                    loading={loading}
                  >
                    Mark as Completed
                  </Button>
                </div>
              )}

              {swap.status === 'completed' && !swap.feedback && (isRequester || isReceiver) && (
                <div className="sd-actions">
                  <Button
                    variant="teal"
                    icon={<FiMessageSquare />}
                    onClick={() => setShowFeedback(true)}
                  >
                    Leave Feedback
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="sd-sidebar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Feedback */}
              {swap.feedback && (
                <div className="card sd-feedback-card">
                  <h3><FiMessageSquare /> Feedback</h3>
                  <StarRating rating={swap.rating} size={18} />
                  <p>{swap.feedback}</p>
                </div>
              )}

              {showFeedback && (
                <motion.div
                  className="card sd-feedback-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <h3>Leave Feedback</h3>
                  <div className="sd-rating-input">
                    <span>Rating:</span>
                    <StarRating rating={feedbackRating} interactive onChange={setFeedbackRating} />
                  </div>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="How was your experience?"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                  <div className="sd-feedback-actions">
                    <Button variant="teal" onClick={handleFeedback} loading={loading}>Submit</Button>
                    <Button variant="ghost" onClick={() => setShowFeedback(false)}>Cancel</Button>
                  </div>
                </motion.div>
              )}

              {/* Status Timeline */}
              <div className="card sd-timeline-card">
                <h3>Status Timeline</h3>
                <div className="sd-timeline">
                  <div className="sd-timeline-item active">
                    <div className="sd-timeline-dot" />
                    <div>
                      <strong>Created</strong>
                      <span>{timeAgo(swap.createdAt)}</span>
                    </div>
                  </div>
                  {swap.status !== 'pending' && (
                    <div className={`sd-timeline-item ${swap.status === 'rejected' ? 'rejected' : 'active'}`}>
                      <div className="sd-timeline-dot" />
                      <div>
                        <strong>{swap.status === 'rejected' ? 'Declined' : 'Accepted'}</strong>
                        <span>{timeAgo(swap.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                  {swap.status === 'completed' && (
                    <div className="sd-timeline-item completed">
                      <div className="sd-timeline-dot" />
                      <div>
                        <strong>Completed</strong>
                        <span>{timeAgo(swap.updatedAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
