# 🚀 GitHub Pages Setup Guide

Schritt-für-Schritt Anleitung zur Aktivierung von GitHub Pages für das Galileo Research Tool.

---

## ✅ Voraussetzungen

- Repository ist auf GitHub: `Maximusfilm/Galileo-Research-V01`
- Du hast Admin-Rechte für das Repository
- Der Code ist im `main` Branch

---

## 📋 Setup-Schritte

### 1. GitHub Pages aktivieren

1. Öffne das Repository auf GitHub: [https://github.com/Maximusfilm/Galileo-Research-V01](https://github.com/Maximusfilm/Galileo-Research-V01)

2. Klicke auf **Settings** (Zahnrad-Symbol oben rechts)

3. Scrolle im linken Menü zu **Pages**

4. Unter **Source**:
   - Wähle **Deploy from a branch**

5. Unter **Branch**:
   - Branch: **main**
   - Folder: **/docs**
   - Klicke **Save**

6. Warte 1-2 Minuten...

7. Die Website ist jetzt live unter:
   ```
   https://maximusfilm.github.io/Galileo-Research-V01/
   ```

---

### 2. GitHub Actions aktivieren

GitHub Actions sollten automatisch aktiviert sein. Falls nicht:

1. Gehe zu **Settings** → **Actions** → **General**

2. Unter **Actions permissions**:
   - Wähle **Allow all actions and reusable workflows**

3. Unter **Workflow permissions**:
   - Wähle **Read and write permissions**
   - ✅ Aktiviere **Allow GitHub Actions to create and approve pull requests**

4. Klicke **Save**

---

### 3. API-Keys konfigurieren (Optional)

Für erweiterte Funktionen:

1. Gehe zu **Settings** → **Secrets and variables** → **Actions**

2. Klicke **New repository secret**

3. Füge folgende Secrets hinzu:

   **OpenAI API Key:**
   - Name: `OPENAI_API_KEY`
   - Secret: `sk-...` (dein OpenAI API Key)

   **Anthropic API Key (Alternative):**
   - Name: `ANTHROPIC_API_KEY`
   - Secret: `sk-ant-...` (dein Claude API Key)

   **YouTube API Key:**
   - Name: `YOUTUBE_API_KEY`
   - Secret: `AIza...` (dein YouTube Data API Key)

---

### 4. Ersten Workflow-Run testen

1. Gehe zu **Actions**

2. Wähle **Daily Research Update**

3. Klicke **Run workflow** → **Run workflow**

4. Warte bis der Workflow durchgelaufen ist (grüner Haken ✅)

5. Überprüfe ob `docs/data/topics.json` aktualisiert wurde

---

### 5. Website testen

1. Öffne: [https://maximusfilm.github.io/Galileo-Research-V01/](https://maximusfilm.github.io/Galileo-Research-V01/)

2. Login mit Passwort: `Sig1MpxP226KIT`

3. Prüfe ob Themen angezeigt werden

---

## 🔧 Troubleshooting

### Website zeigt 404

**Problem:** GitHub Pages ist nicht korrekt konfiguriert

**Lösung:**
1. Überprüfe dass der Branch `main` ist
2. Überprüfe dass der Folder `/docs` ist
3. Warte 5 Minuten und versuche es erneut

### Workflow schlägt fehl

**Problem:** Permissions fehlen

**Lösung:**
1. Gehe zu **Settings** → **Actions** → **General**
2. Aktiviere **Read and write permissions**
3. Führe Workflow erneut aus

### Keine Daten auf der Website

**Problem:** `topics.json` fehlt oder ist leer

**Lösung:**
1. Führe Workflow manuell aus (siehe Schritt 4)
2. Oder führe lokal aus: `python scripts/main_research.py`
3. Committe und pushe die generierte `docs/data/topics.json`

---

## ✅ Erfolgreich eingerichtet!

Wenn alles funktioniert, solltest du:

- ✅ Die Website unter der GitHub Pages URL sehen
- ✅ Dich mit dem Passwort einloggen können
- ✅ 3 Beispiel-Themen sehen
- ✅ Den täglichen Workflow in Actions sehen

---

## 🎯 Nächste Schritte

1. **Anpassen**: Passwort in `docs/js/app.js` ändern
2. **API-Keys**: Für echte AI-Analyse hinzufügen
3. **Testen**: Manuell Workflow ausführen
4. **Warten**: Tägliches Update läuft ab jetzt automatisch um 7:00 Uhr

---

## 📞 Support

Bei Problemen:
- 📧 E-Mail: support@maximusfilm.de
- 📖 Dokumentation: [README.md](README.md)
- 🐛 Issues: [GitHub Issues](https://github.com/Maximusfilm/Galileo-Research-V01/issues)
