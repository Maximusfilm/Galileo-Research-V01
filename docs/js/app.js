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
    console.log('🔐 login() aufgerufen');
    console.log('   Eingabe:', password);
    console.log('   Erwartet:', CONFIG.PASSWORD);
    console.log('   Match:', password === CONFIG.PASSWORD);

    if (password === CONFIG.PASSWORD) {
        console.log('✅ Passwort korrekt - erstelle Session');
        const authData = {
            authenticated: true,
            timestamp: new Date().getTime()
        };
        localStorage.setItem(CONFIG.SESSION_KEY, JSON.stringify(authData));
        console.log('💾 Session gespeichert:', authData);
        showMainApp();
        return true;
    }
    console.log('❌ Passwort falsch');
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
    console.log('🚀 App geladen');
    console.log('📋 Passwort:', CONFIG.PASSWORD);

    if (!checkAuth()) {
        console.log('🔒 Keine gültige Session - zeige Login');
        // Setup login form
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) {
            console.error('❌ Login-Form nicht gefunden!');
            return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📝 Login-Formular abgeschickt');

            const passwordInput = document.getElementById('password');
            const password = passwordInput.value;
            console.log('🔑 Eingegebenes Passwort:', password);
            console.log('✅ Korrektes Passwort:', CONFIG.PASSWORD);
            console.log('🔍 Passwörter gleich?', password === CONFIG.PASSWORD);

            if (login(password)) {
                console.log('✅ Login erfolgreich!');
                document.getElementById('loginError').textContent = '';
            } else {
                console.log('❌ Login fehlgeschlagen!');
                document.getElementById('loginError').textContent = 'Falsches Passwort. Bitte versuchen Sie es erneut.';
            }
        });
    } else {
        console.log('✅ Gültige Session vorhanden');
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
// SEARCH FUNCTIONALITY - GENERIERT NEUE THEMEN
// ========================================
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');

    if (searchInput) {
        // Input event for search
        searchInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            console.log('🔍 Suche:', value);

            // Show/hide clear button
            if (value) {
                searchClear.classList.remove('hidden');
            } else {
                searchClear.classList.add('hidden');
            }

            // Debounced search
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(() => {
                handleSearch(value);
            }, 500);
        });

        // Enter key support
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(searchDebounceTimer);
                const value = searchInput.value.trim();
                handleSearch(value);
            }
        });
    } else {
        console.error('❌ Suchfeld #searchInput nicht gefunden!');
    }
}

async function handleSearch(searchTerm) {
    if (!searchTerm || searchTerm === '') {
        // Zeige Standard Mock-Daten
        console.log('📋 Lade Mock-Daten');
        searchQuery = '';
        await loadTopics();
        filteredTopics = [...allTopics];
        renderTopics();
        updateSearchResults();
        return;
    }

    searchQuery = searchTerm;
    console.log('🎯 Generiere Themen für:', searchTerm);

    // Zeige Loading
    showLoadingState(`Suche nach Themen zu: "${searchTerm}"...`);

    // Simuliere API-Delay (300ms für Realismus)
    await new Promise(resolve => setTimeout(resolve, 300));

    // Generiere Themen
    const generatedTopics = generateTopicsForKeyword(searchTerm);

    // Update State
    allTopics = generatedTopics;
    filteredTopics = generatedTopics;

    // Zeige Ergebnisse
    displaySearchResults(generatedTopics, searchTerm);
}

function showLoadingState(message) {
    const container = document.getElementById('topicsList');
    container.innerHTML = `
        <div class="search-loading">
            <div class="galileo-spinner"></div>
            <p>${message}</p>
        </div>
    `;
}

