import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useSwaps } from '../context/SwapContext';
import toast from 'react-hot-toast';
import './CreateSwap.css';

export default function CreateSwap() {
  const { user, MOCK_USERS } = useAuth();
  const { createSwap } = useSwaps();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');

  const availableUsers = MOCK_USERS.filter((u) => u._id !== user?._id);
  const selectedUser = availableUsers.find((u) => u._id === receiverId);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiverId) { toast.error('Please select a user'); return; }
    if (!skillOffered) { toast.error('Please select a skill to offer'); return; }
    if (!skillRequested) { toast.error('Please select a skill you want'); return; }

    setLoading(true);
    try {
      await createSwap({
        receiver: {
          _id: selectedUser._id,
          name: selectedUser.name,
          profilePic: '',
          rating: selectedUser.rating,
        },
        skillOffered,
        skillRequested,
        scheduledDate: scheduledDate || null,
        message,
      });
      navigate('/dashboard');
    } catch {
      toast.error('Failed to create swap');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="create-swap-page">
        <AnimatedBackground variant="minimal" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button className="back-btn" onClick={() => navigate(-1)}>
              <FiArrowLeft /> Back
            </button>

            <div className="create-swap-header">
              <motion.div
                className="create-swap-icon"
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <HiOutlineSwitchHorizontal />
              </motion.div>
              <h1 className="page-title">Create <span className="gradient-text">Swap Request</span></h1>
              <p className="page-subtitle">Propose a skill exchange with another learner</p>
            </div>
          </motion.div>

          <motion.form
            className="create-swap-form card"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Select User */}
            <div className="form-group">
              <label className="form-label"><FiUser /> Swap With</label>
              <select
                className="form-input"
                value={receiverId}
                onChange={(e) => {
                  setReceiverId(e.target.value);
                  setSkillRequested('');
                }}
              >
                <option value="">Select a user...</option>
                {availableUsers.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} — {u.skillsOffered.slice(0, 3).join(', ')}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected User Preview */}
            {selectedUser && (
              <motion.div
                className="selected-user-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="preview-avatar" style={{ background: `linear-gradient(135deg, var(--teal), var(--coral))` }}>
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="preview-info">
                  <strong>{selectedUser.name}</strong>
                  <span>Offers: {selectedUser.skillsOffered.join(', ')}</span>
                  <span>Wants: {selectedUser.skillsWanted.join(', ')}</span>
                </div>
              </motion.div>
            )}

            {/* Skills Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Skill You'll Teach</label>
                <select
                  className="form-input"
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                >
                  <option value="">Select your skill...</option>
                  {(user?.skillsOffered || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="swap-arrow-center">
                <HiOutlineSwitchHorizontal />
              </div>

              <div className="form-group">
                <label className="form-label">Skill You Want</label>
                <select
                  className="form-input"
                  value={skillRequested}
                  onChange={(e) => setSkillRequested(e.target.value)}
                  disabled={!selectedUser}
                >
                  <option value="">Select their skill...</option>
                  {(selectedUser?.skillsOffered || []).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule */}
            <div className="form-group">
              <label className="form-label">Proposed Date (optional)</label>
              <input
                type="datetime-local"
                className="form-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label">Message (optional)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Add a personal note to your swap partner..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={<FiSend />}
            >
              Send Swap Request
            </Button>
          </motion.form>
        </div>
      </section>
    </AnimatedPage>
  );
}
