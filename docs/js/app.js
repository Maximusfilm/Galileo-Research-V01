// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
    PASSWORD: 'Sig1MpxP226KIT',
    SESSION_KEY: 'galileo_auth',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    DATA_URL: './data/topics-mock.json'
};

// ========================================
// GLOBAL STATE
// ========================================
let allTopics = [];
let filteredTopics = [];
let activeFilters = new Set();
let currentSort = 'relevance';
let searchQuery = '';
let searchDebounceTimer = null;

// ========================================
// AUTHENTICATION
// ========================================
function checkAuth() {
    const auth = localStorage.getItem(CONFIG.SESSION_KEY);
    if (auth) {
        const authData = JSON.parse(auth);
        const now = new Date().getTime();
        if (now - authData.timestamp < CONFIG.SESSION_DURATION) {
            showMainApp();
            return true;
        } else {
            localStorage.removeItem(CONFIG.SESSION_KEY);
        }
    }
    return false;
}

function login(password) {
    if (password === CONFIG.PASSWORD) {
        const authData = {
            authenticated: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(authData));
        showMainApp();
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem(CONFIG.SESSION_KEY);
    location.reload();
}

function showMainApp() {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    initApp();
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) {
        // Setup login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('password').value;
            if (login(password)) {
                document.getElementById('loginError').textContent = '';
            } else {
                document.getElementById('loginError').textContent = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
            }
        });
    }
});

async function initApp() {
    try {
        await loadTopics();
        renderFilters();
        renderTopics();
        updateLastUpdate();
        setupSearchListener();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        showError('Daten konnten nicht geladen werden. Bitte später erneut versuchen.');
    }
}

// ========================================
// DATA LOADING
// ========================================
async function loadTopics() {
    try {
        const response = await fetch(CONFIG.DATA_URL);
        if (!response.ok) {
            // Fallback: Mock-Daten wenn keine echten Daten vorhanden
            allTopics = generateMockData();
        } else {
            const data = await response.json();
            allTopics = data.topics || [];
        }
        filteredTopics = [...allTopics];
    } catch (error) {
        console.warn('Lade Mock-Daten:', error);
        allTopics = generateMockData();
        filteredTopics = [...allTopics];
    }
}

