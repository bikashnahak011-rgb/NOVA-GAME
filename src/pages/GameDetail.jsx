import { useMemo, useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { games } from '../data/games.js';
import { ThemeContext } from '../context/ThemeContext.jsx';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(ThemeContext);
  const game = useMemo(() => games.find((item) => item.id === id), [id]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [notification, setNotification] = useState('');

  // Load user status
  useEffect(() => {
    if (!user || !game) return;

    const storedFavs = localStorage.getItem(`favs_${user.email}`);
    const favorites = storedFavs ? JSON.parse(storedFavs) : [];
    setIsFavorite(favorites.includes(game.id));

    const storedInstalls = localStorage.getItem(`installs_${user.email}`);
    const installs = storedInstalls ? JSON.parse(storedInstalls) : [];
    setIsInstalled(installs.includes(game.id));
  }, [user, game]);

  if (!game) {
    return (
      <section className="detail-page">
        <div className="not-found-card">
          <h2>Game not found</h2>
          <button className="button primary" onClick={() => navigate('/')}>Return home</button>
        </div>
      </section>
    );
  }

  const getRankName = (lvl) => {
    if (lvl >= 5) return 'MAINFRAME OVERLORD';
    if (lvl === 4) return 'ELITE NETRUNNER';
    if (lvl === 3) return 'GRID RUNNER';
    if (lvl === 2) return 'CYBER STALKER';
    return 'RECRUIT OPERATIVE';
  };

  const addXp = (amount) => {
    if (!user) return;
    const currentXp = Number(localStorage.getItem(`xp_${user.email}`) || '0');
    const currentLevel = Number(localStorage.getItem(`level_${user.email}`) || '1');

    let newXp = currentXp + amount;
    let newLevel = currentLevel;
    let nextLevelXp = newLevel * 100;
    let leveledUp = false;

    while (newXp >= nextLevelXp) {
      newXp -= nextLevelXp;
      newLevel += 1;
      nextLevelXp = newLevel * 100;
      leveledUp = true;
    }

    localStorage.setItem(`xp_${user.email}`, newXp.toString());
    localStorage.setItem(`level_${user.email}`, newLevel.toString());

    if (leveledUp) {
      setTimeout(() => {
        alert(`LEVEL UP! You reached Level ${newLevel}! Promoted to rank: ${getRankName(newLevel)}!`);
      }, 600);
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      alert('Sign in to save favorites and earn gamer XP!');
      return;
    }

    const storedFavs = localStorage.getItem(`favs_${user.email}`);
    let favorites = storedFavs ? JSON.parse(storedFavs) : [];

    if (favorites.includes(game.id)) {
      favorites = favorites.filter((favId) => favId !== game.id);
      setIsFavorite(false);
      showNotification('Removed from Favorites');
    } else {
      favorites.push(game.id);
      setIsFavorite(true);
      addXp(25);
      showNotification('★ Added to Favorites! +25 XP acquired');
    }

    localStorage.setItem(`favs_${user.email}`, JSON.stringify(favorites));
  };

  const handleDownload = (e) => {
    const isMock = game.downloadLinks.primary.includes('example.com');

    if (isMock) {
      e.preventDefault();
      // Trigger local text file download
      const fileContent = `=== NOVA GAMES INSTALLATION WIZARD ===\n\nGame: ${game.title}\nPlatform: ${game.platform}\nFile Size: ${game.fileSize}\nVersion: ${game.version}\nDate: ${new Date().toLocaleDateString()}\n\nInstructions:\n1. Extract this installer configuration pack.\n2. Run "nova_games_launcher.exe" to verify the checksum and unpack the mirror files.\n3. The setup launcher requires no password.\n\nThank you for choosing NOVA GAMES!`;
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${game.title.replace(/\s+/g, '_')}_installer_pack.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    if (!user) {
      showNotification('📥 Download initiated! Sign in to track XP.');
      return;
    }

    const storedInstalls = localStorage.getItem(`installs_${user.email}`);
    const installs = storedInstalls ? JSON.parse(storedInstalls) : [];

    if (!installs.includes(game.id)) {
      installs.push(game.id);
      localStorage.setItem(`installs_${user.email}`, JSON.stringify(installs));
      setIsInstalled(true);
      addXp(50);
      showNotification('📥 Deployment Initiated! +50 XP acquired');
    } else {
      showNotification('📥 Download initiated!');
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return Promise.resolve();
  };

  const handleCopyLink = () => {
    copyToClipboard(window.location.href)
      .then(() => showNotification('🔗 Share link copied to clipboard!'))
      .catch(() => showNotification('Could not copy link.'));
  };

  return (
    <section className="detail-page">
      {notification && (
        <div className="game-notification-toast">
          <span className="toast-bullet" />
          <p>{notification}</p>
        </div>
      )}

      <div className="detail-header">
        <div>
          <p className="eyebrow">{game.genres.join(' / ').toUpperCase()}</p>
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="button secondary" onClick={() => navigate(-1)}>← Back</button>
          <button className="button secondary share-btn" onClick={handleCopyLink} title="Copy share link">🔗 Share</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-cover" style={{ backgroundImage: `url(${game.cover})` }} />
        <div className="detail-summary">
          <div className="summary-row">
            <span>Platform</span>
            <strong>{game.platform}</strong>
          </div>
          <div className="summary-row">
            <span>File size</span>
            <strong>{game.fileSize}</strong>
          </div>
          <div className="summary-row">
            <span>Release Date</span>
            <strong>{game.releaseDate}</strong>
          </div>
          <div className="summary-row">
            <span>Developer</span>
            <strong>{game.developer}</strong>
          </div>
          <div className="summary-row">
            <span>Current Version</span>
            <strong>{game.version}</strong>
          </div>
          <div className="summary-row">
            <span>Gamer Rating</span>
            <strong className="neon-text-green">⭐ {game.rating} / 5.0</strong>
          </div>
          <div className="action-group">
            <a
              className="button primary cyberpunk-button"
              href={game.downloadLinks.primary.includes('example.com') ? '#' : game.downloadLinks.primary}
              onClick={handleDownload}
              target={game.downloadLinks.primary.includes('example.com') ? undefined : '_blank'}
              rel="noreferrer"
            >
              DOWNLOAD FILES
            </a>
            <button
              type="button"
              className={`button secondary fav-toggle-btn ${isFavorite ? 'favorited' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? '★ FAVORITED' : '☆ ADD FAVORITE'}
            </button>
          </div>
          {game.price && (
            <div className="buy-game-section">
              <div className="buy-header">
                <span className="price-label">Premium Version</span>
                <strong className="price-amount">₹ {game.price}</strong>
              </div>
              <button type="button" className="button primary buy-button">
                💳 BUY THE GAME
              </button>
            </div>
          )}
          {!user && (
            <p className="auth-tip-detail">
              * <Link to="/login">Sign in</Link> to establish connection, gain XP, and save titles.
            </p>
          )}
        </div>
      </div>

      <div className="detail-panels">
        <article className="panel-card">
          <h2>System requirements</h2>
          <div className="panel-columns">
            <div>
              <h3>Minimum Specs</h3>
              <ul>{game.requirements.minimum.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <h3>Recommended Specs</h3>
              <ul>{game.requirements.recommended.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
        </article>
        <article className="panel-card">
          <h2>Installation guide</h2>
          <ul>{game.installationGuide.map((item) => <li key={item}>{item}</li>)}</ul>
        </article>
        <article className="panel-card">
          <h2>Important notice</h2>
          <p>{game.notices}</p>
        </article>
      </div>

      <section className="gallery-section">
        <h2>Screenshot gallery</h2>
        <div className="gallery-grid">
          {game.screenshotUrls.map((url) => <img key={url} src={url} alt={`${game.title} screenshot`} />)}
        </div>
      </section>

      <section className="trailer-card">
        <h2>Gameplay trailer</h2>
        <iframe
          src={game.trailerUrl}
          title={`${game.title} trailer`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </section>
    </section>
  );
}

export default GameDetail;
