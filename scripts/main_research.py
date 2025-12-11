#!/usr/bin/env python3
"""
Galileo Research Tool - Main Research Script
Automatische Recherche und Analyse von TV-Themen für Galileo
"""

import json
import os
from datetime import datetime, timedelta
from typing import List, Dict, Any
import sys

# Import local modules
from news_scraper import NewsScraperService
from ai_analyzer import AIAnalyzerService
from duplicate_checker import DuplicateCheckerService


class GalileoResearchTool:
    """Hauptklasse für das automatisierte Recherche-Tool"""

    def __init__(self):
        self.news_scraper = NewsScraperService()
        self.ai_analyzer = AIAnalyzerService()
        self.duplicate_checker = DuplicateCheckerService()

        # Basis-Schlagwörter für Galileo
        self.base_tags = [
            "Bildstark",
            "Gesellschaftlich Relevant",
            "Gerade aktuell",
            "Wissenschaft",
            "Entertainment"
        ]

        # Suchthemen für Galileo
        self.search_topics = [
            "wissenschaftlicher Durchbruch",
            "neue Technologie",
            "spektakuläres Phänomen",
            "gesellschaftlicher Trend",
            "ungewöhnliche Erfindung",
            "beeindruckendes Experiment",
            "mysteriöses Ereignis",
            "innovative Lösung",
            "faszinierende Natur",
            "unbekannte Orte"
        ]

    def run(self) -> None:
        """Hauptfunktion: Führt komplette Recherche durch"""
        print("=" * 60)
        print("GALILEO RESEARCH TOOL - AUTOMATISCHE RECHERCHE")
        print("=" * 60)
        print(f"Start: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}")
        print()

        # Schritt 1: Nachrichtenquellen durchsuchen
        print("📰 Schritt 1: Durchsuche Nachrichtenquellen...")
        raw_articles = self.news_scraper.fetch_all_sources(
            topics=self.search_topics,
            days_back=14  # Fokus auf letzte 2 Wochen
        )
        print(f"   ✅ {len(raw_articles)} Artikel gefunden\n")

        # Schritt 2: AI-Analyse durchführen
        print("🤖 Schritt 2: AI-Analyse der Artikel...")
        analyzed_topics = []
        for article in raw_articles:
            analysis = self.ai_analyzer.analyze_article(article)
            if analysis and analysis.get('galileo_relevance', 0) >= 7:
                analyzed_topics.append(analysis)

        print(f"   ✅ {len(analyzed_topics)} relevante Themen identifiziert\n")

        # Schritt 3: Duplikat-Check
        print("🔍 Schritt 3: Duplikat-Check mit Galileo-Archiv...")
        unique_topics = []
        for topic in analyzed_topics:
            duplicate_status = self.duplicate_checker.check_topic(topic)
            topic.update(duplicate_status)
            unique_topics.append(topic)

        new_topics_count = sum(1 for t in unique_topics if not t.get('isDuplicate', False))
        print(f"   ✅ {new_topics_count} neue Themen (nicht behandelt)\n")

        # Schritt 4: Sortieren nach Relevanz
        print("📊 Schritt 4: Sortiere nach Relevanz...")
        sorted_topics = sorted(
            unique_topics,
            key=lambda t: (len(t.get('tags', [])), t.get('visualRating', 0)),
            reverse=True
        )
        print(f"   ✅ {len(sorted_topics)} Themen sortiert\n")

        # Schritt 5: Speichern
        print("💾 Schritt 5: Speichere Ergebnisse...")
        self.save_results(sorted_topics)
        print("   ✅ Daten gespeichert\n")

        print("=" * 60)
        print(f"✅ ERFOLGREICH ABGESCHLOSSEN")
        print(f"Ende: {datetime.now().strftime('%d.%m.%Y %H:%M:%S')}")
        print(f"Gesamt: {len(sorted_topics)} Themen, davon {new_topics_count} neu")
        print("=" * 60)

    def save_results(self, topics: List[Dict[str, Any]]) -> None:
        """Speichert die Ergebnisse als JSON"""
        output_data = {
            "lastUpdate": datetime.now().isoformat(),
            "topics": topics
        }

        # Pfad zur Output-Datei
        output_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "docs",
            "data",
            "topics.json"
        )

        # Stelle sicher, dass Verzeichnis existiert
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        # Speichern
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f, ensure_ascii=False, indent=2)

        print(f"   📄 Gespeichert: {output_path}")


def main():
    """Entry Point"""
    try:
        tool = GalileoResearchTool()
        tool.run()
        sys.exit(0)
    except Exception as e:
        print(f"❌ FEHLER: {str(e)}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