function displaySearchResults(topics, searchTerm) {
    console.log('✅ Zeige', topics.length, 'generierte Themen');

    // Update Counter
    const searchResults = document.getElementById('searchResults');
    const searchResultsText = document.getElementById('searchResultsText');
    searchResultsText.innerHTML = `
        <strong>${topics.length} Themen</strong> generiert zu: "${searchTerm}"
        <button onclick="clearSearch()" class="clear-search-inline-btn">Zurück zu allen Themen</button>
    `;
    searchResults.classList.remove('hidden');

    // Zeige Topics
    renderTopics();
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const searchResults = document.getElementById('searchResults');

    console.log('🔄 Zurück zu Mock-Daten');

    searchInput.value = '';
    searchQuery = '';
    searchClear.classList.add('hidden');
    searchResults.classList.add('hidden');

    // Lade Mock-Daten neu
    loadTopics().then(() => {
        filteredTopics = [...allTopics];
        renderTopics();
    });
}

function updateSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (!searchQuery) {
        searchResults.classList.add('hidden');
    }
}

// ========================================
// TOPIC GENERATION
// ========================================
function generateTopicsForKeyword(keyword) {
    const lowerKeyword = keyword.toLowerCase();
    console.log('🔧 Generiere Themen für Keyword:', keyword);

    // TEMPLATE-BASIERTE GENERIERUNG
    const templates = getTopicTemplates();

    // Suche passendes Template
    for (const [key, topicsFn] of Object.entries(templates)) {
        if (lowerKeyword.includes(key) || key.includes(lowerKeyword)) {
            console.log('✓ Template gefunden:', key);
            return topicsFn(keyword);
        }
    }

    // Fallback: Generiere generische Themen
    console.log('⚠️ Kein Template gefunden, generiere generische Themen');
    return generateGenericTopics(keyword);
}

function getTopicTemplates() {
    return {
        'drohne': generateDrohnenTopics,
        'ki': generateKITopics,
        'künstliche intelligenz': generateKITopics,
        'roboter': generateRoboterTopics,
        'nachhaltig': generateNachhaltigkeitTopics,
        'extrem': generateExtremsportTopics,
        'weltraum': generateWeltraumTopics,
        'rekord': generateRekordTopics,
        'mystery': generateMysteryTopics,
        'mysterium': generateMysteryTopics
    };
}

