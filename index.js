const DATA_URL = 'data.json';

const app = document.getElementById('app');
const themeToggle = document.getElementById('theme-toggle');

let allCountries = [];
let countryByCode = new Map();
let currentSearch = '';
let currentRegion = '';

/* ---------- Theme ---------- */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', saved);
}

themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------- Data ---------- */
async function fetchAllCountries() {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error('Failed to load data.json');
  return res.json();
}

function formatNumber(n) {
  return new Intl.NumberFormat('en-US').format(n);
}

/* ---------- Home view ---------- */
function renderHome() {
  app.innerHTML = `
    <div class="controls">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.47 6.47 0 0 0 1.57-4.23 6.5 6.5 0 1 0-6.5 6.5 6.47 6.47 0 0 0 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>
        <input type="text" id="search-input" placeholder="Search for a country..." value="${currentSearch}" aria-label="Search for a country" />
      </div>
      <div class="filter-dropdown" id="filter-dropdown">
        <button class="filter-btn" id="filter-btn" type="button" aria-haspopup="listbox">
          <span id="filter-label">${currentRegion || 'Filter by Region'}</span>
          <svg width="14" height="9" viewBox="0 0 14 9"><path d="M1 1l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <ul class="filter-menu hidden" id="filter-menu" role="listbox">
          ${['Africa', 'Americas', 'Asia', 'Europe', 'Oceania']
            .map(
              (r) =>
                `<li role="option"><button type="button" data-region="${r}">${r}</button></li>`,
            )
            .join('')}
        </ul>
      </div>
    </div>
    <div class="grid" id="country-grid"></div>
  `;

  document.getElementById('search-input').addEventListener('input', (e) => {
    currentSearch = e.target.value;
    renderGrid();
  });

  const dropdown = document.getElementById('filter-dropdown');
  const filterBtn = document.getElementById('filter-btn');
  const filterMenu = document.getElementById('filter-menu');

  filterBtn.addEventListener('click', () => {
    filterMenu.classList.toggle('hidden');
    dropdown.classList.toggle('open');
  });

  filterMenu.querySelectorAll('button[data-region]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentRegion = btn.dataset.region;
      document.getElementById('filter-label').textContent = currentRegion;
      filterMenu.classList.add('hidden');
      dropdown.classList.remove('open');
      renderGrid();
    });
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      filterMenu.classList.add('hidden');
      dropdown.classList.remove('open');
    }
  });

  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('country-grid');
  if (!grid) return;

  let filtered = allCountries;

  // "Americas" region label maps to the data's "Americas" value already.
  if (currentRegion) {
    filtered = filtered.filter((c) => c.region === currentRegion);
  }
  if (currentSearch.trim()) {
    const q = currentSearch.trim().toLowerCase();
    filtered = filtered.filter((c) => c.name.toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="state-message">No countries match your search.</p>`;
    return;
  }

  grid.innerHTML = filtered
    .map(
      (c) => `
      <article class="card" data-code="${c.alpha3Code}" tabindex="0" role="button" aria-label="View details for ${c.name}">
        <img class="card-flag" src="${c.flags.svg || c.flags.png}" alt="Flag of ${c.name}" loading="lazy" />
        <div class="card-body">
          <h2>${c.name}</h2>
          <p><strong>Population:</strong> ${formatNumber(c.population)}</p>
          <p><strong>Region:</strong> ${c.region}</p>
          <p><strong>Capital:</strong> ${c.capital || 'N/A'}</p>
        </div>
      </article>`,
    )
    .join('');

  grid.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => renderDetail(card.dataset.code));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        renderDetail(card.dataset.code);
      }
    });
  });
}

/* ---------- Detail view ---------- */
function renderDetail(code) {
  const c = countryByCode.get(code);
  if (!c) {
    app.innerHTML = `<p class="state-message">Country not found.</p>`;
    return;
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  const currencies = c.currencies
    ? c.currencies.map((cur) => cur.name).join(', ')
    : 'N/A';
  const languages = c.languages
    ? c.languages.map((l) => l.name).join(', ')
    : 'N/A';
  const borderCountries = (c.borders || [])
    .map((code) => countryByCode.get(code))
    .filter(Boolean);

  app.innerHTML = `
    <button class="back-btn" id="back-btn" type="button">
      <svg width="18" height="14" viewBox="0 0 18 14"><path d="M1 7h16M1 7l6-6M1 7l6 6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
      Back
    </button>
    <div class="detail">
      <img class="detail-flag" src="${c.flags.svg || c.flags.png}" alt="Flag of ${c.name}" />
      <div class="detail-info">
        <h2>${c.name}</h2>
        <div class="detail-columns">
          <div class="col">
            <p><strong>Native Name:</strong> ${c.nativeName || c.name}</p>
            <p><strong>Population:</strong> ${formatNumber(c.population)}</p>
            <p><strong>Region:</strong> ${c.region}</p>
            <p><strong>Sub Region:</strong> ${c.subregion || 'N/A'}</p>
            <p><strong>Capital:</strong> ${c.capital || 'N/A'}</p>
          </div>
          <div class="col">
            <p><strong>Top Level Domain:</strong> ${c.topLevelDomain ? c.topLevelDomain.join(', ') : 'N/A'}</p>
            <p><strong>Currencies:</strong> ${currencies}</p>
            <p><strong>Languages:</strong> ${languages}</p>
          </div>
        </div>
        <div class="borders">
          ${
            borderCountries.length
              ? `<span>Border Countries:</span>
                 <div class="border-tags">
                   ${borderCountries
                     .map(
                       (b) =>
                         `<button class="tag" data-code="${b.alpha3Code}">${b.name}</button>`,
                     )
                     .join('')}
                 </div>`
              : `<span>No border countries</span>`
          }
        </div>
      </div>
    </div>
  `;

  document.getElementById('back-btn').addEventListener('click', renderHome);
  app.querySelectorAll('.tag[data-code]').forEach((btn) => {
    btn.addEventListener('click', () => renderDetail(btn.dataset.code));
  });
}

/* ---------- Init ---------- */
async function init() {
  initTheme();
  app.innerHTML = `<p class="state-message">Loading countries...</p>`;
  try {
    allCountries = await fetchAllCountries();
    allCountries.sort((a, b) => a.name.localeCompare(b.name));
    countryByCode = new Map(allCountries.map((c) => [c.alpha3Code, c]));
    renderHome();
  } catch (err) {
    app.innerHTML = `<p class="state-message">Couldn't load country data (data.json). Make sure you're running this through a local server, not opening the file directly.</p>`;
  }
}

init();
