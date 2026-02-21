import { motion } from 'framer-motion';
import { useRipple } from '../hooks/useRipple';
import './Button.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) {
  const createRipple = useRipple();

  const handleClick = (e) => {
    if (disabled || loading) return;
    createRipple(e);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`btn btn-${variant} btn-${size} ripple-container ${fullWidth ? 'btn-full' : ''} ${className}`}
      onClick={handleClick}
      type={type}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="btn-loader">
          <span className="btn-loader-dot" />
          <span className="btn-loader-dot" />
          <span className="btn-loader-dot" />
        </span>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