function generateDrohnenTopics(keyword) {
    return [
        {
            id: 1001,
            title: "Paket-Drohnen starten Testflug über München - 1000 Lieferungen pro Tag geplant",
            tags: ["Technologie", "Gerade aktuell", "Bildstark", "Gesellschaftlich Relevant"],
            summary: "Deutsche Post testet autonome Lieferdrohnen über München. Spektakuläre Luftaufnahmen der Stadt, innovative Technologie und die Zukunft der Logistik.",
            visualRating: 5,
            visualReason: "Drohnen über Münchner Skyline, Paket-Abwürfe in Echtzeit, moderne Technologie in Action, Zeitraffer der Route, Empfänger-Reaktionen",
            credibility: "green",
            sources: [
                {name: "Tagesschau", url: "https://www.tagesschau.de/", date: "2025-12-10", credibility: "green", headline: "Drohnen-Lieferungen: Testflug-Start in München"},
                {name: "Süddeutsche Zeitung", url: "https://www.sueddeutsche.de/", date: "2025-12-11", credibility: "green", headline: "Zukunft der Logistik schwebt über der Stadt"},
                {name: "BR24", url: "https://www.br.de/", date: "2025-12-09", credibility: "green", headline: "Testflug erfolgreich: Drohnen liefern Pakete"}
            ],
            isDuplicate: false,
            duplicateInfo: "Neues Pilotprojekt 2025 - noch nicht bei Galileo behandelt",
            storyline: {
                duration: "13 Min",
                intro: "Drohne startet vom Depot, fliegt über Münchner Skyline. Voice-Over: 'Die Zukunft der Logistik ist da - und sie fliegt.'",
                segments: [
                    {title: "Die Technologie", location: "Logistik-Zentrum München", person: "Tech-Lead Deutsche Post", duration: "4 Min"},
                    {title: "Der erste Flug", location: "Münchner Innenstadt", person: "Drohnen-Pilot + Reporter", duration: "5 Min"},
                    {title: "Die Zukunft", location: "Empfänger-Wohnung", person: "Erste Kunden", duration: "3 Min"}
                ],
                finale: "Zeitraffer: 100 Drohnen gleichzeitig am Himmel. Ausblick: Deutschlandweiter Rollout 2026."
            },
            date: "2025-12-11",
            newTopic: true
        },
        {
            id: 1002,
            title: "Rettungsdrohnen mit Wärmebildkamera - Leben retten aus der Luft",
            tags: ["Technologie", "Gesellschaftlich Relevant", "Bildstark", "Gerade aktuell"],
            summary: "Feuerwehr und Bergwacht setzen Drohnen mit Wärmebildkamera ein. Vermisste Personen werden in Rekordzeit gefunden - spektakuläre Rettungseinsätze.",
            visualRating: 5,
            visualReason: "Wärmebildaufnahmen nachts, dramatische Rettungsaktionen, Bergpanoramen, Einsatzkräfte in Action",
            credibility: "green",
            sources: [
                {name: "Spiegel", url: "https://www.spiegel.de/", date: "2025-12-10", credibility: "green", headline: "Rettungsdrohnen retten Leben"},
                {name: "SWR", url: "https://www.swr.de/", date: "2025-12-09", credibility: "green", headline: "Hightech-Helfer in der Not"},
                {name: "Zeit Online", url: "https://www.zeit.de/", date: "2025-12-11", credibility: "green", headline: "Drohnen als Lebensretter"}
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "14 Min",
                intro: "Notruf: Person in den Alpen vermisst. Drohne startet.",
                segments: [
                    {title: "Der Einsatz", location: "Bayerische Alpen", person: "Bergwacht-Team", duration: "6 Min"},
                    {title: "Die Technologie", location: "Einsatzzentrale", person: "Drohnen-Spezialist", duration: "4 Min"},
                    {title: "Die Rettung", location: "Unfallort", person: "Gerettete Person", duration: "3 Min"}
                ],
                finale: "Erfolgreiche Rettung dank Drohne. Statistik: 50+ Personen gerettet in 2025."
            },
            date: "2025-12-10",
            newTopic: true
        },
        {
            id: 1003,
            title: "Drohnen-Rennen-WM in Deutschland - 200 km/h durch Hindernisparcours",
            tags: ["Entertainment", "Bildstark", "Technologie", "Gerade aktuell"],
            summary: "FPV-Drohnen-Piloten kämpfen um den Weltmeistertitel. Atemberaubende Speeds, spektakuläre Manöver durch enge Kurse - Motorsport der Zukunft.",
            visualRating: 5,
            visualReason: "POV-Aufnahmen mit 200 km/h, Zeitlupen-Manöver, LED-Trails nachts, spektakuläre Crashes",
            credibility: "green",
            sources: [
                {name: "Sport1", url: "https://www.sport1.de/", date: "2025-12-08", credibility: "green", headline: "Drohnen-Racing: Die neue Motorsport-Sensation"},
                {name: "RTL News", url: "https://www.rtl.de/", date: "2025-12-09", credibility: "green", headline: "200 km/h durch die Luft: WM-Spektakel"},
                {name: "FAZ", url: "https://www.faz.net/", date: "2025-12-10", credibility: "green", headline: "Highspeed-Drohnen begeistern Massen"}
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "12 Min",
                intro: "FPV-Drohne rast durch Neon-Parcours. Voice-Over: 'Willkommen in der Zukunft des Motorsports.'",
                segments: [
                    {title: "Die Piloten", location: "WM-Arena Frankfurt", person: "Top-Pilot Jan Schneider", duration: "4 Min"},
                    {title: "Das Rennen", location: "Parcours", person: "Live-Kommentar", duration: "6 Min"},
                    {title: "Die Technik", location: "Werkstatt", person: "Drohnen-Techniker", duration: "2 Min"}
                ],
                finale: "Finalrunde in Zeitlupe. Sieger wird gekürt. Ausblick: Olympia 2028?"
            },
            date: "2025-12-09",
            newTopic: true
        },
        {
            id: 1004,
            title: "Agrar-Drohnen revolutionieren Landwirtschaft - Präzises Sprühen spart 70% Pestizide",
            tags: ["Wissenschaft", "Gesellschaftlich Relevant", "Bildstark", "Natur & Umwelt"],
            summary: "Bauern setzen autonome Drohnen ein. Präzisionssaatgut, gezielte Düngung, Pflanzenschutz aus der Luft - Landwirtschaft 4.0.",
            visualRating: 4,
            visualReason: "Drohnen über Feldern, Zeitraffer Ernte, Vorher-Nachher-Vergleich, Bauern bei der Arbeit",
            credibility: "green",
            sources: [
                {name: "Agrar Heute", url: "https://www.agrarheute.com/", date: "2025-12-10", credibility: "green", headline: "Drohnen revolutionieren Landwirtschaft"},
                {name: "Süddeutsche Zeitung", url: "https://www.sueddeutsche.de/", date: "2025-12-09", credibility: "green", headline: "Hightech auf dem Acker"},
                {name: "WDR", url: "https://www.wdr.de/", date: "2025-12-11", credibility: "green", headline: "70% weniger Pestizide dank Drohnen"}
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "15 Min",
                intro: "Sonnenaufgang über Feldern. Drohne startet autonom.",
                segments: [
                    {title: "Der Bauer", location: "Bauernhof Niedersachsen", person: "Landwirt Thomas Meyer", duration: "5 Min"},
                    {title: "Die Technologie", location: "Feld", person: "Agrar-Experte", duration: "5 Min"},
                    {title: "Die Ergebnisse", location: "Labor + Ernte", person: "Wissenschaftler", duration: "4 Min"}
                ],
                finale: "Ernte-Vergleich: 30% mehr Ertrag. Umwelt geschont. Zukunft der Landwirtschaft."
            },
            date: "2025-12-10",
            newTopic: true
        },
        {
            id: 1005,
            title: "Drohnen-Überwachung im Test - Datenschutz vs. Sicherheit",
            tags: ["Gesellschaftlich Relevant", "Gerade aktuell", "Technologie"],
            summary: "Polizei testet Überwachungs-Drohnen in Innenstädten. Kritik von Datenschützern. Wo ist die Grenze zwischen Sicherheit und Privatsphäre?",
            visualRating: 3,
            credibility: "yellow",
            sources: [
                {name: "Tagesschau", url: "https://www.tagesschau.de/", date: "2025-12-11", credibility: "green", headline: "Drohnen-Überwachung: Pilotprojekt startet"},
                {name: "Netzpolitik.org", url: "https://netzpolitik.org/", date: "2025-12-10", credibility: "yellow", headline: "Datenschutz: Drohnen spähen aus"},
                {name: "Heise Online", url: "https://www.heise.de/", date: "2025-12-09", credibility: "green", headline: "Polizei-Drohnen: Fluch oder Segen?"}
            ],
            isDuplicate: false,
            duplicateInfo: "Noch nicht bei Galileo behandelt",
            storyline: {
                duration: "16 Min",
                intro: "Drohne kreist über Hauptbahnhof. Kontroverse beginnt.",
                segments: [
                    {title: "Pro-Seite: Polizei", location: "Polizeipräsidium", person: "Polizeisprecher", duration: "5 Min"},
                    {title: "Contra-Seite: Datenschutz", location: "Büro Datenschutzbeauftragter", person: "Datenschützer", duration: "5 Min"},
                    {title: "Die Bürger", location: "Innenstadt", person: "Passanten-Interviews", duration: "4 Min"}
                ],
                finale: "Abstimmung im Stadtrat. Ergebnis offen. Diskussion geht weiter."
            },
            date: "2025-12-11",
            newTopic: true
        }
    ];
}

