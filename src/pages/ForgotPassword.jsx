import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight, FiArrowLeft, FiEye, FiEyeOff, FiShield, FiCheckCircle } from 'react-icons/fi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export default function ForgotPassword() {
  const { forgotPassword, resetPassword, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setStep(2);
      startCountdown();
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndProceed = async (e) => {
    e.preventDefault();
    if (!otp || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setVerifyLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep(3);
      toast.success('OTP verified successfully!');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error('Please enter a new password');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }
    if (!/(?=.*[0-9])/.test(password)) {
      toast.error('Password must contain at least one number');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword: password });
      toast.success('Password reset successfully! Please login.');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await forgotPassword(email);
      startCountdown();
      toast.success('OTP resent to your email!');
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
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
              <h2>Reset Password</h2>
              <p>Don't worry, it happens to the best of us. We'll help you get back into your account.</p>

              <div className="auth-panel-features">
                <div className={`auth-feature ${step >= 1 ? 'active' : ''}`}>
                  {step > 1 ? '✅' : '1️⃣'} Enter your email
                </div>
                <div className={`auth-feature ${step >= 2 ? 'active' : ''}`}>
                  {step > 2 ? '✅' : '2️⃣'} Verify OTP
                </div>
                <div className={`auth-feature ${step >= 3 ? 'active' : ''}`}>
                  3️⃣ Set new password
                </div>
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
                <h1>Forgot Password</h1>
                <p>
                  {step === 1 && 'Enter your email to receive a verification code'}
                  {step === 2 && 'Enter the OTP sent to your email'}
                  {step === 3 && 'Create a new password for your account'}
                </p>
              </div>

              {step === 1 && (
                <form onSubmit={handleSendOtp} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-with-icon">
                      <FiMail className="input-icon" />
                      <input
                        type="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
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
                    Send OTP
                  </Button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyAndProceed} className="auth-form">
                  <motion.div
                    className="otp-verified-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ background: 'rgba(78, 205, 196, 0.08)', color: 'var(--teal)' }}
                  >
                    <FiMail /> OTP sent to: {email}
                  </motion.div>

                  <div className="form-group">
                    <label className="form-label">Verification Code</label>
                    <div className="input-with-icon">
                      <FiShield className="input-icon" />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                      />
                    </div>
                    <button
                      type="button"
                      className="otp-send-btn"
                      onClick={handleResendOtp}
                      disabled={countdown > 0}
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={verifyLoading}
                    icon={<FiArrowRight />}
                  >
                    Verify & Continue
                  </Button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword} className="auth-form">
                  <motion.div
                    className="otp-verified-badge"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <FiCheckCircle /> Email verified: {email}
                  </motion.div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="input-toggle"
                        onClick={() => setShowPwd(!showPwd)}
                      >
                        {showPwd ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div className="input-with-icon">
                      <FiLock className="input-icon" />
                      <input
                        type={showPwd ? 'text' : 'password'}
                        className="form-input"
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
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
                    Reset Password
                  </Button>
                </form>
              )}

              <p className="auth-switch">
                <Link to="/login" className="auth-switch-link">
                  <FiArrowLeft style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Back to Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
