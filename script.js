import { games, categories } from './data/games.js';

const elements = {
  mainNav: document.getElementById('mainNav'),
  navToggle: document.getElementById('navToggle'),
  themeToggle: document.getElementById('themeToggle'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('searchBtn'),
  categoryList: document.getElementById('categoryList'),
  featuredSlider: document.getElementById('featuredSlider'),
  searchResults: document.getElementById('searchResults'),
  searchGrid: document.getElementById('searchGrid'),
  searchSummary: document.getElementById('searchSummary'),
  latestGames: document.getElementById('latestGames'),
  pcGames: document.getElementById('pcGames'),
  mobileGames: document.getElementById('mobileGames'),
  detailView: document.getElementById('detailView'),
  preloader: document.getElementById('preloader'),
  newsletterForm: document.getElementById('newsletterForm'),
  cursorGlow: document.getElementById('cursorGlow'),
  sliderPrev: document.getElementById('sliderPrev'),
  sliderNext: document.getElementById('sliderNext')
};

const state = {
  favorites: new Set(JSON.parse(localStorage.getItem('novaFavorites') || '[]')),
  searchQuery: '',
  activeCategory: null,
  autoSlide: null,
  currentSlide: 0
};

const toTitleCase = (value) => value.replace(/\b\w/g, (m) => m.toUpperCase());

const formatNumber = (value) => value.toLocaleString();

const getActiveGames = () => {
  const query = state.searchQuery.trim().toLowerCase();
  return games.filter((game) => {
    const matchesCategory = !state.activeCategory || game.genres.includes(state.activeCategory) || game.platform === state.activeCategory;
    const matchesQuery = !query || [game.title, game.platform, ...game.genres].some((text) => text.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });
};

const createBadge = (label, type) => `<span class="badge ${type}">${label}</span>`;

const renderGameCard = (game) => {
  const tags = game.genres.slice(0, 2).map((genre) => `<span class="action-pill">${genre}</span>`).join('');
  const heartActive = state.favorites.has(game.id) ? 'active' : '';
  return `
    <article class="game-card" data-game-id="${game.id}">
      <div class="cover" style="background-image: url('${game.cover}')"></div>
      <div class="card-body">
        <div class="badge-row">
          ${game.isTrending ? createBadge('Trending', 'trending') : ''}
          ${game.isNew ? createBadge('New update', 'new') : ''}
          ${game.recommended ? createBadge('Recommended', 'recommended') : ''}
        </div>
        <h3>${game.title}</h3>
        <p>${game.description}</p>
        <div class="meta-row">
          <span>${game.platform}</span>
          <span>${game.fileSize}</span>
        </div>
        <div class="stats-row">
          <span class="rating">★ ${game.rating.toFixed(1)}</span>
          <span>${formatNumber(game.downloads)} downloads</span>
        </div>
        <div class="card-actions">
          ${tags}
          <button class="icon-btn favorite-btn ${heartActive}" data-favorite="${game.id}" aria-label="Favorite ${game.title}">❤</button>
        </div>
      </div>
    </article>
  `;
};

const renderCards = (container, list) => {
  if (!container) return;
  container.innerHTML = list.length ? list.map(renderGameCard).join('') : '<p class="no-results">No games match your search.</p>';
};

const renderCategories = () => {
  elements.categoryList.innerHTML = categories.map((category) => {
    const activeClass = state.activeCategory === category ? 'active' : '';
    return `
      <button class="category-card ${activeClass}" data-category="${category}">
        <span>${category}</span>
        <strong>${games.filter((game) => game.genres.includes(category) || game.platform === category).length}</strong>
      </button>
    `;
  }).join('');
};

const renderFeaturedSlider = () => {
  const featured = games.filter((game) => game.isTrending || game.recommended).slice(0, 4);
  elements.featuredSlider.innerHTML = featured.map((game, index) => `
    <article class="slider-card" data-game-id="${game.id}" data-index="${index}">
      <div class="badge-row">
        ${game.isTrending ? createBadge('Trending', 'trending') : ''}
        ${game.isNew ? createBadge('New update', 'new') : ''}
      </div>
      <h3>${game.title}</h3>
      <p>${game.description}</p>
      <div class="meta-row">
        <span>${game.platform}</span>
        <span>${game.fileSize}</span>
      </div>
    </article>
  `).join('');
  setActiveSlide(state.currentSlide);
};

const setActiveSlide = (index) => {
  const slides = Array.from(elements.featuredSlider.querySelectorAll('.slider-card'));
  if (!slides.length) return;
  state.currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, idx) => {
    slide.style.opacity = idx === state.currentSlide ? '1' : '0.28';
    slide.style.transform = idx === state.currentSlide ? 'scale(1)' : 'scale(0.96)';
    slide.style.pointerEvents = idx === state.currentSlide ? 'auto' : 'none';
  });
};