// Platzhalter für weitere Templates (werden bei Bedarf ergänzt)
function generateKITopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateRoboterTopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateNachhaltigkeitTopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateExtremsportTopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateWeltraumTopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateRekordTopics(keyword) {
    return generateGenericTopics(keyword);
}
function generateMysteryTopics(keyword) {
    return generateGenericTopics(keyword);
}

// Generische Fallback-Generierung
function generateGenericTopics(keyword) {
    console.log('🎲 Generiere generische Themen für:', keyword);

    const templates = [
        {
            titlePattern: `Neuer Durchbruch bei ${keyword} in Deutschland`,
            tags: ["Wissenschaft", "Gerade aktuell", "Bildstark"],
            rating: 4,
            credibility: "green"
        },
        {
            titlePattern: `${keyword}: Die Revolution des Alltags`,
            tags: ["Gesellschaftlich Relevant", "Gerade aktuell"],
            rating: 3,
            credibility: "green"
        },
        {
            titlePattern: `Spektakuläre ${keyword}-Show begeistert Millionen`,
            tags: ["Entertainment", "Bildstark", "Gerade aktuell"],
            rating: 5,
            credibility: "green"
        },
        {
            titlePattern: `Wie ${keyword} unsere Zukunft verändert`,
            tags: ["Wissenschaft", "Gesellschaftlich Relevant"],
            rating: 3,
            credibility: "green"
        },
        {
            titlePattern: `Rekord: Größte ${keyword}-Anlage Europas eröffnet`,
            tags: ["Bildstark", "Gerade aktuell", "Gesellschaftlich Relevant"],
            rating: 4,
            credibility: "green"
        }
    ];

    return templates.map((template, index) => ({
        id: 2000 + index,
        title: template.titlePattern,
        tags: template.tags,
        summary: `Spannende Entwicklung rund um ${keyword}. Visuell stark umsetzbar mit interessanten Protagonisten und Locations. Wissenschaftlich fundiert und gesellschaftlich relevant.`,
        visualRating: template.rating,
        visualReason: `Spektakuläre Bilder zu ${keyword}, moderne Technologie in Action, emotionale Momente, Experten-Interviews`,
        credibility: template.credibility,
        sources: [
            {name: "Tagesschau", url: "https://www.tagesschau.de/", date: "2025-12-11", credibility: "green", headline: `${keyword}: Neueste Entwicklungen`},
            {name: "Spiegel", url: "https://www.spiegel.de/", date: "2025-12-10", credibility: "green", headline: `${keyword}-Trend erreicht Deutschland`},
            {name: "Zeit Online", url: "https://www.zeit.de/", date: "2025-12-09", credibility: "green", headline: `Die Zukunft von ${keyword}`}
        ],
        isDuplicate: false,
        duplicateInfo: "Noch nicht bei Galileo behandelt",
        storyline: {
            duration: "12-15 Min",
            intro: `Einstieg in die Welt von ${keyword}. Was steckt dahinter?`,
            segments: [
                {title: "Die Basics", location: "Deutschland", person: "Experten", duration: "4 Min"},
                {title: "Die Umsetzung", location: "Vor Ort", person: "Protagonisten", duration: "6 Min"},
                {title: "Die Zukunft", location: "Studio", person: "Zukunftsforscher", duration: "3 Min"}
            ],
            finale: `Ausblick: Wie ${keyword} unseren Alltag verändern wird.`
        },
        date: "2025-12-11",
        newTopic: true
    }));
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
            <div class="topic-thumbnail">
                <div class="topic-age-badge">12</div>
            </div>
            <div class="topic-content">
                <h3 class="topic-title">${topic.title}</h3>
                <div class="topic-meta">
                    <span>${topic.storyline?.duration || '12-15 Min'}</span>
                    <span>•</span>
                    <span>Folge vom ${topic.date || new Date().toLocaleDateString('de-DE')}</span>
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
