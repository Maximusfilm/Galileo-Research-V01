#!/usr/bin/env python3
"""
AI Analyzer Service
Analysiert Artikel auf Galileo-Relevanz und visuelles Potenzial
"""

import os
import json
from typing import Dict, Any, List, Optional
import random


class AIAnalyzerService:
    """Service für AI-basierte Analyse von Artikeln"""

    def __init__(self):
        """
        Initialisiert den AI-Analyzer

        HINWEIS: In Produktion würde hier die OpenAI API oder Claude API
        verwendet werden. Erfordert API-Key in Umgebungsvariable:
        - OPENAI_API_KEY oder
        - ANTHROPIC_API_KEY
        """
        self.api_key = os.getenv('OPENAI_API_KEY') or os.getenv('ANTHROPIC_API_KEY')

        if not self.api_key:
            print("      ⚠️  Kein API-Key gefunden - verwende Mock-Modus")
            self.mock_mode = True
        else:
            self.mock_mode = False
            # In Produktion: OpenAI/Claude Client initialisieren
            # from openai import OpenAI
            # self.client = OpenAI(api_key=self.api_key)

        # Galileo-Schlagwörter
        self.available_tags = [
            "Bildstark",
            "Gesellschaftlich Relevant",
            "Gerade aktuell",
            "Wissenschaft",
            "Entertainment",
            "Technologie",
            "Natur & Umwelt",
            "Gesundheit",
            "Psychologie",
            "Mysterium",
            "Experiment",
            "Innovation",
            "Trend",
            "Ungewöhnlich",
            "Spektakulär"
        ]

        # Kriterien für visuelle Stärke
        self.visual_criteria = {
            'high': [
                'Experiment',
                'Physisches Phänomen',
                'Spektakulärer Ort',
                'Sichtbarer Prozess',
                'Action',
                'Natur-Spektakel',
                'Technologie zum Anfassen'
            ],
            'low': [
                'Nur Gespräche',
                'Abstrakte Theorie',
                'Büro-Setting',
                'Keine visuellen Elemente'
            ]
        }

    def analyze_article(self, article: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Analysiert einen Artikel auf Galileo-Tauglichkeit

        Args:
            article: Artikel-Daten (title, summary, source, etc.)

        Returns:
            Analysiertes Thema oder None wenn nicht relevant
        """
        if self.mock_mode:
            return self._mock_analysis(article)
        else:
            return self._real_ai_analysis(article)

    def _mock_analysis(self, article: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Mock-Analyse für Testing ohne API-Key

        Args:
            article: Artikel-Daten

        Returns:
            Mock-Analyseergebnis
        """
        # Zufällige Relevanz (70% relevant)
        relevance = random.randint(1, 10)
        if relevance < 4:
            return None  # Nicht relevant genug

        # Generiere Mock-Daten
        num_tags = random.randint(2, 5)
        tags = random.sample(self.available_tags, num_tags)
        visual_rating = random.randint(3, 5)

        topic = {
            'id': random.randint(1000, 9999),
            'title': article.get('title', 'Unbekanntes Thema'),
            'tags': tags,
            'summary': self._generate_mock_summary(article),
            'visualRating': visual_rating,
            'visualReason': self._generate_visual_reason(visual_rating),
            'credibility': article.get('credibility', 'yellow'),
            'sources': [
                {
                    'name': article.get('source', 'Unbekannte Quelle'),
                    'url': article.get('link', '#'),
                    'credibility': article.get('credibility', 'yellow')
                }
            ],
            'isDuplicate': False,  # Wird später vom DuplicateChecker gesetzt
            'duplicateInfo': 'Noch nicht geprüft',
            'storyline': self._generate_storyline(article),
            'date': article.get('published', '2025-12-11'),
            'galileo_relevance': relevance
        }

        return topic

    def _real_ai_analysis(self, article: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Echte AI-Analyse mit OpenAI/Claude API

        Args:
            article: Artikel-Daten

        Returns:
            AI-Analyseergebnis
        """
        # HINWEIS: Implementierung für Produktion
        #
        # prompt = f'''
        # Analysiere folgenden Artikel für die TV-Sendung Galileo:
        #
        # Titel: {article['title']}
        # Zusammenfassung: {article['summary']}
        #
        # Bewerte:
        # 1. Galileo-Relevanz (1-10)
        # 2. Schlagwörter (aus: {', '.join(self.available_tags)})
        # 3. Visuelles Potenzial (1-5 Sterne)
        # 4. Warum ist das Thema visuell stark/schwach?
        # 5. Story-Vorschlag (5-20 Min)
        #
        # Galileo-Kriterien:
        # - Wissensvermittlung unterhaltsam
        # - Visuell filmbar
        # - Gesellschaftlich relevant oder unterhaltsam
        # - Für breites Publikum interessant
        #
        # Antworte im JSON-Format.
        # '''
        #
        # response = self.client.chat.completions.create(
        #     model="gpt-4",
        #     messages=[{"role": "user", "content": prompt}],
        #     response_format={"type": "json_object"}
        # )
        #
        # return json.loads(response.choices[0].message.content)

        # Fallback auf Mock wenn API nicht verfügbar
        return self._mock_analysis(article)

    def _generate_mock_summary(self, article: Dict[str, Any]) -> str:
        """Generiert Mock-Zusammenfassung"""
        templates = [
            f"Dieses Thema ist hochaktuell und visuell stark umsetzbar. {article.get('summary', '')[:200]}",
            f"Perfekt für Galileo: Wissenschaft trifft Entertainment. {article.get('summary', '')[:200]}",
            f"Gesellschaftlich relevantes Thema mit großem visuellen Potenzial. {article.get('summary', '')[:200]}"
        ]
        return random.choice(templates)

    def _generate_visual_reason(self, rating: int) -> str:
        """Generiert Begründung für visuelle Bewertung"""
        if rating >= 4:
            reasons = [
                "Spektakuläre visuelle Elemente, gut filmbare Experimente, beeindruckende Locations",
                "Physisch beobachtbare Prozesse, Action-reich, visuell faszinierend",
                "Hervorragende Dreh-Möglichkeiten, spektakuläre Settings, visuell einprägsam"
            ]
        else:
            reasons = [
                "Begrenzte visuelle Möglichkeiten, hauptsächlich Interviews",
                "Abstrakte Thematik, schwer zu visualisieren",
                "Visuell eher schwach, benötigt kreative Umsetzung"
            ]
        return random.choice(reasons)

    def _generate_storyline(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Generiert Storyline-Vorschlag"""
        durations = ["8-12 Minuten", "10-15 Minuten", "12-18 Minuten"]

        return {
            'duration': random.choice(durations),
            'structure': [
                "Intro: Thema vorstellen (2 Min)",
                "Hauptteil: Vor Ort Reportage (6-10 Min)",
                "Experteneinschätzung (2-3 Min)",
                "Finale: Fazit und Ausblick (2 Min)"
            ],
            'locations': [
                "Hauptdrehort",
                "Experteninterview-Location"
            ],
            'protagonists': [
                "Protagonist/Betroffener",
                "Experte zum Thema",
                "Galileo Reporter"
            ],
            'dramaticArc': "Von der Neugier zur Erkenntnis - eine spannende Entdeckungsreise"
        }


def test_analyzer():
    """Testfunktion"""
    analyzer = AIAnalyzerService()

    test_article = {
        'title': 'Wissenschaftler entdecken neue Galaxie',
        'summary': 'Astronomen haben eine bisher unbekannte Galaxie entdeckt, die überraschende Eigenschaften aufweist.',
        'source': 'ScienceDaily',
        'link': 'https://example.com',
        'credibility': 'green',
        'published': '2025-12-10'
    }

    result = analyzer.analyze_article(test_article)

    if result:
        print("\n✅ Analyse erfolgreich:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("\n❌ Artikel nicht relevant genug")


if __name__ == "__main__":
    test_analyzer()
