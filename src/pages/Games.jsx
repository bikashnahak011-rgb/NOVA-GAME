import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { games } from '../data/games.js';
import GameCard from '../components/GameCard.jsx';

function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [platform, setPlatform] = useState('All');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val) {
      setSearchParams({ q: val });
    } else {
      setSearchParams({});
    }
  };

  const filtered = useMemo(() => {
    return games.filter((game) => {
      const matchesQuery = query
        ? [game.title, ...game.genres, game.platform].some((value) => value.toLowerCase().includes(query.toLowerCase()))
        : true;
      const matchesPlatform = platform === 'All' || game.platform === platform;
      return matchesQuery && matchesPlatform;
    });
  }, [query, platform]);

  return (
    <section className="games-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Game library</p>
          <h1>Explore Trending Games</h1>
          <p>Stay updated with the hottest and most popular games from around the world. From high-graphics PC games to exciting mobile adventures, NOVA GAMES helps players discover new gaming experiences every day.</p>
          <a
            href="https://youtu.be/aaCeDJ275A8"
            target="_blank"
            rel="noreferrer"
            className="yt-how-btn"
          >
            <span className="yt-play-icon">▶</span>
            How to Download
          </a>
        </div>
        <div className="search-tool">
          <input
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search games, platform, genres"/>
          <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
            <option value="All">All platforms</option>
            <option value="PC">PC</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
          </select>
        </div>
      </div>
      <div className="game-grid">
        {filtered.map((game) => <GameCard key={game.id} game={game} />)}
        {filtered.length === 0 && <p className="no-results">No results found for your filters.</p>}
      </div>
    </section>
  );
}

export default Games;
