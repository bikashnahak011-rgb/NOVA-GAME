import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { games } from '../data/games.js';

function RecommendationWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState('');
  const [vibe, setVibe] = useState('');
  const [connectivity, setConnectivity] = useState('');
  const [results, setResults] = useState([]);

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      calculateRecommendations();
    }
  };

  const handleReset = () => {
    setStep(1);
    setPlatform('');
    setVibe('');
    setConnectivity('');
    setResults([]);
  };

  const calculateRecommendations = () => {
    // Filter logic
    const matched = games.map((game) => {
      let score = 50;

      // Platform match
      if (platform === 'Any') {
        score += 20;
      } else if (game.platform.toLowerCase() === platform.toLowerCase()) {
        score += 25;
      } else {
        score -= 10;
      }

      // Vibe match
      const genresLower = game.genres.map(g => g.toLowerCase());
      if (vibe === 'action' && (genresLower.includes('action') || genresLower.includes('fps') || genresLower.includes('battle royale'))) {
        score += 25;
      } else if (vibe === 'rpg' && (genresLower.includes('rpg') || genresLower.includes('adventure'))) {
        score += 25;
      } else if (vibe === 'survival' && genresLower.includes('survival')) {
        score += 25;
      } else if (vibe === 'horror' && genresLower.includes('horror')) {
        score += 25;
      } else if (vibe === 'sports' && (genresLower.includes('sports') || genresLower.includes('racing'))) {
        score += 25;
      }

      // Connectivity match
      if (connectivity === 'online' && genresLower.includes('online')) {
        score += 20;
      } else if (connectivity === 'offline' && genresLower.includes('offline')) {
        score += 20;
      } else if (genresLower.includes('multiplayer')) {
        score += 15;
      }

      return { game, score: Math.min(100, Math.max(10, score)) };
    });

    // Sort by score descending and take top 3
    const topMatches = matched
      .filter((m) => m.score > 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    setResults(topMatches);
    setStep(4);
  };

  return (
    <div className="recommendation-wizard-widget glass-panel">
      <div className="widget-header">
        <span className="glow-bullet secondary" />
        <h3>A.I. Recommendation Tactician</h3>
      </div>
      
      <p className="widget-subtitle">Answer 3 brief combat parameters and let the AI find your next deployment.</p>

      {step === 1 && (
        <div className="wizard-step">
          <div className="step-indicator">Step 1 of 3: Screen Target</div>
          <h4>Where will you deploy your forces?</h4>
          <div className="option-grid">
            <button
              type="button"
              className={`option-btn ${platform === 'PC' ? 'active' : ''}`}
              onClick={() => setPlatform('PC')}
            >
              🖥️ Desktop PC
            </button>
            <button
              type="button"
              className={`option-btn ${platform === 'Android' ? 'active' : ''}`}
              onClick={() => setPlatform('Android')}
            >
              🤖 Android Device
            </button>
            <button
              type="button"
              className={`option-btn ${platform === 'iOS' ? 'active' : ''}`}
              onClick={() => setPlatform('iOS')}
            >
              🍏 Apple iOS
            </button>
            <button
              type="button"
              className={`option-btn ${platform === 'Any' ? 'active' : ''}`}
              onClick={() => setPlatform('Any')}
            >
              🌐 Any Platform
            </button>
          </div>
          <div className="wizard-actions">
            <button
              type="button"
              className="button primary cyberpunk-button"
              disabled={!platform}
              onClick={handleNext}
            >
              NEXT DEPLOYMENT →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <div className="step-indicator">Step 2 of 3: Gameplay Vibe</div>
          <h4>Select your tactical tempo:</h4>
          <div className="option-grid">
            <button
              type="button"
              className={`option-btn ${vibe === 'action' ? 'active' : ''}`}
              onClick={() => setVibe('action')}
            >
              💥 Fast Action & Combat
            </button>
            <button
              type="button"
              className={`option-btn ${vibe === 'rpg' ? 'active' : ''}`}
              onClick={() => setVibe('rpg')}
            >
              ⚔️ RPG & Rich Story
            </button>
            <button
              type="button"
              className={`option-btn ${vibe === 'survival' ? 'active' : ''}`}
              onClick={() => setVibe('survival')}
            >
              🌲 Survival & Crafting
            </button>
            <button
              type="button"
              className={`option-btn ${vibe === 'horror' ? 'active' : ''}`}
              onClick={() => setVibe('horror')}
            >
              👻 Dark Atmosphere & Horror
            </button>
            <button
              type="button"
              className={`option-btn ${vibe === 'sports' ? 'active' : ''}`}
              onClick={() => setVibe('sports')}
            >
              🏎️ Sports & Arcade Racing
            </button>
          </div>
          <div className="wizard-actions">
            <button type="button" className="button secondary" onClick={() => setStep(1)}>
              ← BACK
            </button>
            <button
              type="button"
              className="button primary cyberpunk-button"
              disabled={!vibe}
              onClick={handleNext}
            >
              NEXT DEPLOYMENT →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-step">
          <div className="step-indicator">Step 3 of 3: Connectivity</div>
          <h4>Select your connection protocol:</h4>
          <div className="option-grid">
            <button
              type="button"
              className={`option-btn ${connectivity === 'offline' ? 'active' : ''}`}
              onClick={() => setConnectivity('offline')}
            >
              📴 Solo Offline Campaign
            </button>
            <button
              type="button"
              className={`option-btn ${connectivity === 'online' ? 'active' : ''}`}
              onClick={() => setConnectivity('online')}
            >
              🌐 Online Co-op / VS Arena
            </button>
          </div>
          <div className="wizard-actions">
            <button type="button" className="button secondary" onClick={() => setStep(2)}>
              ← BACK
            </button>
            <button
              type="button"
              className="button primary cyberpunk-button"
              disabled={!connectivity}
              onClick={handleNext}
            >
              CALCULATE MATCHES ⚡
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-step results-step">
          <div className="step-indicator">SCAN REPORT COMPILED</div>
          <h4>Matched Tactical Directives</h4>

          <div className="recommended-results-list">
            {results.length > 0 ? (
              results.map(({ game, score }) => (
                <div key={game.id} className="match-card" onClick={() => navigate(`/games/${game.id}`)}>
                  <div className="match-img" style={{ backgroundImage: `url(${game.cover})` }} />
                  <div className="match-details">
                    <div className="match-meta">
                      <span className="match-score">{score}% MATCH</span>
                      <span className="match-platform">{game.platform}</span>
                    </div>
                    <h5>{game.title}</h5>
                    <p>{game.genres.join(', ')}</p>
                  </div>
                  <div className="match-arrow">→</div>
                </div>
              ))
            ) : (
              <p className="no-matches">No active directives found matching your parameters.</p>
            )}
          </div>

          <div className="wizard-actions">
            <button type="button" className="button secondary" onClick={handleReset}>
              RE-CALIBRATE WIZARD
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationWizard;
