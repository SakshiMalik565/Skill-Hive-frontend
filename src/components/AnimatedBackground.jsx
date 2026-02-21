import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'default' }) {
  const blobs = useMemo(() => {
    const configs = {
      default: [
        { color: 'var(--coral)', size: 300, x: '10%', y: '20%', delay: 0 },
        { color: 'var(--teal)', size: 250, x: '70%', y: '10%', delay: 2 },
        { color: 'var(--amber)', size: 200, x: '80%', y: '60%', delay: 4 },
        { color: 'var(--coral-light)', size: 180, x: '20%', y: '70%', delay: 1 },
      ],
      hero: [
        { color: 'var(--coral)', size: 400, x: '5%', y: '15%', delay: 0 },
        { color: 'var(--teal)', size: 350, x: '65%', y: '5%', delay: 1.5 },
        { color: 'var(--amber)', size: 300, x: '75%', y: '55%', delay: 3 },
        { color: 'var(--emerald)', size: 200, x: '30%', y: '75%', delay: 2 },
        { color: 'var(--coral-light)', size: 250, x: '50%', y: '45%', delay: 4 },
      ],
      minimal: [
        { color: 'var(--teal)', size: 250, x: '80%', y: '20%', delay: 0 },
        { color: 'var(--coral)', size: 200, x: '10%', y: '60%', delay: 2 },
      ],
    };
    return configs[variant] || configs.default;
  }, [variant]);

  return (
    <div className="animated-bg">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="animated-blob"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color}22 0%, transparent 70%)`,
            left: blob.x,
            top: blob.y,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: blob.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="animated-particle"
          style={{
            left: `${15 + i * 14}%`,
            animationDelay: `${i * 1.5}s`,
          }}
        />
      ))}
    </div>
  );
}
