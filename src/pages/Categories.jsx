import { categories, games } from '../data/games.js';
import GameCard from '../components/GameCard.jsx';

function Categories() {
  const categoriesWithCount = categories.map((category) => ({
    label: category,
    count: games.filter((game) => game.genres.includes(category) || game.platform === category).length
  }));

  return (
    <section className="categories-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Categories</p>
          <h1>Unlimited Gaming Experience</h1>
          <p>NOVA GAMES is designed for gamers who want fast access to the latest action, racing, adventure, battle royale, and open-world games. Our platform provides screenshots, system requirements, installation guides, and direct download access in a clean and modern interface..</p>
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
      </div>
      <div className="category-grid">
        {categoriesWithCount.map((category) => (
          <div key={category.label} className="category-block">
            <span>{category.label}</span>
            <strong>{category.count} games</strong>
          </div>
        ))}
      </div>
      <div className="featured-block">
        <h2>Featured genre picks</h2>
        <div className="game-grid">
          {games.filter((game) => game.isTrending).slice(0, 4).map((game) => <GameCard key={game.id} game={game} />)}
        </div>
      </div>
    </section>
  );
}

export default Categories;
