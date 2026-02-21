import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FiArrowRight, FiUsers, FiRefreshCw, FiShield, FiStar, FiZap, FiHeart, FiTarget } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import './Landing.css';

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const features = [
  {
    icon: <FiUsers />,
    title: 'Find Skill Partners',
    desc: 'Discover people who want to learn what you know, and teach what you want to learn.',
    color: 'var(--coral)',
    bg: 'rgba(255,107,107,0.08)',
  },
  {
    icon: <FiRefreshCw />,
    title: 'Exchange Skills',
    desc: 'No money needed. Trade your expertise one-on-one with fellow learners.',
    color: 'var(--teal)',
    bg: 'rgba(78,205,196,0.08)',
  },
  {
    icon: <FiShield />,
    title: 'Trust & Ratings',
    desc: 'Rate your swap partners and build your reputation in the community.',
    color: 'var(--amber-dark)',
    bg: 'rgba(255,230,109,0.15)',
  },
  {
    icon: <FiZap />,
    title: 'Fast Matching',
    desc: 'Our smart matching suggests the best skill swap partners for you.',
    color: 'var(--emerald)',
    bg: 'rgba(46,204,113,0.08)',
  },
];

const steps = [
  { num: '01', title: 'Create Profile', desc: 'Add your skills offered and skills wanted to your profile.', icon: <FiTarget /> },
  { num: '02', title: 'Find Partners', desc: 'Browse users and find someone with matching skill interests.', icon: <FiUsers /> },
  { num: '03', title: 'Send Swap Request', desc: 'Propose a skill swap and schedule a session together.', icon: <HiOutlineSwitchHorizontal /> },
  { num: '04', title: 'Learn & Grow', desc: 'Exchange knowledge, rate your partner, and build your network.', icon: <FiStar /> },
];

const stats = [
  { value: '2,500+', label: 'Active Users' },
  { value: '8,000+', label: 'Skills Swapped' },
  { value: '4.8', label: 'Avg Rating' },
  { value: '150+', label: 'Skills Available' },
];

function AnimatedCounter({ value }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {value}
    </motion.span>
  );
}

function SectionTitle({ badge, title, subtitle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="section-header"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {badge && <span className="section-badge">{badge}</span>}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <AnimatedPage>
      {/* ===== HERO ===== */}
      <section className="hero-section" ref={heroRef}>
        <AnimatedBackground variant="hero" />
        <motion.div
          className="hero-content container"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            className="hero-text"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeUp} className="hero-badge">
              <FiZap className="hero-badge-icon" />
              <span>The Future of Peer Learning</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="hero-title">
              Exchange <span className="gradient-text">Skills</span>,{' '}
              <br />Not <span className="gradient-text-warm">Money</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-desc">
              Connect with talented people worldwide. Teach what you know,
              learn what you love — completely free.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-actions">
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<FiArrowRight />}>
                  Start Swapping
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="hero-trusted">
              <div className="hero-avatars">
                {['A', 'M', 'J', 'S', 'E'].map((letter, i) => (
                  <motion.div
                    key={letter}
                    className="hero-mini-avatar"
                    style={{ zIndex: 5 - i, marginLeft: i > 0 ? -10 : 0 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {letter}
                  </motion.div>
                ))}
              </div>
              <span>Trusted by <strong>2,500+</strong> learners</span>
            </motion.div>
          </motion.div>

          {/* Hero Illustration */}
          <motion.div
            className="hero-illustration"
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="hero-card-stack">
              <motion.div
                className="hero-float-card hero-float-card-1"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="hero-fc-icon" style={{ background: 'rgba(255,107,107,0.12)' }}>⚛️</div>
                <div>
                  <strong>React</strong>
                  <span>Web Development</span>
                </div>
              </motion.div>

              <motion.div
                className="hero-float-card hero-float-card-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, delay: 0.5 }}
              >
                <div className="hero-fc-icon" style={{ background: 'rgba(78,205,196,0.12)' }}>🎨</div>
                <div>
                  <strong>UI/UX Design</strong>
                  <span>Figma Expert</span>
                </div>
              </motion.div>

              <motion.div
                className="hero-float-card hero-float-card-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.8, delay: 1 }}
              >
                <div className="hero-fc-icon" style={{ background: 'rgba(255,230,109,0.2)' }}>🐍</div>
                <div>
                  <strong>Python</strong>
                  <span>Machine Learning</span>
                </div>
              </motion.div>

              {/* Arrow animation between cards */}
              <motion.div
                className="hero-swap-arrows"
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              >
                <HiOutlineSwitchHorizontal />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="scroll-mouse">
            <div className="scroll-dot" />
          </div>
        </motion.div>
      </section>

      {/* ===== STATS ===== */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="stat-value">
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <SectionTitle
            badge="✨ Features"
            title="Everything you need to swap skills"
            subtitle="A complete platform for skill exchange, designed for learners and teachers alike."
          />

          <motion.div
            className="features-grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                variants={fadeUp}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
              >
                <div className="feature-icon-wrap" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                {/* Shimmer line */}
                <div className="feature-shimmer" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="steps-section">
        <AnimatedBackground variant="minimal" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <SectionTitle
            badge="🚀 How It Works"
            title="Start swapping in 4 easy steps"
            subtitle="It's simple, fast, and completely free."
          />

          <div className="steps-grid">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                className="step-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="step-num">{step.num}</div>
                <div className="step-icon">{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                {i < steps.length - 1 && <div className="step-connector" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <AnimatedBackground variant="minimal" />
            <div className="cta-content">
              <motion.div
                className="cta-icon"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <FiHeart />
              </motion.div>
              <h2>Ready to start learning?</h2>
              <p>Join thousands of learners already exchanging skills on SkillSwap.</p>
              <Link to="/register">
                <Button variant="primary" size="lg" icon={<FiArrowRight />}>
                  Create Free Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
