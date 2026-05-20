import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout } from 'react-icons/hi';
import { FiMoon, FiSun, FiZap } from 'react-icons/fi';
import chatService from '../services/chatService';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const chatCtx = useChat();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [totalUnread, setTotalUnread] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await chatService.getConversations();
      const convos = res.data.data.conversations || [];
      const count = convos.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      setTotalUnread(count);
    } catch { /* ignore */ }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread, location]);

  useEffect(() => {
    const socket = chatCtx?.socket;
    if (!socket) return;
    const onNew = () => fetchUnread();
    const onRead = () => fetchUnread();
    socket.on('message:new', onNew);
    socket.on('message:read', onRead);
    return () => {
      socket.off('message:new', onNew);
      socket.off('message:read', onRead);
    };
  }, [chatCtx?.socket, fetchUnread]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('skillswap_theme');
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('skillswap_theme', nextTheme);
  };

  const navLinks = isAuthenticated
    ? [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/schedule', label: 'Schedule' },
      { path: '/feed', label: 'Feed' },
      { path: '/create-swap', label: 'Swaps' },
      { path: '/inbox', label: 'Inbox' },
      { path: '/profile', label: 'Profile' },
    ]
    : [
      { path: '/', label: 'Home' },
      { path: '/login', label: 'Login' },
      { path: '/register', label: 'Sign Up' },
    ];

  return (
    <>
      <motion.nav
        className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="navbar-container container">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="navbar-logo">
            <motion.div
              className="navbar-logo-icon"
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <FiZap />
            </motion.div>
            <span className="navbar-logo-text">
              Skill<span className="navbar-logo-accent">Swap</span>
            </span>
          </Link>

          <div className="navbar-links-desktop">
            {!isAuthenticated &&
              navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `navbar-link ${isActive ? 'navbar-link-active' : ''}`
                  }
                >
                  <motion.span whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    {link.label}
                  </motion.span>
                </NavLink>
              ))}
            <button
              type="button"
              className="navbar-theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>
            {isAuthenticated && (
              <motion.button
                className="navbar-logout-btn"
                onClick={logout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiOutlineLogout />
                <span>Logout</span>
              </motion.button>
            )}
          </div>

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="navbar-mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              {isAuthenticated && (
                <motion.button
                  className="navbar-mobile-logout"
                  onClick={logout}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <HiOutlineLogout /> Logout
                </motion.button>
              )}
              <button
                type="button"
                className="navbar-theme-toggle navbar-theme-toggle-mobile"
                onClick={toggleTheme}
              >
                {theme === 'light' ? <FiMoon /> : <FiSun />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {isAuthenticated && (
        <aside className="sidebar">
          <div className="sidebar-header" />
          <nav className="sidebar-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                }
              >
                {link.label}
                {link.path === '/inbox' && totalUnread > 0 && (
                  <span className="sidebar-unread-badge">{totalUnread}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
      )}
    </>
  );
}
