import { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { games } from '../data/games.js';

function ProfilePanel() {
  const { user, setUser } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [installs, setInstalls] = useState([]);
  const [launchMessage, setLaunchMessage] = useState('');

  // Sync state with localStorage on mount and updates
  useEffect(() => {
    if (!user) return;

    // Load XP and Level
    const storedXp = localStorage.getItem(`xp_${user.email}`) || '30';
    const storedLvl = localStorage.getItem(`level_${user.email}`) || '1';
    setXp(Number(storedXp));
    setLevel(Number(storedLvl));

    // Load Favorites
    const storedFavs = localStorage.getItem(`favs_${user.email}`);
    setFavorites(storedFavs ? JSON.parse(storedFavs) : []);

    // Load Installs
    const storedInstalls = localStorage.getItem(`installs_${user.email}`);
    setInstalls(storedInstalls ? JSON.parse(storedInstalls) : []);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const getRankName = (lvl) => {
    if (lvl >= 5) return 'MAINFRAME OVERLORD';
    if (lvl === 4) return 'ELITE NETRUNNER';
    if (lvl === 3) return 'GRID RUNNER';
    if (lvl === 2) return 'CYBER STALKER';
    return 'RECRUIT OPERATIVE';
  };

  const handleLaunchGame = (gameTitle) => {
    setLaunchMessage(`LAUNCHING: ${gameTitle.toUpperCase()}... compiling shaders... booting core engines...`);
    setTimeout(() => {
      setLaunchMessage('');
      alert(`SUCCESS: ${gameTitle} launched successfully in Direct 3D full performance mode!`);
    }, 1500);
  };

  const nextLevelXp = level * 100;
  const xpPercent = Math.min(100, Math.floor((xp / nextLevelXp) * 100));

  if (!user) {
    return (
      <div className="profile-panel-widget glass-panel logged-out">
        <div className="widget-header">
          <span className="glow-bullet lock" />
          <h3>Cybernetic Connection Offline</h3>
        </div>
        <p className="widget-subtitle">Connect your credential node to track gameplay XP, save favorites, and establish virtual direct launch links.</p>
        <Link to="/login" className="button primary cyberpunk-button login-trigger">
          ESTABLISH CONNECTION
        </Link>
      </div>
    );
  }

  // Get matching games data
  const favGames = games.filter(g => favorites.includes(g.id));
  const installedGames = games.filter(g => installs.includes(g.id));

  return (
    <div className="profile-panel-widget glass-panel">
      <div className="profile-header-row">
        <div className="user-info">
          <span className="avatar-icon">🎮</span>
          <div>
            <h3 className="user-email">{user.email.split('@')[0].toUpperCase()}</h3>
            <span className="gamer-rank-tag">{getRankName(level)}</span>
          </div>
        </div>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          DISCONNECT
        </button>
      </div>

      <div className="level-progression-box">
        <div className="level-header">
          <span className="lvl-badge">LVL {level}</span>
          <span className="xp-details">{xp} / {nextLevelXp} XP</span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
        </div>
        <div className="level-footer-tip">
          {xpPercent}% towards Rank promotion. (Gain XP by downloading titles or adding favorites).
        </div>
      </div>

      {launchMessage && (
        <div className="launching-notifier-overlay">
          <div className="scanner-line" />
          <div className="launch-text">{launchMessage}</div>
        </div>
      )}

      <div className="profile-lists-grid">
        <div className="profile-section">
          <h4>Tactical Favorites ({favGames.length})</h4>
          <div className="profile-list-items">
            {favGames.length > 0 ? (
              favGames.map(game => (
                <div key={game.id} className="profile-list-item">
                  <Link to={`/games/${game.id}`} className="item-title">{game.title}</Link>
                  <span className="item-plat">{game.platform}</span>
                </div>
              ))
            ) : (
              <p className="empty-list">No favorites marked. Explore detail pages to save.</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h4>Active Deployments ({installedGames.length})</h4>
          <div className="profile-list-items">
            {installedGames.length > 0 ? (
              installedGames.map(game => (
                <div key={game.id} className="profile-list-item installed">
                  <span className="item-title">{game.title}</span>
                  <button
                    type="button"
                    className="launch-mini-btn"
                    onClick={() => handleLaunchGame(game.title)}
                  >
                    RUN ⚡
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-list">No local files detected. Run downloads from game panels to install.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePanel;
