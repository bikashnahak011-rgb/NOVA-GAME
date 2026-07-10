import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { games, categories } from '../data/games.js';
import GameCard from '../components/GameCard.jsx';
import SpecsChecker from '../components/SpecsChecker.jsx';
import RecommendationWizard from '../components/RecommendationWizard.jsx';
import ProfilePanel from '../components/ProfilePanel.jsx';

function Home() {
  const navigate = useNavigate();
  const [paused, setPaused] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [homeQuery, setHomeQuery] = useState('');

  // Shorten featured lists to 3 games max to keep home page size compact
  const featuredGames = useMemo(() => games.filter((game) => game.isTrending || game.recommended).slice(0, 3), []);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % featuredGames.length);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (homeQuery.trim()) {
      navigate(`/games?q=${encodeURIComponent(homeQuery.trim())}`);
    }
  };

  const triggerDownload = (game) => {
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

    // Dynamic XP sync for local storage profile
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        const storedInstalls = localStorage.getItem(`installs_${userObj.email}`);
        const installs = storedInstalls ? JSON.parse(storedInstalls) : [];
        if (!installs.includes(game.id)) {
          installs.push(game.id);
          localStorage.setItem(`installs_${userObj.email}`, JSON.stringify(installs));
          
          // Compute XP
          const currentXp = Number(localStorage.getItem(`xp_${userObj.email}`) || '0');
          const currentLevel = Number(localStorage.getItem(`level_${userObj.email}`) || '1');
          
          let newXp = currentXp + 50;
          let newLevel = currentLevel;
          let nextLevelXp = newLevel * 100;
          let leveledUp = false;

          while (newXp >= nextLevelXp) {
            newXp -= nextLevelXp;
            newLevel += 1;
            nextLevelXp = newLevel * 100;
            leveledUp = true;
          }

          localStorage.setItem(`xp_${userObj.email}`, newXp.toString());
          localStorage.setItem(`level_${userObj.email}`, newLevel.toString());

          if (leveledUp) {
            alert(`LEVEL UP! You reached Level ${newLevel}!`);
          }
        }
      } catch (error) {
        console.error('Error syncing download XP points:', error);
      }
    }
  };

  useEffect(() => {
    if (paused || featuredGames.length === 0) return undefined;
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % featuredGames.length);
    }, 6000);
    return () => window.clearInterval(interval);
  }, [paused, featuredGames.length]);

  return (
    <section className="home-page">
      <div className="hero-block">
        <div className="hero-left">
          <p className="eyebrow">NOVA GAMES PORTAL</p>
          <h1>Immersive Nova Game Library.</h1>
          <p>
            Explore verified game releases, requirements calculators, recommendations, and tactical guides in a dark retro-futuristic deck.
          </p>

          <form onSubmit={handleSearchSubmit} className="home-search-form" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div className="search-panel">
              <input
                type="text"
                value={homeQuery}
                onChange={(e) => setHomeQuery(e.target.value)}
                placeholder="Search games, genres, or platforms..."
              />
              <button type="submit" className="button primary cyberpunk-button" style={{ padding: '1rem 2rem' }}>SEARCH</button>
            </div>
          </form>

          <div className="hero-actions">
            <Link to="/games" className="button primary cyberpunk-button">BROWSE DEEP DATABASE</Link>
            <Link to="/categories" className="button secondary">CATEGORIES</Link>
            <a
              href="https://youtu.be/z-DmaH-19xo?si=RLOvkdhHVdavL9ae"
              target="_blank"
              rel="noreferrer"
              className="yt-how-btn"
            >
              <span className="yt-play-icon">▶</span>
              How to Download
            </a>
          </div>
        </div>
        <div className="hero-right-card">
          <ProfilePanel />
        </div>
      </div>

      <section className="hero-slider">
        {featuredGames.map((game, index) => (
          <div
            key={game.id}
            className={`slider-slide ${index === activeSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${game.cover})` }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="slider-overlay" />
            <div className="slider-content">
              <div className="slider-top">
                <div className="slider-badges">
                  <span className="slider-badge version">V {game.version}</span>
                  <span className="slider-badge platform">{game.platform}</span>
                  <span className="slider-badge release">{game.releaseDate}</span>
                </div>
                <div className="slider-logo">NOVA PORTAL</div>
              </div>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <div className="slider-actions">
                <button
                  type="button"
                  className="button primary cyberpunk-button"
                  onClick={() => triggerDownload(game)}
                >
                  DOWNLOAD INSTANT
                </button>
                <Link className="button secondary" to={`/games/${game.id}`}>DETAILS</Link>
              </div>
              <div className="slider-footer">
                <div className="slider-progress">
                  <div className="slider-progress-bar" style={{ width: `${((activeSlide + 1) / featuredGames.length) * 100}%` }} />
                </div>
                <div className="slider-dots">
                  {featuredGames.map((_, dotIndex) => (
                    <button
                      key={dotIndex}
                      type="button"
                      className={dotIndex === activeSlide ? 'dot active' : 'dot'}
                      onClick={() => setActiveSlide(dotIndex)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {featuredGames.length > 1 && (
          <div className="slider-controls">
            <button className="slider-nav" type="button" onClick={handlePrevSlide}>←</button>
            <button className="slider-nav" type="button" onClick={handleNextSlide}>→</button>
          </div>
        )}
      </section>

      <section className="widgets-section-grid">
        <SpecsChecker />
        <RecommendationWizard />
      </section>

      <section className="section-grid">
        <div className="featured-row-home">
          <div className="section-row-header">
            <h2>↬ Our Games</h2>
            <Link to="/games" className="see-more-btn">
              See More Games <span>↪</span>
            </Link>
          </div>
          <div className="game-grid">
            {games.slice(0, 12).map((game) => <GameCard key={game.id} game={game} />)}
          </div>
        </div>
        <div className="categories-row-home">
          <h2>Database index</h2>
          <div className="category-list">
            {categories.slice(0, 8).map((category) => (
              <Link key={category} to="/categories" className="category-tag">{category}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="overview-block">
        <div className="stat-card">
          <span>120+</span>
          <p> Currently Available Games</p>
        </div>
        <div className="stat-card">
          <span>99.9%</span>
          <p>Verified Installation Guides</p>
        </div>
        <div className="stat-card">
          <span>Ultra Fast</span>
          <p>Optimized Download Servers</p>
        </div>
      </section>
    </section>
  );
}

export default Home;
