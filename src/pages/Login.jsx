import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateLogin } from '../utils/validators';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { email: '', password: '' },
    validateLogin
  );

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
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
            className="auth-panel-left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="auth-panel-content">
              <motion.div
                className="auth-panel-icon"
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              >
                <HiOutlineSwitchHorizontal />
              </motion.div>
              <h2>Welcome Back!</h2>
              <p>Sign in to continue swapping skills and growing your network.</p>

              <div className="auth-panel-features">
                <div className="auth-feature">✨ 2,500+ active learners</div>
                <div className="auth-feature">🔄 8,000+ skills exchanged</div>
                <div className="auth-feature">⭐ 4.8 average rating</div>
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
                <h1>Sign In</h1>
                <p>Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                    <motion.p
                      className="form-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      name="password"
                      className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                      placeholder="Your password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <button
                      type="button"
                      className="input-toggle"
                      onClick={() => setShowPwd(!showPwd)}
                    >
                      {showPwd ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <motion.p
                      className="form-error"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {errors.password}
                    </motion.p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<FiArrowRight />}
                >
                  Sign In
                </Button>
              </form>

              <p className="auth-forgot">
                <Link to="/forgot-password" className="auth-switch-link">
                  Forgot Password?
                </Link>
              </p>

              <p className="auth-switch">
                Don't have an account?{' '}
                <Link to="/register" className="auth-switch-link">
                  Create Account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
