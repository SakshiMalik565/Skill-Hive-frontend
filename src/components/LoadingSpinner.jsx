import { motion } from 'framer-motion';
import './LoadingSpinner.css';

export default function LoadingSpinner({ fullScreen = false, text = 'Loading...' }) {
  return (
    <div className={`spinner-wrapper ${fullScreen ? 'spinner-fullscreen' : ''}`}>
      <div className="spinner-content">
        <motion.div
          className="spinner-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        >
          <div className="spinner-gradient" />
        </motion.div>
        <motion.div
          className="spinner-inner-ring"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        >
          <div className="spinner-gradient-2" />
        </motion.div>
        <motion.span
          className="spinner-text"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.span>
      </div>
    </div>
  );
}
