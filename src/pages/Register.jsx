import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiShield, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { validateRegister, validatePassword } from '../utils/validators';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Register() {
  const { register, sendOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Step 1 form: name, email, otp
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useForm(
    { name: '', email: '', otp: '' },
    validateRegister
  );

  // Step 2 form: password, confirmPassword
  const {
    values: pwdValues,
    errors: pwdErrors,
    touched: pwdTouched,
    handleChange: pwdHandleChange,
    handleBlur: pwdHandleBlur,
    handleSubmit: pwdHandleSubmit,
  } = useForm(
    { password: '', confirmPassword: '' },
    validatePassword
  );

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!values.email) {
      toast.error('Please enter your email first');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setOtpLoading(true);
    try {
      await sendOtp(values.email);
      setOtpSent(true);
      startCountdown();
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!values.otp || !/^\d{6}$/.test(values.otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyLoading(true);
    try {
      await verifyOtp(values.email, values.otp);
      setOtpVerified(true);
      toast.success('Email verified successfully!');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setVerifyLoading(false);
    }
  };

  const onSubmit = async (pwdData) => {
    if (!otpVerified) {
      toast.error('Please verify your email first');
      return;
    }
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: pwdData.password,
        otp: values.otp,
      });
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
                <p>{otpVerified ? 'Set your password to complete registration' : 'Fill in your details to get started'}</p>
              </div>

              {!otpVerified ? (
                /* Step 1: Name, Email, OTP */
                <div className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="input-with-icon">
                      <FiUser className="input-icon" />
                      <input
                        type="text"
                        name="name"
                        className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                        placeholder="Enter your full name"
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
                        disabled={otpSent}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                        {errors.email}
                      </motion.p>
                    )}
                    <button
                      type="button"
                      className="otp-send-btn"
                      onClick={handleSendOtp}
                      disabled={otpLoading || countdown > 0}
                    >
                      {otpLoading ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>

                  {otpSent && (
                    <motion.div
                      className="form-group"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="form-label">Verification Code</label>
                      <div className="input-with-icon">
                        <FiShield className="input-icon" />
                        <input
                          type="text"
                          name="otp"
                          className={`form-input ${errors.otp && touched.otp ? 'error' : ''}`}
                          placeholder="Enter 6-digit OTP"
                          value={values.otp}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          maxLength={6}
                        />
                      </div>
                      {errors.otp && touched.otp && (
                        <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                          {errors.otp}
                        </motion.p>
                      )}
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        fullWidth
                        loading={verifyLoading}
                        icon={<FiCheckCircle />}
                        onClick={handleVerifyOtp}
                        style={{ marginTop: '12px' }}
                      >
                        Verify OTP
                      </Button>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* Step 2: Password (shown only after OTP is verified) */
                <form onSubmit={pwdHandleSubmit(onSubmit)} className="auth-form">
                  <motion.div
                    className="otp-verified-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FiCheckCircle /> Email verified: {values.email}
                  </motion.div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <div className="input-with-icon">
                        <FiLock className="input-icon" />
                        <input
                          type={showPwd ? 'text' : 'password'}
                          name="password"
                          className={`form-input ${pwdErrors.password && pwdTouched.password ? 'error' : ''}`}
                          placeholder="Min 6 characters"
                          value={pwdValues.password}
                          onChange={pwdHandleChange}
                          onBlur={pwdHandleBlur}
                        />
                        <button type="button" className="input-toggle" onClick={() => setShowPwd(!showPwd)}>
                          {showPwd ? <FiEyeOff /> : <FiEye />}
                        </button>
                      </div>
                      {pwdErrors.password && pwdTouched.password && (
                        <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                          {pwdErrors.password}
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
                          className={`form-input ${pwdErrors.confirmPassword && pwdTouched.confirmPassword ? 'error' : ''}`}
                          placeholder="Re-enter password"
                          value={pwdValues.confirmPassword}
                          onChange={pwdHandleChange}
                          onBlur={pwdHandleBlur}
                        />
                      </div>
                      {pwdErrors.confirmPassword && pwdTouched.confirmPassword && (
                        <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                          {pwdErrors.confirmPassword}
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
              )}

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
