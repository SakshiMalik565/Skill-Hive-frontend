import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlusCircle, FiInbox, FiSend, FiCheckCircle, FiGrid, FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import SwapCard from '../components/SwapCard';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useSwaps } from '../context/SwapContext';
import './Dashboard.css';

const tabs = [
  { key: 'all', label: 'All Swaps', icon: <FiGrid /> },
  { key: 'incoming', label: 'Incoming', icon: <FiInbox /> },
  { key: 'outgoing', label: 'Outgoing', icon: <FiSend /> },
  { key: 'completed', label: 'Completed', icon: <FiCheckCircle /> },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { swaps, isLoading, fetchSwaps, getUserSwaps } = useSwaps();
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  const userSwaps = getUserSwaps(user?._id);
  const filteredSwaps = userSwaps[activeTab] || [];

  const statCards = [
    { label: 'Total Swaps', value: userSwaps.all.length, icon: <FiRefreshCw />, color: 'var(--teal)' },
    { label: 'Incoming', value: userSwaps.incoming.length, icon: <FiInbox />, color: 'var(--coral)' },
    { label: 'Outgoing', value: userSwaps.outgoing.length, icon: <FiSend />, color: 'var(--amber-dark)' },
    { label: 'Completed', value: userSwaps.completed.length, icon: <FiCheckCircle />, color: 'var(--emerald)' },
  ];

  return (
    <AnimatedPage>
      <section className="dashboard-page">
        <div className="container">
          {/* Header */}
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="page-title">
                Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
              </h1>
              <p className="page-subtitle">Here's an overview of your skill swaps</p>
            </div>
            <div className="dashboard-actions">
              <Link to="/inbox">
                <Button variant="teal" icon={<FiInbox />}>
                  Inbox
                </Button>
              </Link>
              <Link to="/create-swap">
                <Button variant="primary" icon={<FiPlusCircle />}>
                  New Swap
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stat Cards */}
          <div className="dashboard-stats">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="dashboard-stat-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
              >
                <div className="stat-card-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                  {stat.icon}
                </div>
                <div className="stat-card-info">
                  <span className="stat-card-value">{stat.value}</span>
                  <span className="stat-card-label">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`dashboard-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.key && (
                  <motion.div className="tab-indicator" layoutId="tabIndicator" />
                )}
              </button>
            ))}
          </div>

          {/* Swap List */}
          <div className="dashboard-swaps">
            {isLoading ? (
              <LoadingSpinner text="Loading your swaps..." />
            ) : filteredSwaps.length === 0 ? (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="empty-state-icon">
                  {activeTab === 'incoming' ? '📥' : activeTab === 'outgoing' ? '📤' : activeTab === 'completed' ? '🏆' : '🔄'}
                </div>
                <h3 className="empty-state-title">No {activeTab} swaps yet</h3>
                <p className="empty-state-text">
                  {activeTab === 'all'
                    ? 'Start by creating your first swap request!'
                    : `You don't have any ${activeTab} swaps at the moment.`}
                </p>
                <Link to="/create-swap">
                  <Button variant="teal" icon={<FiPlusCircle />}>
                    Create Swap
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  className="swaps-grid"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {filteredSwaps.map((swap, i) => (
                    <SwapCard key={swap._id} swap={swap} index={i} currentUserId={user?._id} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
