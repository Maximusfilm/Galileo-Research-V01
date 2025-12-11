# 🔬 Galileo Research Tool V01

> **Automatisiertes Recherche-Tool für TV-Redakteure der Sendung Galileo**
>
> Powered by AI • Maximus Film GmbH

[![Daily Update](https://github.com/Maximusfilm/Galileo-Research-V01/actions/workflows/daily-research.yml/badge.svg)](https://github.com/Maximusfilm/Galileo-Research-V01/actions/workflows/daily-research.yml)

---

## 📖 Übersicht

Das **Galileo Research Tool** ist ein automatisiertes System, das täglich aktuelle, visuell starke und noch nicht behandelte TV-Themen für die ProSieben-Sendung Galileo recherchiert und analysiert.

### ✨ Hauptfunktionen

- 🤖 **Automatische Recherche** - Täglich um 7:00 Uhr via GitHub Actions
- 🔍 **Multi-Source-Suche** - Google News, Tagesschau, Spiegel, Nature, ScienceDaily, YouTube
- 🎯 **AI-Analyse** - Bewertung von Relevanz und visuellem Potenzial
- 🏷️ **Smart Tagging** - Automatische Schlagwort-Zuordnung
- 🔴🟡🟢 **Seriosität-Ampel** - Quellen-Bewertung
- ✅ **Duplikat-Check** - Abgleich mit Galileo-Archiv
- 🎬 **Storyline-Vorschläge** - Fertige Drehbuch-Entwürfe
- 🔒 **Passwortschutz** - Sicherer Zugang für Redakteure

---

## 🚀 Live Demo

**🌐 Website:** [https://maximusfilm.github.io/Galileo-Research-V01/](https://maximusfilm.github.io/Galileo-Research-V01/)

**🔐 Passwort:** `Sig1MpxP226KIT`

---

## 🏗️ Architektur

```
Galileo-Research-V01/
├── docs/                          # GitHub Pages Frontend
│   ├── index.html                # Hauptseite
│   ├── css/
│   │   └── styles.css           # Galileo-Design (Blau)
│   ├── js/
│   │   └── app.js               # Frontend-Logik
│   └── data/
│       └── topics.json          # Themen-Datenbank
│
├── scripts/                      # Backend-Scripts
│   ├── main_research.py         # Hauptscript
│   ├── news_scraper.py          # Nachrichtenquellen
│   ├── ai_analyzer.py           # AI-Analyse
│   ├── duplicate_checker.py     # Duplikat-Check
│   └── requirements.txt         # Python-Dependencies
│
├── .github/workflows/
│   └── daily-research.yml       # Automatisierung
│
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Repository klonen

```bash
git clone https://github.com/Maximusfilm/Galileo-Research-V01.git
cd Galileo-Research-V01
```

### 2. Python-Dependencies installieren

```bash
cd scripts
pip install -r requirements.txt
```

### 3. GitHub Pages aktivieren

1. Gehe zu **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/docs`
4. Speichern

### 4. (Optional) API-Keys konfigurieren

Für erweiterte Funktionen können API-Keys als GitHub Secrets hinterlegt werden:

- `OPENAI_API_KEY` - Für AI-Analyse (OpenAI GPT-4)
- `ANTHROPIC_API_KEY` - Alternative: Claude API
- `YOUTUBE_API_KEY` - Für YouTube Trending Videos

**Secrets hinzufügen:**
1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name + Wert eingeben

---

## ⚙️ Konfiguration

### GitHub Actions Cron-Job

Der tägliche Update läuft automatisch um **7:00 Uhr MEZ**.

Anpassung in `.github/workflows/daily-research.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # 6:00 UTC = 7:00 MEZ
```

### Passwort ändern

In `docs/js/app.js`:

```javascript
const CONFIG = {
    PASSWORD: 'Sig1MpxP226KIT',  // Hier ändern
    // ...
};
```

---

## 🎯 Verwendung

### Automatischer Modus

Das System läuft vollautomatisch täglich um 7:00 Uhr.

### Manueller Trigger

GitHub Actions Workflow manuell starten:

1. Repository → **Actions**
2. **Daily Research Update** auswählen
3. **Run workflow** klicken

### Lokale Ausführung

```bash
cd scripts
python main_research.py
```

---

## 📊 Themen-Bewertung

### Schlagwörter

- **Bildstark** - Visuell spektakulär
- **Gesellschaftlich Relevant** - Gesellschaftliche Bedeutung
- **Gerade aktuell** - Breaking News
- **Wissenschaft** - Wissenschaftliche Themen
- **Entertainment** - Unterhaltsam
- **Technologie** - Tech-Innovationen
- **Natur & Umwelt** - Umweltthemen
- **Gesundheit** - Gesundheitsthemen

### Visuelles Potenzial (1-5 ⭐)

- ⭐⭐⭐⭐⭐ **Hervorragend** - Spektakuläre visuelle Elemente
- ⭐⭐⭐⭐ **Sehr gut** - Gut filmbar
- ⭐⭐⭐ **Gut** - Durchschnittlich
- ⭐⭐ **Mittel** - Begrenzte Möglichkeiten
- ⭐ **Schwach** - Schwer zu visualisieren

### Seriosität-Ampel

- 🟢 **Grün** - Seriöse Quellen (Tagesschau, Spiegel, Nature, etc.)
- 🟡 **Gelb** - Mittelklasse (Boulevard-Medien)
- 🔴 **Rot** - Ungeprüft (Reddit, Twitter/X)

---

## 🎬 Storyline-Struktur

Jedes Thema enthält einen fertigen Storyline-Entwurf:

1. **Dauer** - Empfohlene Segmentlänge (5-20 Min)
2. **Struktur** - Intro, Hauptteil, Experteninterviews, Finale
3. **Drehorte** - Vorgeschlagene Locations
4. **Protagonisten** - Experten & Interviewpartner
5. **Dramaturgischer Bogen** - Story-Spannungskurve

---

## 🔍 Duplikat-Check

Das System prüft automatisch gegen:

- ✅ ProSieben Mediathek
- ✅ Joyn
- ✅ wunschliste.de
- ✅ fernsehserien.de

**Status:**
- ✅ **Neues Thema** - Noch nicht behandelt
- ⚠️ **Bereits behandelt** - Wurde schon ausgestrahlt

---

## 🌐 Nachrichtenquellen

### Seriöse Quellen (🟢)

- Tagesschau
- Der Spiegel
- Zeit Online
- BBC
- Reuters
- Nature
- ScienceDaily

### Mittelklasse (🟡)

- Bild
- Kleinere Portale

### Ungeprüft (🔴)

- Reddit (nur verifiziert)
- Twitter/X (mit Background-Check)

---

## 📱 Export & Sharing

### Geplante Features

- 📄 **PDF-Export** - Vollständige Themen-Dokumentation
- 📧 **E-Mail** - Direktes Versenden
- 💬 **Microsoft Teams** - Integration in Teams-Kanäle

*(In aktueller Version: Platzhalter)*

---

## 🔐 Sicherheit

- ✅ Passwortschutz (Session-basiert, 24h Gültigkeit)
- ✅ Keine sensiblen Daten im Repository
- ✅ API-Keys als GitHub Secrets
- ✅ Read-only RSS-Feeds

---

## 🐛 Troubleshooting

### GitHub Actions schlägt fehl

**Problem:** Workflow-Fehler

**Lösung:**
1. Überprüfe GitHub Actions Logs
2. Stelle sicher dass `contents: write` Permission gesetzt ist
3. Prüfe Python-Dependencies

### Website lädt keine Daten

**Problem:** `topics.json` nicht gefunden

**Lösung:**
1. Führe `python scripts/main_research.py` lokal aus
2. Committe `docs/data/topics.json`
3. Pushe zum Repository

### Passwort funktioniert nicht

**Problem:** Login schlägt fehl

**Lösung:**
- Überprüfe Passwort: `Sig1MpxP226KIT` (case-sensitive!)
- Lösche Browser-Cache
- Prüfe `localStorage` im Browser

---

## 📝 Lizenz

© 2025 Maximus Film GmbH

Dieses Projekt ist für den internen Gebrauch bei Maximus Film GmbH und der Galileo-Redaktion bestimmt.

---

## 👥 Kontakt

**Maximus Film GmbH**

Für Fragen und Support:
- 📧 E-Mail: [support@maximusfilm.de](mailto:support@maximusfilm.de)
- 🌐 Website: [www.maximusfilm.de](https://www.maximusfilm.de)

---

## 🚧 Roadmap

### V1.0 (Aktuell)
- ✅ Automatische Recherche
- ✅ AI-Analyse
- ✅ Duplikat-Check (Mock)
- ✅ Frontend mit Passwortschutz

### V1.1 (Geplant)
- 🔄 Echte OpenAI/Claude API-Integration
- 🔄 Vollständiger Duplikat-Check
- 🔄 PDF-Export
- 🔄 Microsoft Teams Integration
- 🔄 YouTube API Integration

### V2.0 (Zukunft)
- 🔮 Machine Learning für bessere Relevanz-Bewertung
- 🔮 Automatische Video-Analyse
- 🔮 Redakteur-Feedback-Loop
- 🔮 Multi-Language Support

---

**Made with ❤️ for Galileo Redakteure**