const renderSearch = () => {
  const results = getActiveGames();
  const sectionIds = [
    'featuredSliderSection',
    'categories',
    'latestSection',
    'pcGames',
    'mobileGames'
  ];
  const sections = sectionIds.map((id) => document.getElementById(id)?.closest('.section') || document.getElementById(id));
  if (state.searchQuery || state.activeCategory) {
    elements.searchResults.classList.remove('hidden');
    elements.searchSummary.textContent = `Showing ${results.length} game(s) for "${state.searchQuery || state.activeCategory}"`;
    renderCards(elements.searchGrid, results);
    sections.forEach((section) => section?.classList.add('hidden'));
    return;
  }
  elements.searchResults.classList.add('hidden');
  sections.forEach((section) => section?.classList.remove('hidden'));
};

const populateHomeSections = () => {
  renderCards(elements.latestGames, games.slice(0, 4));
  renderCards(elements.pcGames, games.filter((game) => game.platform === 'PC').slice(0, 4));
  renderCards(elements.mobileGames, games.filter((game) => ['Android', 'iOS'].includes(game.platform)).slice(0, 4));
};

const setNavigation = () => {
  elements.navToggle.addEventListener('click', () => {
    elements.mainNav.classList.toggle('open');
  });
};

const handleGameClick = (id) => {
  window.location.hash = `#game/${id}`;
};

const createTagList = (list) => list.map((item) => `<span class="tag">${item}</span>`).join('');

const createRequirementRow = (items) => items.map((item) => `<li>${item}</li>`).join('');

const renderRelatedGames = (game) => {
  const related = games.filter((item) => item.id !== game.id && item.genres.some((genre) => game.genres.includes(genre))).slice(0, 3);
  if (!related.length) return '<p>No related games available yet. Browse the catalog for more titles.</p>';
  return related.map((item) => `
    <article class="game-card" data-game-id="${item.id}">
      <div class="cover" style="background-image: url('${item.cover}')"></div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <div class="meta-row"><span>${item.platform}</span><span>${item.fileSize}</span></div>
      </div>
    </article>
  `).join('');
};

