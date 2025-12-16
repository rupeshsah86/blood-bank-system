import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from './authService';
import Loader from '../../components/Loader';
import FormField from '../../components/FormField';
import { useFormValidation, validators } from '../../utils/validation';
import { showToast } from '../../components/ToastContainer';
import './Auth.css';

const Login = () => {
  const initialValues = { email: '', password: '' };
  const validationRules = {
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(6)]
  };

  const { values, errors, handleChange, handleBlur, validateAll } = useFormValidation(initialValues, validationRules);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      showToast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await authService.login(values);
      showToast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed';
      showToast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <h1>Welcome Back</h1>
              <p>Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <FormField
                label="Email Address"
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                required
                placeholder="Enter your email"
              />

              <FormField
                label="Password"
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                required
                placeholder="Enter your password"
              />

              <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                {loading ? <Loader /> : 'Sign In'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;