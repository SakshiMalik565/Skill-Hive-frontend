import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSend, FiUser, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useSwaps } from '../context/SwapContext';
import userService from '../services/userService';
import toast from 'react-hot-toast';
import './CreateSwap.css';

export default function CreateSwap() {
  const { user } = useAuth();
  const { createSwap } = useSwaps();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [skillQuery, setSkillQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPrefillLoading, setIsPrefillLoading] = useState(false);
  const [skillOffered, setSkillOffered] = useState('');
  const [skillRequested, setSkillRequested] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    const receiverFromQuery = searchParams.get('receiverId');
    if (!receiverFromQuery) return;

    const loadReceiver = async () => {
      try {
        setIsPrefillLoading(true);
        const res = await userService.getById(receiverFromQuery);
        const loadedUser = res.data.data.user;
        if (loadedUser?._id === user?._id) {
          toast.error('You cannot create a swap with yourself');
          return;
        }
        setSelectedUser(loadedUser);
        setReceiverId(loadedUser._id);
        setSearchResults([]);
      } catch {
        toast.error('Unable to load selected user');
      } finally {
        setIsPrefillLoading(false);
      }
    };

    loadReceiver();
  }, [searchParams, user?._id]);

  const handleSearch = async () => {
    const searchValue = userQuery.trim();
    const skillValue = skillQuery.trim();

    if (!searchValue && !skillValue) {
      toast.error('Enter a name, email, or skill to search');
      return;
    }

    try {
      setIsSearching(true);
      const res = await userService.getAll({
        search: searchValue || undefined,
        skill: skillValue || undefined,
        limit: 20,
      });
      const users = (res.data.data.users || []).filter((u) => u._id !== user?._id);
      setSearchResults(users);
      if (!users.length) {
        toast.error('No users found');
      }
    } catch {
      toast.error('Unable to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (selected) => {
    setSelectedUser(selected);
    setReceiverId(selected._id);
    setSkillRequested('');
  };

  const clearSelectedUser = () => {
    setSelectedUser(null);
    setReceiverId('');
    setSkillRequested('');
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!receiverId || !selectedUser) { toast.error('Please select a user'); return; }
    if (!skillOffered) { toast.error('Please select a skill to offer'); return; }
    if (!skillRequested) { toast.error('Please select a skill you want'); return; }

    setLoading(true);
    try {
      await createSwap({
        receiverId: selectedUser._id,
        skillOffered,
        skillRequested,
        scheduledDate: scheduledDate || null,
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
              <div className="user-search-fields">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by name or email"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search by skill (e.g. React)"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSearch}
                  disabled={isSearching || isPrefillLoading}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>
              <p className="form-hint">Search by name, email, or skills offered.</p>
            </div>

            {/* Selected User Preview */}
            {selectedUser && (
              <motion.div
                className="selected-user-preview"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                <div className="preview-avatar" style={{ background: `linear-gradient(135deg, var(--teal), var(--coral))` }}>
                  {(selectedUser.name || selectedUser.email || 'U').slice(0, 2).toUpperCase()}
                </div>
                <div className="preview-info">
                  <strong>{selectedUser.name || selectedUser.email}</strong>
                  <span>Offers: {(selectedUser.skillsOffered || []).join(', ')}</span>
                  <span>Wants: {(selectedUser.skillsWanted || []).join(', ')}</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={clearSelectedUser}
                >
                  Change user
                </Button>
              </motion.div>
            )}

            {!selectedUser && (
              <div className="user-results">
                {isPrefillLoading ? (
                  <span className="user-results-state">Loading selected user...</span>
                ) : null}
                {!isPrefillLoading && isSearching ? (
                  <span className="user-results-state">Searching users...</span>
                ) : null}
                {!isPrefillLoading && !isSearching && searchResults.length === 0 && (userQuery || skillQuery) ? (
                  <span className="user-results-state">No users match your search.</span>
                ) : null}
                {!isPrefillLoading && !isSearching && searchResults.length > 0 ? (
                  <div className="user-results-grid">
                    {searchResults.map((result) => (
                      <button
                        key={result._id}
                        type="button"
                        className="user-result-card"
                        onClick={() => handleSelectUser(result)}
                      >
                        <div className="user-result-avatar">
                          {result.profilePhoto || result.profilePic ? (
                            <img
                              src={result.profilePhoto || result.profilePic}
                              alt={result.name || 'User'}
                            />
                          ) : (
                            <span>{(result.name || result.email || 'U').slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="user-result-info">
                          <strong>{result.name || result.email}</strong>
                          <span>{(result.skillsOffered || []).slice(0, 3).join(', ') || 'No skills listed'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
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