function generateMockData() {
    return [
        {
            id: 1,
            title: "Neue Quantencomputer-Durchbruch in München",
            tags: ["Wissenschaft", "Bildstark", "Gerade aktuell"],
            summary: "Forscher der TU München haben einen Durchbruch in der Quantencomputer-Technologie erzielt. Das Thema ist visuell stark umsetzbar durch die spektakulären Laboraufnahmen.",
            visualRating: 5,
            visualReason: "Spektakuläre Labor-Settings, futuristische Technologie, gut filmbare Experimente",
            credibility: "green",
            sources: [
                { name: "Nature", url: "#", credibility: "green" },
                { name: "Süddeutsche Zeitung", url: "#", credibility: "green" }
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "10-15 Minuten",
                structure: [
                    "Intro: Was sind Quantencomputer? (2 Min)",
                    "Hauptteil: Besuch im Labor der TU München (6 Min)",
                    "Experteninterviews: Was bedeutet der Durchbruch? (4 Min)",
                    "Finale: Auswirkungen auf unseren Alltag (2 Min)"
                ],
                locations: ["TU München Labor", "Quantencomputer-Anlage"],
                protagonists: ["Prof. Dr. Schmidt (TU München)", "Doktorand Max Müller"],
                dramaticArc: "Von der abstrakten Theorie zur greifbaren Zukunftstechnologie"
            },
            date: "2025-12-10"
        },
        {
            id: 2,
            title: "Vertikale Farmen erobern Berliner Dächer",
            tags: ["Gesellschaftlich Relevant", "Bildstark", "Wissenschaft"],
            summary: "Urban Farming erreicht neue Dimensionen: Auf Berliner Hochhausdächern entstehen hochmoderne vertikale Farmen, die ganzjährig frisches Gemüse produzieren.",
            visualRating: 5,
            visualReason: "Beeindruckende Drohnenaufnahmen, grüne Oasen in der Stadt, Zeitraffer-Aufnahmen des Pflanzenwachstums",
            credibility: "green",
            sources: [
                { name: "Der Spiegel", url: "#", credibility: "green" },
                { name: "rbb24", url: "#", credibility: "green" }
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "12-18 Minuten",
                structure: [
                    "Intro: Lebensmittelversorgung der Zukunft (2 Min)",
                    "Hauptteil: Besuch der vertikalen Farm (8 Min)",
                    "Vergleich: Traditionelle vs. vertikale Landwirtschaft (4 Min)",
                    "Finale: Verkostung und Ausblick (3 Min)"
                ],
                locations: ["Berliner Hochhaus-Dach", "Traditioneller Bauernhof zum Vergleich"],
                protagonists: ["Gründer der Urban Farm", "Traditioneller Landwirt", "Ernährungsexperte"],
                dramaticArc: "Vom Platzmangel zur innovativen Lösung - die Zukunft wächst nach oben"
            },
            date: "2025-12-09"
        },
        {
            id: 3,
            title: "Mysteriöse Lichterscheinung über Norddeutschland",
            tags: ["Gerade aktuell", "Bildstark", "Entertainment"],
            summary: "Tausende Menschen melden spektakuläre Lichterscheinungen am Nachthimmel. Astronomen haben eine überraschende Erklärung gefunden.",
            visualRating: 4,
            visualReason: "Beeindruckende Amateur-Videos, Nachtaufnahmen, Interview-Situationen mit Augenzeugen",
            credibility: "yellow",
            sources: [
                { name: "Tagesschau", url: "#", credibility: "green" },
                { name: "Reddit Deutschland", url: "#", credibility: "red" }
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "8-12 Minuten",
                structure: [
                    "Intro: Die mysteriösen Sichtungen (2 Min)",
                    "Hauptteil: Augenzeugen berichten (4 Min)",
                    "Aufklärung: Wissenschaftliche Erklärung (3 Min)",
                    "Finale: Weitere Phänomene am Himmel (2 Min)"
                ],
                locations: ["Norddeutsche Küste", "Planetarium Hamburg"],
                protagonists: ["Augenzeugen", "Astronom Dr. Weber", "Galileo Reporter vor Ort"],
                dramaticArc: "Von der Verwirrung zur Aufklärung - wenn Wissenschaft Rätsel löst"
            },
            date: "2025-12-11"
        }
    ];
}

// ========================================
// SEARCH FUNCTIONALITY
// ========================================
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
        // Input event for real-time search
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            console.log('🔍 Suche:', searchQuery);

            // Show/hide clear button
            if (searchQuery) {
                searchClear.classList.remove('hidden');
            } else {
                searchClear.classList.add('hidden');
            }

            // Debounced search
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                performSearch();
            }, 300);
        });

        // Enter key support
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(searchDebounceTimer);
                performSearch();
            }
        });
    } else {
        console.error('❌ Suchfeld #searchInput nicht gefunden!');
    }
}

function performSearch() {
    console.log('🔎 Führe Suche aus:', searchQuery);
    console.log('📊 Alle Themen:', allTopics.length);
    applyFilters();
    console.log('✅ Gefilterte Themen:', filteredTopics.length);
    renderTopics();
    updateSearchResults();
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchResults = document.getElementById('searchResults');

    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.add('hidden');
    searchResults.classList.add('hidden');

    performSearch();
}

function updateSearchResults() {
    const searchResults = document.getElementById('searchResults');
    const searchResultsText = document.getElementById('searchResultsText');

    if (searchQuery) {
        const total = allTopics.length;
        const found = filteredTopics.length;
        searchResultsText.textContent = `${found} von ${total} Themen gefunden`;
        searchResults.classList.remove('hidden');
    } else {
        searchResults.classList.add('hidden');
    }
}

function matchesSearch(topic) {
    if (!searchQuery) return true;

    // Split search query into words (OR logic between words)
    const searchTerms = searchQuery.split(' ').filter(term => term.length > 0);

    // Search in multiple fields
    const searchableText = [
        topic.title,
        topic.summary,
        topic.visualReason,
        ...topic.tags,
        ...topic.sources.map(s => s.headline || s.name)
    ].join(' ').toLowerCase();

    // Return true if ANY search term is found (OR logic)
    const matches = searchTerms.some(term => searchableText.includes(term));

    if (matches) {
        console.log('✓ Match:', topic.title);
    }

    return matches;
}

