import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUser, FiVideo, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { useSwaps } from '../context/SwapContext';
import { useAuth } from '../context/AuthContext';
import './Schedule.css';

const formatDate = (value) => {
    if (!value) return 'Not set';
    const d = new Date(value);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const isUpcoming = (date) => date && new Date(date) >= new Date();
const isPast = (date) => date && new Date(date) < new Date();

export default function Schedule() {
    const { user } = useAuth();
    const { swaps, fetchSwaps, isLoading, updateSwapStatus } = useSwaps();
    const [tab, setTab] = useState('upcoming');

    useEffect(() => {
        fetchSwaps();
    }, [fetchSwaps]);

    const scheduledSwaps = useMemo(() => {
        return swaps.filter((s) =>
            s.scheduledDate && ['accepted', 'pending'].includes(s.status)
        );
    }, [swaps]);

    const upcomingSwaps = useMemo(() =>
        scheduledSwaps.filter((s) => isUpcoming(s.scheduledDate)).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)),
        [scheduledSwaps]
    );

    const pastSwaps = useMemo(() =>
        swaps.filter((s) => s.scheduledDate && isPast(s.scheduledDate) && s.status === 'completed')
            .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)),
        [swaps]
    );

    const allScheduled = tab === 'upcoming' ? upcomingSwaps : pastSwaps;

    const getOtherUser = (swap) => {
        if (swap.requester?._id === user?._id) return swap.receiver;
        return swap.requester;
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen text="Loading schedule..." />;
    }

    return (
        <AnimatedPage>
            <section className="schedule-page">
                <div className="container">
                    <motion.div
                        className="schedule-header"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <h1>Schedule</h1>
                            <p>Your upcoming swap sessions & classes</p>
                        </div>
                        <Link to="/create-swap">
                            <Button variant="teal" icon={<FiCalendar />}>
                                New Swap
                            </Button>
                        </Link>
                    </motion.div>

                    <div className="schedule-tabs">
                        <button
                            className={`schedule-tab ${tab === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setTab('upcoming')}
                        >
                            <FiClock /> Upcoming ({upcomingSwaps.length})
                        </button>
                        <button
                            className={`schedule-tab ${tab === 'past' ? 'active' : ''}`}
                            onClick={() => setTab('past')}
                        >
                            <FiCheckCircle /> Completed ({pastSwaps.length})
                        </button>
                    </div>

                    {allScheduled.length === 0 ? (
                        <div className="schedule-empty">
                            <FiCalendar />
                            <h3>{tab === 'upcoming' ? 'No upcoming sessions' : 'No completed sessions'}</h3>
                            <p>Schedule a swap with someone to see it here.</p>
                        </div>
                    ) : (
                        <div className="schedule-list">
                            {allScheduled.map((swap, index) => {
                                const other = getOtherUser(swap);
                                const isRequester = swap.requester?._id === user?._id;
                                return (
                                    <motion.div
                                        key={swap._id}
                                        className="schedule-card"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="schedule-card-date">
                                            <span className="schedule-day">{formatDate(swap.scheduledDate)}</span>
                                            <span className="schedule-time"><FiClock /> {formatTime(swap.scheduledDate)}</span>
                                        </div>
                                        <div className="schedule-card-body">
                                            <div className="schedule-skills">
                                                <div className="schedule-skill-chip offer">
                                                    {isRequester ? swap.skillOffered : swap.skillRequested}
                                                    <span>You teach</span>
                                                </div>
                                                <span className="schedule-arrow">⇄</span>
                                                <div className="schedule-skill-chip request">
                                                    {isRequester ? swap.skillRequested : swap.skillOffered}
                                                    <span>You learn</span>
                                                </div>
                                            </div>
                                            <div className="schedule-partner">
                                                <div className="schedule-partner-avatar">
                                                    {other?.profilePic ? (
                                                        <img src={other.profilePic} alt={other.name || 'User'} />
                                                    ) : (
                                                        <FiUser />
                                                    )}
                                                </div>
                                                <Link to={`/profile/${other?._id}`} className="schedule-partner-name">
                                                    {other?.name || other?.email || 'Unknown'}
                                                </Link>
                                                <span className={`schedule-status ${swap.status}`}>{swap.status}</span>
                                            </div>
                                        </div>
                                        <div className="schedule-card-actions">
                                            <Link to={`/swaps/${swap._id}`}>
                                                <Button variant="secondary" size="sm">Details</Button>
                                            </Link>
                                            {swap.status === 'accepted' && tab === 'upcoming' && (
                                                <Button
                                                    variant="teal"
                                                    size="sm"
                                                    icon={<FiCheckCircle />}
                                                    onClick={() => updateSwapStatus(swap._id, 'completed')}
                                                >
                                                    Complete
                                                </Button>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </AnimatedPage>
    );
}
