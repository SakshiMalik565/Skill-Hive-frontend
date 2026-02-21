import { Link } from 'react-router-dom';
import { FiZap, FiGithub, FiHeart } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,100 L0,100 Z"
            fill="var(--bg-dark)"
          />
        </svg>
      </div>
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <FiZap />
                </div>
                <span>
                  Skill<span className="footer-accent">Swap</span>
                </span>
              </div>
              <p className="footer-tagline">
                Exchange skills, not money. Learn from peers, teach what you love.
              </p>
            </div>

            <div className="footer-links-group">
              <h4>Platform</h4>
              <Link to="/">Home</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/create-swap">New Swap</Link>
            </div>

            <div className="footer-links-group">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/profile">Profile</Link>
            </div>

            <div className="footer-links-group">
              <h4>Connect</h4>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <FiGithub style={{ marginRight: 6 }} /> GitHub
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} SkillSwap. Made with{' '}
              <FiHeart className="footer-heart" /> for learners everywhere.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