// ========================================
// FILTERING & SORTING
// ========================================
function getAllTags() {
    const tags = new Set();
    allTopics.forEach(topic => {
        topic.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

function toggleFilter(tag) {
    if (activeFilters.has(tag)) {
        activeFilters.delete(tag);
    } else {
        activeFilters.add(tag);
    }
    applyFilters();
    renderFilters();
    renderTopics();
}

function applyFilters() {
    // First filter by tags
    let topics = allTopics;

    if (activeFilters.size > 0) {
        topics = topics.filter(topic => {
            return Array.from(activeFilters).every(filter =>
                topic.tags.includes(filter)
            );
        });
    }

    // Then filter by search query
    if (searchQuery) {
        topics = topics.filter(topic => matchesSearch(topic));
    }

    filteredTopics = topics;
}

function clearFilters() {
    activeFilters.clear();
    applyFilters();
    renderFilters();
    renderTopics();
}

function sortTopics() {
    const sortSelect = document.getElementById('sortSelect');
    currentSort = sortSelect.value;

    switch (currentSort) {
        case 'relevance':
            filteredTopics.sort((a, b) => b.tags.length - a.tags.length);
            break;
        case 'date':
            filteredTopics.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'visual':
            filteredTopics.sort((a, b) => b.visualRating - a.visualRating);
            break;
    }

    renderTopics();
}

// ========================================
// RENDERING
// ========================================
function renderFilters() {
    const filterTagsContainer = document.getElementById('filterTags');
    const activeFiltersContainer = document.getElementById('activeFilters');

    const tags = getAllTags();

    filterTagsContainer.innerHTML = tags.map(tag => `
        <div class="tag ${activeFilters.has(tag) ? 'active' : ''}"
             onclick="toggleFilter('${tag}')"
             draggable="true">
            ${tag}
        </div>
    `).join('');

    if (activeFilters.size === 0) {
        activeFiltersContainer.innerHTML = '<span class="no-filters">Keine Filter aktiv</span>';
    } else {
        activeFiltersContainer.innerHTML = Array.from(activeFilters).map(tag => `
            <div class="tag active">${tag}</div>
        `).join('');
    }
}

function renderTopics() {
    const topicsListContainer = document.getElementById('topicsList');
    const topicsCountContainer = document.getElementById('topicsCount');

    topicsCountContainer.textContent = `${filteredTopics.length} ${filteredTopics.length === 1 ? 'Thema' : 'Themen'} gefunden`;

    if (filteredTopics.length === 0) {
        topicsListContainer.innerHTML = `
            <div class="loading">
                <p>Keine Themen gefunden. Versuchen Sie andere Filter oder Suchbegriffe.</p>
            </div>
        `;
        return;
    }

    topicsListContainer.innerHTML = filteredTopics.map(topic => `
        <div class="topic-card" data-credibility="${topic.credibility}" onclick="showTopicDetail(${topic.id})">
            <div class="topic-content">
                <div class="topic-header">
                    <h3 class="topic-title">${topic.title}</h3>
                    <div class="topic-badges">
                        <span class="badge badge-${topic.credibility}">
                            ${topic.credibility === 'green' ? '🟢' : topic.credibility === 'yellow' ? '🟡' : '🔴'}
                        </span>
                    </div>
                </div>
                <div class="topic-tags">
                    ${topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('')}
                </div>
                <p class="topic-summary">${topic.summary}</p>
                <div class="topic-meta">
                    <div class="visual-rating">
                        <span class="visual-stars">${'⭐'.repeat(topic.visualRating)}</span>
                        <span>${topic.visualRating}/5 Visuell</span>
                    </div>
                    <div class="duplicate-status ${topic.isDuplicate ? 'duplicate' : 'new'}">
                        ${topic.isDuplicate ? '⚠️ Bereits behandelt' : '✅ Neues Thema'}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showTopicDetail(topicId) {
    const topic = allTopics.find(t => t.id === topicId);
    if (!topic) return;

    const modal = document.getElementById('topicModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = topic.title;

    modalBody.innerHTML = `
        <div class="topic-detail">
            <div style="margin-bottom: 2rem;">
                <h3>🏷️ Schlagwörter</h3>
                <div class="topic-tags">
                    ${topic.tags.map(tag => `<span class="topic-tag">${tag}</span>`).join('')}
                </div>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3>📝 Zusammenfassung</h3>
                <p>${topic.summary}</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3>🎬 Visuelles Potenzial (${topic.visualRating}/5 ⭐)</h3>
                <p><strong>Begründung:</strong> ${topic.visualReason}</p>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3>📊 Seriosität & Quellen</h3>
                <ul style="list-style: none; padding: 0;">
                    ${topic.sources.map(source => `
                        <li style="margin-bottom: 0.5rem;">
                            ${source.credibility === 'green' ? '🟢' : source.credibility === 'yellow' ? '🟡' : '🔴'}
                            <a href="${source.url}" target="_blank" style="color: var(--galileo-blue);">${source.name}</a>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div style="margin-bottom: 2rem;">
                <h3>🎭 Storyline-Entwurf (${topic.storyline.duration})</h3>
                <div style="background: var(--bg-light); padding: 1.5rem; border-radius: 8px;">
                    <h4>Struktur:</h4>
                    <ol style="margin-bottom: 1rem;">
                        ${topic.storyline.structure.map(s => `<li>${s}</li>`).join('')}
                    </ol>

                    <h4>Drehorte:</h4>
                    <ul style="margin-bottom: 1rem;">
                        ${topic.storyline.locations.map(l => `<li>${l}</li>`).join('')}
                    </ul>

                    <h4>Protagonisten/Experten:</h4>
                    <ul style="margin-bottom: 1rem;">
                        ${topic.storyline.protagonists.map(p => `<li>${p}</li>`).join('')}
                    </ul>

                    <h4>Dramaturgischer Bogen:</h4>
                    <p style="font-style: italic;">${topic.storyline.dramaticArc}</p>
                </div>
            </div>

            <div>
                <h3>🔍 Duplikat-Check</h3>
                <p class="${topic.isDuplicate ? 'duplicate-status duplicate' : 'duplicate-status new'}">
                    ${topic.isDuplicate ? '⚠️' : '✅'} ${topic.duplicateInfo}
                </p>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');

    // Store current topic ID for export
    modal.dataset.topicId = topicId;
}

function closeModal() {
    document.getElementById('topicModal').classList.add('hidden');
}

// Close modal on background click
document.getElementById('topicModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'topicModal') {
        closeModal();
    }
});

// ========================================
// EXPORT FUNCTIONS
// ========================================
function exportTopicPDF() {
    const modal = document.getElementById('topicModal');
    const topicId = parseInt(modal.dataset.topicId);
    const topic = allTopics.find(t => t.id === topicId);

    if (!topic) return;

    // Hier würde eine echte PDF-Generierung stattfinden
    // Für jetzt: Zeige Alert
    alert(`PDF-Export für "${topic.title}" würde hier starten.\n\nIn der Produktionsversion würde hier ein vollständiges PDF mit allen Details generiert.`);

    // In Produktion: Bibliothek wie jsPDF verwenden
}

function shareToTeams() {
    const modal = document.getElementById('topicModal');
    const topicId = parseInt(modal.dataset.topicId);
    const topic = allTopics.find(t => t.id === topicId);

    if (!topic) return;

    // Hier würde Microsoft Teams Integration stattfinden
    alert(`Microsoft Teams Share für "${topic.title}" würde hier starten.\n\nIn der Produktionsversion würde dies das Thema direkt in einen Teams-Kanal posten.`);

    // In Produktion: Teams Webhook verwenden
}

async function refreshData() {
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = '🔄 Lädt...';

    try {
        await loadTopics();
        applyFilters();
        renderTopics();
        updateLastUpdate();

        // Animation für erfolgreiches Update
        btn.textContent = '✅ Aktualisiert';
        setTimeout(() => {
            btn.textContent = '🔄 Aktualisieren';
            btn.disabled = false;
        }, 2000);
    } catch (error) {
        btn.textContent = '❌ Fehler';
        setTimeout(() => {
            btn.textContent = '🔄 Aktualisieren';
            btn.disabled = false;
        }, 2000);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function updateLastUpdate() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    const now = new Date();
    const formatted = now.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    lastUpdateElement.textContent = `Letztes Update: ${formatted}`;
}

function showError(message) {
    const topicsListContainer = document.getElementById('topicsList');
    topicsListContainer.innerHTML = `
        <div class="loading">
            <p style="color: var(--danger-red);">❌ ${message}</p>
        </div>
    `;
}
