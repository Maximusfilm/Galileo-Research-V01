// ========================================
// PERPLEXITY API SERVICE
// ========================================

/**
 * Service für die Integration der Perplexity API
 * Sucht nach Galileo-Themen basierend auf einer Suchanfrage
 */

const PERPLEXITY_CONFIG = {
    API_URL: 'https://api.perplexity.ai/chat/completions',
    MODEL: 'llama-3.1-sonar-small-128k-online',
    API_KEY_STORAGE: 'galileo_perplexity_api_key'
};

/**
 * Holt den API-Key aus dem localStorage
 * @returns {string|null} Der API-Key oder null
 */
function getApiKey() {
    return localStorage.getItem(PERPLEXITY_CONFIG.API_KEY_STORAGE);
}

/**
 * Speichert den API-Key im localStorage
 * @param {string} apiKey - Der zu speichernde API-Key
 */
function setApiKey(apiKey) {
    if (apiKey && apiKey.trim()) {
        localStorage.setItem(PERPLEXITY_CONFIG.API_KEY_STORAGE, apiKey.trim());
        return true;
    }
    return false;
}

/**
 * Entfernt den API-Key aus dem localStorage
 */
function clearApiKey() {
    localStorage.removeItem(PERPLEXITY_CONFIG.API_KEY_STORAGE);
}

/**
 * Erstellt den Prompt für die Perplexity API
 * @param {string} searchQuery - Die Suchanfrage des Users
 * @returns {string} Der formatierte Prompt
 */
function createGalileoPrompt(searchQuery) {
    return `Finde 5-7 aktuelle, visuell starke TV-Themen für das Galileo Wissenschaftsmagazin zum Thema: ${searchQuery}.

Für jedes Thema erstelle:
- Titel (max 100 Zeichen)
- 5 relevante Schlagwörter aus: Bildstark, Entertainment, Gerade aktuell, Gesellschaftlich Relevant, Natur & Umwelt, Technologie, Wissenschaft
- Zusammenfassung (2-3 Sätze)
- Visuelles Potenzial Bewertung (1-5) mit Begründung
- 2-3 seriöse Quellen mit URLs
- Aktuelles Datum

Antworte NUR mit einem JSON-Array im folgenden Format (ohne zusätzlichen Text):
[
  {
    "title": "Titel des Themas",
    "tags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"],
    "summary": "Zusammenfassung des Themas in 2-3 Sätzen.",
    "visualRating": 5,
    "visualReason": "Begründung für die visuelle Stärke",
    "sources": [
      {"name": "Quellenname 1", "url": "https://example.com"},
      {"name": "Quellenname 2", "url": "https://example.com"}
    ],
    "date": "YYYY-MM-DD"
  }
]`;
}

/**
 * Ruft die Perplexity API auf
 * @param {string} searchQuery - Die Suchanfrage
 * @returns {Promise<Array>} Array mit Themen
 * @throws {Error} Bei API-Fehlern
 */
async function callPerplexityAPI(searchQuery) {
    const apiKey = getApiKey();

    if (!apiKey) {
        throw new Error('NO_API_KEY');
    }

    const prompt = createGalileoPrompt(searchQuery);

    const requestBody = {
        model: PERPLEXITY_CONFIG.MODEL,
        messages: [
            {
                role: 'system',
                content: 'Du bist ein Experte für TV-Themen und Wissenschaftsjournalismus. Du antwortest immer im exakten JSON-Format.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.7,
        max_tokens: 4000
    };

    console.log('🔄 Calling Perplexity API...');

    try {
        const response = await fetch(PERPLEXITY_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('INVALID_API_KEY');
            } else if (response.status === 429) {
                throw new Error('RATE_LIMIT');
            } else {
                throw new Error(`API_ERROR: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        console.log('✅ Perplexity API Response:', data);

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('INVALID_RESPONSE');
        }

        const content = data.choices[0].message.content;

        // Parse JSON aus der Antwort
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('NO_JSON_IN_RESPONSE');
        }

        const topics = JSON.parse(jsonMatch[0]);
        return topics;

    } catch (error) {
        console.error('❌ Perplexity API Error:', error);
        throw error;
    }
}

/**
 * Konvertiert Perplexity Topics in das Galileo Format
 * @param {Array} perplexityTopics - Topics von der API
 * @returns {Array} Topics im Galileo Format
 */
function convertToGalileoFormat(perplexityTopics) {
    return perplexityTopics.map((topic, index) => {
        // Determine credibility based on sources
        let credibility = 'yellow';
        if (topic.sources && topic.sources.length >= 2) {
            credibility = 'green';
        }

        return {
            id: Date.now() + index, // Unique ID
            title: topic.title || 'Unbekanntes Thema',
            tags: topic.tags || ['Gerade aktuell'],
            summary: topic.summary || '',
            visualRating: Math.min(5, Math.max(1, parseInt(topic.visualRating) || 3)),
            visualReason: topic.visualReason || 'Visuelle Begründung nicht verfügbar',
            credibility: credibility,
            sources: (topic.sources || []).map(source => ({
                name: source.name || 'Unbekannte Quelle',
                url: source.url || '#',
                credibility: credibility
            })),
            isDuplicate: false,
            duplicateInfo: 'Noch nicht bei Galileo behandelt',
            storyline: {
                duration: '10-15 Minuten',
                structure: [
                    'Intro: Themenvorstellung (2 Min)',
                    'Hauptteil: Kerninhalt (6 Min)',
                    'Experteninterviews (4 Min)',
                    'Finale: Zusammenfassung (2 Min)'
                ],
                locations: ['Vor Ort', 'Studio'],
                protagonists: ['Reporter', 'Experten'],
                dramaticArc: 'Von der Frage zur Antwort - Galileo deckt auf'
            },
            date: topic.date || new Date().toISOString().split('T')[0]
        };
    });
}

/**
 * Hauptfunktion: Sucht Galileo Topics über die Perplexity API
 * @param {string} searchQuery - Die Suchanfrage
 * @returns {Promise<Object>} Objekt mit success, topics und ggf. error
 */
async function searchGalileoTopics(searchQuery) {
    try {
        // Validierung
        if (!searchQuery || searchQuery.trim().length === 0) {
            return {
                success: false,
                error: 'EMPTY_QUERY',
                topics: []
            };
        }

        // API Key Check
        const apiKey = getApiKey();
        if (!apiKey) {
            return {
                success: false,
                error: 'NO_API_KEY',
                topics: []
            };
        }

        // API Call
        const perplexityTopics = await callPerplexityAPI(searchQuery);

        // Konvertierung
        const galileoTopics = convertToGalileoFormat(perplexityTopics);

        console.log('✅ Generated topics:', galileoTopics);

        return {
            success: true,
            topics: galileoTopics,
            count: galileoTopics.length
        };

    } catch (error) {
        console.error('❌ Search error:', error);

        return {
            success: false,
            error: error.message,
            topics: []
        };
    }
}

// Export für die Verwendung in anderen Dateien
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchGalileoTopics,
        getApiKey,
        setApiKey,
        clearApiKey
    };
}
