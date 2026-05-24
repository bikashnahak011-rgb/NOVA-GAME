import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function GameCard({ game }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for localhost / non-HTTPS
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

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/games/${game.id}`;
    copyToClipboard(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDownloads = (num) => {
    if (!num) return '0 DL';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M DL';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K DL';
    return num + ' DL';
  };

  return (
    <article className="game-card poster-card" onClick={() => navigate(`/games/${game.id}`)}>
      <div className="cover" style={{ backgroundImage: `url(${game.cover})` }}>
        <div className="cover-overlay">
          <div className="badge-row">
            {game.isTrending && <span className="badge trending">TRENDING</span>}
            {game.isNew && <span className="badge new">NEW</span>}
          </div>
          <div className="card-rating-badge">
            ⭐ {game.rating || '4.5'}
          </div>
          <button
            className={`card-share-btn ${copied ? 'copied' : ''}`}
            onClick={handleShare}
            title="Copy share link"
          >
            {copied ? '✓' : '🔗'}
          </button>
          <div className="poster-title">
            <h3>{game.title}</h3>
            <div className="meta-row">
              <span className="plat-meta">{game.platform}</span>
              <span className="divider-dot">•</span>
              <span className="size-meta">{game.fileSize}</span>
              <span className="divider-dot">•</span>
              <span className="dl-meta">{formatDownloads(game.downloads)}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default GameCard;
