import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

export default function AnimatedBackground({ variant = 'default' }) {
  const blobs = useMemo(() => {
    const configs = {
      default: [
        { color: 'var(--coral)', size: 520, x: '4%', y: '10%', delay: 0 },
        { color: 'var(--teal)', size: 460, x: '68%', y: '6%', delay: 2 },
        { color: 'var(--amber)', size: 420, x: '76%', y: '56%', delay: 4 },
        { color: 'var(--coral-light)', size: 360, x: '14%', y: '72%', delay: 1 },
        { color: 'var(--emerald)', size: 320, x: '46%', y: '42%', delay: 3 },
      ],
      hero: [
        { color: 'var(--coral)', size: 640, x: '2%', y: '8%', delay: 0 },
        { color: 'var(--teal)', size: 560, x: '60%', y: '0%', delay: 1.5 },
        { color: 'var(--amber)', size: 480, x: '78%', y: '50%', delay: 3 },
        { color: 'var(--emerald)', size: 380, x: '24%', y: '78%', delay: 2 },
        { color: 'var(--coral-light)', size: 440, x: '46%', y: '38%', delay: 4 },
        { color: 'var(--teal-light)', size: 360, x: '8%', y: '58%', delay: 2.6 },
      ],
      minimal: [
        { color: 'var(--teal)', size: 360, x: '76%', y: '16%', delay: 0 },
        { color: 'var(--coral)', size: 320, x: '10%', y: '64%', delay: 2 },
      ],
      swap: [
        { color: 'var(--teal)', size: 520, x: '8%', y: '16%', delay: 0 },
        { color: 'var(--coral)', size: 460, x: '68%', y: '8%', delay: 1.5 },
        { color: 'var(--amber)', size: 420, x: '70%', y: '66%', delay: 3 },
        { color: 'var(--emerald)', size: 360, x: '16%', y: '76%', delay: 2 },
        { color: 'var(--coral-light)', size: 340, x: '40%', y: '44%', delay: 2.6 },
      ],
    };
    return configs[variant] || configs.default;
  }, [variant]);

  const bubbles = useMemo(() => {
    const configs = {
      swap: [
        { size: 200, x: '12%', y: '22%', delay: 0.4 },
        { size: 150, x: '78%', y: '16%', delay: 1.4 },
        { size: 230, x: '72%', y: '72%', delay: 2.8 },
        { size: 170, x: '28%', y: '78%', delay: 3.6 },
      ],
    };
    return configs[variant] || [];
  }, [variant]);

  return (
    <div className={`animated-bg animated-bg--${variant}`}>
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
            x: [0, 40, -30, 0],
            y: [0, -35, 25, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            delay: blob.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {bubbles.map((bubble, i) => (
        <motion.div
          key={`bubble-${i}`}
          className="animated-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.x,
            top: bubble.y,
          }}
          animate={{
            y: [0, -18, 0],
            x: [0, 12, -8, 0],
            opacity: [0.4, 0.75, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="animated-particle"
          style={{
            left: `${10 + i * 8.5}%`,
            animationDelay: `${i * 1.2}s`,
          }}
        />
      ))}
    </div>
  );
}
