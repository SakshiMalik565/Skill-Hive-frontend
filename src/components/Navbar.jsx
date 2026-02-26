import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMenu, HiOutlineX, HiOutlineLogout } from 'react-icons/hi';
import { FiZap } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = isAuthenticated
    ? [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/projects', label: 'Projects' },
        { path: '/feed', label: 'Feed' },
        { path: '/create-swap', label: 'New Swap' },
        { path: '/profile', label: 'Profile' },
      ]
    : [
        { path: '/', label: 'Home' },
        { path: '/login', label: 'Login' },
        { path: '/register', label: 'Sign Up' },
      ];

  return (
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
          {navLinks.map((link) => (
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
