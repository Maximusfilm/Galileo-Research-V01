#!/usr/bin/env python3
"""
Duplicate Checker Service
Prüft ob Themen bereits bei Galileo behandelt wurden
"""

import requests
from typing import Dict, Any, List
from bs4 import BeautifulSoup
import re


class DuplicateCheckerService:
    """Service zum Prüfen von Duplikaten im Galileo-Archiv"""

    def __init__(self):
        """Initialisiert den Duplicate Checker"""
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

        # Quellen für Galileo-Episoden
        self.archive_sources = [
            {
                'name': 'Joyn Mediathek',
                'search_url': 'https://www.joyn.de/serien/galileo',
                'enabled': False  # Deaktiviert für Demo
            },
            {
                'name': 'wunschliste.de',
                'search_url': 'https://www.wunschliste.de/serie/galileo',
                'enabled': False  # Deaktiviert für Demo
            }
        ]

        # Mock-Datenbank bereits behandelter Themen
        self.mock_archive = [
            "klimawandel grundlagen",
            "elektroauto batterie",
            "künstliche intelligenz basics",
            "plastik im meer",
            "corona impfung",
            "schwarze löcher einführung"
        ]

    def check_topic(self, topic: Dict[str, Any]) -> Dict[str, Any]:
        """
        Prüft ob ein Thema bereits behandelt wurde

        Args:
            topic: Themen-Daten

        Returns:
            Duplikat-Status und Info
        """
        # Extrahiere Schlüsselwörter aus Titel
        keywords = self._extract_keywords(topic.get('title', ''))

        # Prüfe gegen Mock-Archiv
        is_duplicate = self._check_against_archive(keywords)

        if is_duplicate:
            return {
                'isDuplicate': True,
                'duplicateInfo': '⚠️ Ähnliches Thema wurde bereits bei Galileo behandelt'
            }
        else:
            return {
                'isDuplicate': False,
                'duplicateInfo': '✅ Noch nicht bei Galileo behandelt'
            }

    def _extract_keywords(self, title: str) -> List[str]:
        """
        Extrahiert Schlüsselwörter aus Titel

        Args:
            title: Titel des Themas

        Returns:
            Liste von Schlüsselwörtern
        """
        # Entferne Stoppwörter
        stop_words = [
            'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'für',
            'mit', 'von', 'zu', 'im', 'am', 'ist', 'sind', 'wird',
            'werden', 'kann', 'könnte', 'neue', 'neuer', 'neues'
        ]

        # Tokenisiere und filtere
        words = re.findall(r'\w+', title.lower())
        keywords = [w for w in words if w not in stop_words and len(w) > 3]

        return keywords

    def _check_against_archive(self, keywords: List[str]) -> bool:
        """
        Prüft Schlüsselwörter gegen Archiv

        Args:
            keywords: Liste von Schlüsselwörtern

        Returns:
            True wenn ähnliches Thema gefunden
        """
        # Einfache Ähnlichkeitsprüfung
        for archived_topic in self.mock_archive:
            archived_keywords = archived_topic.split()
            # Wenn 2+ gemeinsame Keywords: Potenzielles Duplikat
            common = set(keywords) & set(archived_keywords)
            if len(common) >= 2:
                return True

        return False

    def search_joyn_mediathek(self, query: str) -> List[Dict[str, Any]]:
        """
        Durchsucht Joyn Mediathek (erfordert Web-Scraping)

        Args:
            query: Suchbegriff

        Returns:
            Liste gefundener Episoden
        """
        # HINWEIS: In Produktion würde hier Web-Scraping oder API-Call erfolgen
        print(f"      ℹ️  Joyn-Suche würde hier '{query}' suchen")
        return []

    def search_wunschliste(self, query: str) -> List[Dict[str, Any]]:
        """
        Durchsucht wunschliste.de nach Galileo-Episoden

        Args:
            query: Suchbegriff

        Returns:
            Liste gefundener Episoden
        """
        # HINWEIS: In Produktion würde hier Web-Scraping erfolgen
        print(f"      ℹ️  Wunschliste-Suche würde hier '{query}' suchen")
        return []

    def build_archive_database(self) -> None:
        """
        Baut vollständige Archiv-Datenbank auf (einmalig)

        Würde in Produktion alle Galileo-Episoden crawlen und indexieren
        """
        print("📚 Baue Archiv-Datenbank auf...")
        print("   ℹ️  In Produktion würde hier das komplette Galileo-Archiv")
        print("      von Joyn, ProSieben Mediathek, wunschliste.de gecrawlt")
        print("      und in einer Datenbank indexiert werden.")


def test_checker():
    """Testfunktion"""
    checker = DuplicateCheckerService()

    test_topics = [
        {
            'title': 'Neue Erkenntnisse zum Klimawandel',
            'tags': ['Wissenschaft']
        },
        {
            'title': 'Quantencomputer Durchbruch in München',
            'tags': ['Wissenschaft', 'Technologie']
        }
    ]

    print("\n🔍 Teste Duplikat-Check:\n")
    for topic in test_topics:
        result = checker.check_topic(topic)
        print(f"Thema: {topic['title']}")
        print(f"Status: {result['duplicateInfo']}\n")


if __name__ == "__main__":
    test_checker()
