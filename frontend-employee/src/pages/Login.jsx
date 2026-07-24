import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, signInWithGooglePlatform } from '../config/firebase';
import './Auth.css';

const HERO_SLIDES = [
  {
    image: '/images/hero_dunes.png',
    title: 'Capturing Moments, Creating Memories',
    subtitle: 'Streamline your daily workflow with intelligent workspace tools.'
  },
  {
    image: '/images/hero_abstract.png',
    title: 'Empowering Teams, Redefining Productivity',
    subtitle: 'Seamless collaboration and real-time project analytics.'
  },
  {
    image: '/images/hero_minimal.png',
    title: 'Elevate Your Paradigm Shift Experience',
    subtitle: 'Enterprise security, high performance, and total control.'
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  // Hero Card Carousel Auto-Slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await loginWithEmail(email, password);

    if (result.success) {
      setUser(result.user, result.token);
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    const result = await signInWithGooglePlatform();

    if (result.success) {
      if (result.user) {
        setUser(result.user, result.token);
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        
        {/* Left Side: Aesthetic Hero Image Slider Card */}
        <div className="auth-hero-card">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className="hero-slide-bg"
              style={{
                backgroundImage: `url(${slide.image})`,
                opacity: currentSlide === idx ? 1 : 0,
                transform: currentSlide === idx ? 'scale(1.02)' : 'scale(1.0)'
              }}
            />
          ))}
          <div className="hero-overlay" />

          <div className="hero-content">
            <h2 className="hero-title">{HERO_SLIDES[currentSlide].title}</h2>
            <p className="hero-subtitle">{HERO_SLIDES[currentSlide].subtitle}</p>

            <div className="hero-pagination">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`pagination-dot ${currentSlide === idx ? 'active' : 'inactive'}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Sleek Login Form */}
        <div className="auth-form-wrapper">
          <div className="auth-card">
            
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>
                Don't have an account?
                <span className="auth-switch-link" onClick={() => navigate('/register')}>
                  Create an account
                </span>
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              
              <div className="input-field-group">
                <input
                  type="email"
                  className="input-style"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-field-group">
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-style"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-options-row">
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <span
                  className="forgot-password-link"
                  onClick={() => setError('Password reset instructions sent if email exists.')}
                >
                  Forgot password?
                </span>
              </div>

              {error && <div className="auth-error-alert">{error}</div>}

              <button type="submit" className="btn-primary-purple" disabled={isLoading}>
                {isLoading ? <div className="btn-spinner" /> : 'Sign in'}
              </button>

            </form>

            <div className="social-divider">
              <span>Or sign in with</span>
            </div>

            <div className="social-buttons-grid">
              <button
                type="button"
                className="social-btn-dark"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>

              <button
                type="button"
                className="social-btn-dark"
                onClick={() => setError('Apple authentication is coming soon. Please use Google or Email/Password.')}
                disabled={isLoading}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.13c.67-.82 1.13-1.96.99-3.13-1 .04-2.2.67-2.9 1.49-.62.72-1.16 1.88-1.01 3.01 1.12.09 2.25-.55 2.92-1.37z" />
                </svg>
                Apple
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;