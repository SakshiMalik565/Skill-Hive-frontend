import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegister } from '../utils/validators';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    validateRegister
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await register(data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="auth-page">
        <AnimatedBackground variant="minimal" />

        <div className="auth-container">
          {/* Left panel */}
          <motion.div
            className="auth-panel-left auth-panel-left-register"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-panel-content">
              <motion.div
                className="auth-panel-icon"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <HiOutlineSwitchHorizontal />
              </motion.div>
              <h2>Join SkillSwap</h2>
              <p>Create your account and start exchanging skills with learners worldwide.</p>

              <div className="auth-panel-features">
                <div className="auth-feature">🎯 Share skills you love</div>
                <div className="auth-feature">📚 Learn from real people</div>
                <div className="auth-feature">🤝 Build learning connections</div>
                <div className="auth-feature">💯 Completely free forever</div>
              </div>
            </div>
          </motion.div>

          {/* Right panel - Form */}
          <motion.div
            className="auth-panel-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="auth-form-container">
              <div className="auth-form-header">
                <h1>Create Account</h1>
                <p>Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-with-icon">
                    <FiUser className="input-icon" />
                    <input
                      type="text"
                      name="name"
                      className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                      placeholder="John Doe"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {errors.name}
                    </motion.p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        name="password"
                        className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                        placeholder="Min 6 characters"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <button type="button" className="input-toggle" onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        name="confirmPassword"
                        className={`form-input ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}
                        placeholder="Re-enter password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<FiArrowRight />}
                >
                  Create Account
                </Button>
              </form>

              <p className="auth-switch">
                Already have an account?{' '}
                <Link to="/login" className="auth-switch-link">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
