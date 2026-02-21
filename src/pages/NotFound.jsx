import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { FiHome } from 'react-icons/fi';
import './NotFound.css';

export default function NotFound() {
  return (
    <AnimatedPage>
      <section className="notfound-page">
        <AnimatedBackground variant="minimal" />
        <div className="notfound-content">
          <motion.div
            className="notfound-number"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
          >
            <span className="gradient-text">4</span>
            <motion.span
              className="notfound-zero"
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            >
              0
            </motion.span>
            <span className="gradient-text">4</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Page Not Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/">
              <Button variant="primary" size="lg" icon={<FiHome />}>
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
