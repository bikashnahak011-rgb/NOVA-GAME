import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

const routes = [
  { label: 'Home', path: '/' },
  { label: 'All Games', path: '/games' },
  { label: 'Categories', path: '/categories' },
  { label: 'About', path: '/about' }
];

function NavBar() {
  const { isDark, toggleTheme, user, setUser } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const initial = user?.email?.[0]?.toUpperCase();

  // PWA install prompt
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    if (!searchOpen) return;
    const handler = (e) => {
      if (!e.target.closest('.navbar-search-wrapper')) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [searchOpen]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/games?q=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  return (
    <header className="app-header">
      {/* Brand */}
      <div className="brand-block">
        <Link to="/" className="brand-logo">
          NOVA <span>GAMES</span>
        </Link>
        <p>Download Games for PC and Mobile</p>
      </div>

      {/* Desktop nav + actions */}
      <div className={`header-right ${mobileOpen ? 'open' : ''}`}>
        <nav className="navigation">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              onClick={() => setMobileOpen(false)}
            >
              {route.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">

          {/* Search */}
          <div className="navbar-search-wrapper">
            {searchOpen ? (
              <form className="navbar-search-form" onSubmit={handleSearch}>
                <input
                  ref={searchRef}
                  className="navbar-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                />
                <button type="submit" className="navbar-search-submit" aria-label="Search">
                  🔍
                </button>
                <button
                  type="button"
                  className="navbar-search-close"
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  aria-label="Close search"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                className="nav-icon-btn search-btn"
                onClick={() => setSearchOpen(true)}
                title="Search games"
                aria-label="Open search"
              >
                🔍
              </button>
            )}
          </div>

          {/* Install */}
          <button
            className="install-btn"
            onClick={handleInstall}
            title={installPrompt ? 'Install NOVA GAMES app' : 'Open in browser — install via browser menu'}
          >
        
            <span>🔻Install</span>
          </button>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? '🔅' : '🌙'}
          </button>

          {/* User */}
          {user ? (
            <div className="user-menu-wrapper">
              <button
                type="button"
                className="user-avatar"
                title={user.email}
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                {initial}
              </button>
              {userMenuOpen && (
                <div className="user-menu">
                  <p>{user.email}</p>
                  <button
                    type="button"
                    className="button secondary signout-button"
                    onClick={() => {
                      localStorage.removeItem('user');
                      setUser(null);
                      setUserMenuOpen(false);
                      setMobileOpen(false);
                      navigate('/');
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="button primary" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile toggle */}
      <button
        className="mobile-toggle"
        aria-expanded={mobileOpen}
        aria-label="Toggle navigation"
        onClick={() => setMobileOpen((prev) => !prev)}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>
    </header>
  );
}

export default NavBar;
