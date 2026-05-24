import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(ThemeContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    const loggedInUser = { email };
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    navigate('/');
  };

  return (
    <section className="login-page">
      <div className="login-container">
        <div className="login-box">
          <div className="login-logo">
            <h1>NOVA <span>GAMES</span></h1>
            <p>Gaming Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Gmail or Email</label>
              <input
                id="email"
                type="email"
                placeholder="your.email@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="button primary login-btn">
              Sign In
            </button>
          </form>

          <p className="login-footer">
            Demo: Use any email and password to explore
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