const renderDetailPage = (game) => {
  if (!game) {
    elements.detailView.innerHTML = '<div class="detail-panel"><p>Game not found. Return to home to continue browsing.</p></div>';
    return;
  }

  elements.detailView.innerHTML = `
    <div class="detail-panel">
      <button class="back-button" id="backHomeBtn">← Back to home</button>
      <div class="detail-header">
        <div class="detail-top">
          <div class="detail-title">
            <span class="eyebrow">Game overview</span>
            <h2>${game.title}</h2>
            <p>${game.description}</p>
          </div>
          <div class="tags">
            ${createTagList(game.genres)}
          </div>
        </div>
        <div class="detail-meta">
          <div><span>Developer</span><strong>${game.developer}</strong></div>
          <div><span>Platform</span><strong>${game.platform}</strong></div>
          <div><span>File size</span><strong>${game.fileSize}</strong></div>
          <div><span>Version</span><strong>${game.version}</strong></div>
          <div><span>Release</span><strong>${game.releaseDate}</strong></div>
        </div>
      </div>
      <div class="detail-grid">
        <div>
          <div class="detail-cover" style="background-image: url('${game.cover}')"></div>
          <div class="detail-actions">
            <a class="primary-action" href="${game.downloadLinks.primary}" target="_blank" rel="noopener">Download Now</a>
            <a class="secondary-action" href="${game.downloadLinks.mirror}" target="_blank" rel="noopener">Mirror Link</a>
          </div>
        </div>
        <div class="detail-info">
          <div class="detail-section">
            <h3>About the game</h3>
            <p>${game.description}</p>
          </div>
          <div class="detail-section">
            <h3>Key features</h3>
            <ul>${createRequirementRow(game.features)}</ul>
          </div>
        </div>
      </div>
      <div class="detail-tabs">
        <section class="detail-section">
          <h3>Screenshot gallery</h3>
          <div class="gallery-grid">
            ${game.screenshotUrls.map((url) => `<img src="${url}" alt="${game.title} screenshot">`).join('')}
          </div>
        </section>
        <section class="detail-section">
          <h3>System requirements</h3>
          <div class="detail-grid">
            <div class="detail-section">
              <strong>Minimum</strong>
              <ul>${createRequirementRow(game.requirements.minimum)}</ul>
            </div>
            <div class="detail-section">
              <strong>Recommended</strong>
              <ul>${createRequirementRow(game.requirements.recommended)}</ul>
            </div>
          </div>
        </section>
        <section class="detail-section">
          <h3>Installation guide</h3>
          <ul>${createRequirementRow(game.installationGuide)}</ul>
        </section>
        <section class="detail-section">
          <h3>Important notice</h3>
          <p>${game.notices}</p>
        </section>
        <section class="detail-section">
          <h3>Gameplay trailer</h3>
          <div class="video-frame">
            <iframe width="100%" height="360" src="${game.trailerUrl}" title="${game.title} trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
        </section>
        <section class="detail-section">
          <h3>Related games</h3>
          <div class="related-games">
            ${renderRelatedGames(game)}
          </div>
        </section>
      </div>
    </div>
  `;

  document.getElementById('backHomeBtn').addEventListener('click', () => {
    window.location.hash = '';
  });
};

const handleHash = () => {
  const hash = window.location.hash;
  if (hash.startsWith('#game/')) {
    const gameId = hash.split('/')[1];
    const game = games.find((item) => item.id === gameId);
    renderDetailPage(game);
    elements.detailView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  elements.detailView.classList.add('hidden');
};

const handleFavoriteToggle = (gameId) => {
  if (state.favorites.has(gameId)) {
    state.favorites.delete(gameId);
  } else {
    state.favorites.add(gameId);
  }
  localStorage.setItem('novaFavorites', JSON.stringify([...state.favorites]));
  renderSearch();
  populateHomeSections();
  renderFeaturedSlider();
};

const setListeners = () => {
  elements.searchInput.addEventListener('input', (event) => {
    state.searchQuery = event.target.value;
    renderSearch();
  });

  elements.searchBtn.addEventListener('click', () => {
    state.searchQuery = elements.searchInput.value;
    renderSearch();
  });

  elements.categoryList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    const category = button.dataset.category;
    state.activeCategory = state.activeCategory === category ? null : category;
    renderCategories();
    renderSearch();
  });

  document.addEventListener('click', (event) => {
    const card = event.target.closest('[data-game-id]');
    if (card && !event.target.closest('[data-favorite]')) {
      handleGameClick(card.dataset.gameId);
    }
    const favorite = event.target.closest('[data-favorite]');
    if (favorite) {
      event.stopPropagation();
      handleFavoriteToggle(favorite.dataset.favorite);
    }
  });

  elements.themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const active = document.body.classList.contains('dark-mode');
    elements.themeToggle.textContent = active ? '☀' : '☾';
  });

  window.addEventListener('hashchange', handleHash);
  window.addEventListener('mousemove', (event) => {
    elements.cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
  });

  elements.sliderPrev.addEventListener('click', () => {
    setActiveSlide(state.currentSlide - 1);
  });

  elements.sliderNext.addEventListener('click', () => {
    setActiveSlide(state.currentSlide + 1);
  });

  elements.newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.target.querySelector('input');
    input.value = '';
    input.placeholder = 'Subscribed!';
  });
};

const initSliderLoop = () => {
  state.autoSlide = setInterval(() => {
    setActiveSlide(state.currentSlide + 1);
  }, 6000);
};

const initSite = () => {
  renderCategories();
  renderFeaturedSlider();
  populateHomeSections();
  renderSearch();
  setNavigation();
  setListeners();
  handleHash();
  initSliderLoop();
  setTimeout(() => elements.preloader.classList.add('hidden'), 600);
};

window.addEventListener('DOMContentLoaded', initSite);
