// ========================================
// GOOGLE GEMINI API SERVICE
// ========================================
// Service für die Integration der Google Gemini API
// Sucht nach Galileo-Themen basierend auf einer Suchanfrage

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const STORAGE_KEY = 'galileo_gemini_api_key';

// ========================================
// API KEY MANAGEMENT
// ========================================

function getApiKey() {
    return localStorage.getItem(STORAGE_KEY);
}

function setApiKey(apiKey) {
    if (apiKey && apiKey.trim()) {
        localStorage.setItem(STORAGE_KEY, apiKey.trim());
        return true;
    }
    return false;
}

function clearApiKey() {
    localStorage.removeItem(STORAGE_KEY);
}

// ========================================
// MAIN SEARCH FUNCTION
// ========================================

async function searchGalileoTopics(searchQuery) {
    const apiKey = getApiKey();
    
    if (!apiKey) {
        throw new Error('Kein API-Key gefunden. Bitte geben Sie einen Google Gemini API-Key ein.');
    }

    console.log('■ Calling Google Gemini API...');
    console.log('🔍 Query:', searchQuery);

    const prompt = `Finde 5-7 aktuelle, visuell starke TV-Themen für das Galileo Wissenschaftsmagazin zum Thema: "${searchQuery}".

Für jedes Thema erstelle:
- title: Titel (max 100 Zeichen)
- tags: Array mit 3-5 Tags aus: ["Bildstark", "Entertainment", "Gerade aktuell", "Gesellschaftlich Relevant", "Natur & Umwelt", "Technologie", "Wissenschaft"]
- summary: 2-3 Sätze Zusammenfassung
- visualRating: Zahl von 1-5
- visualReason: Begründung für visuelle Stärke (1 Satz)
- sources: Array mit 2-3 Objekten {name: "Quellenname", url: "https://..."}
- date: Heutiges Datum im Format "YYYY-MM-DD"

Antworte NUR mit einem validen JSON-Array, ohne zusätzlichen Text:
[{"title": "...", "tags": [...], "summary": "...", "visualRating": 5, "visualReason": "...", "sources": [{"name": "...", "url": "..."}], "date": "2025-12-11"}]`;

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Fehler:', response.status, errorText);
            throw new Error(`Google Gemini API Fehler: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ API Response erhalten');
        
        // Extrahiere den Text aus der Gemini-Antwort
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            throw new Error('Ungültige Antwort von Google Gemini API');
        }
        
        const text = data.candidates[0].content.parts[0].text;
        console.log('📄 Gemini Response:', text.substring(0, 200) + '...');
        
        // Parse JSON aus der Antwort
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('❌ Konnte kein JSON-Array in der Antwort finden');
            throw new Error('Konnte keine Themen im JSON-Format finden');
        }
        
        const topics = JSON.parse(jsonMatch[0]);
        console.log(`✅ ${topics.length} Themen gefunden`);
        
        // Konvertiere zu internem Format
        return topics.map((topic, index) => ({
            id: Date.now() + index,
            title: topic.title,
            tags: topic.tags || [],
            summary: topic.summary,
            visualRating: topic.visualRating || 3,
            visualReason: topic.visualReason || '',
            credibility: 'green',
            sources: topic.sources || [],
            isDuplicate: false,
            duplicateInfo: 'Noch nicht bei Galileo behandelt',
            storyline: {
                duration: '10-15 Minuten',
                structure: [],
                locations: [],
                protagonists: [],
                dramaticArc: ''
            },
            date: topic.date || new Date().toISOString().split('T')[0]
        }));
        
    } catch (error) {
        console.error('❌ Fehler beim Aufruf der Google Gemini API:', error);
        throw error;
    }
}
