#!/usr/bin/env python3
"""
News Scraper Service
Durchsucht verschiedene Nachrichtenquellen nach relevanten Themen
"""

import requests
import feedparser
from datetime import datetime, timedelta
from typing import List, Dict, Any
from bs4 import BeautifulSoup


class NewsScraperService:
    """Service zum Scrapen von Nachrichtenquellen"""

    def __init__(self):
        self.sources = {
            # Grüne Quellen (Seriös)
            'green': [
                {
                    'name': 'Tagesschau',
                    'rss': 'https://www.tagesschau.de/xml/rss2/',
                    'credibility': 'green'
                },
                {
                    'name': 'Der Spiegel',
                    'rss': 'https://www.spiegel.de/schlagzeilen/index.rss',
                    'credibility': 'green'
                },
                {
                    'name': 'Zeit Online',
                    'rss': 'https://newsfeed.zeit.de/index',
                    'credibility': 'green'
                },
                {
                    'name': 'ScienceDaily',
                    'rss': 'https://www.sciencedaily.com/rss/all.xml',
                    'credibility': 'green'
                }
            ],
            # Gelbe Quellen (Mittel)
            'yellow': [
                {
                    'name': 'Bild',
                    'rss': 'https://www.bild.de/rssfeeds/vw-home/vw-home-16725562,view=rss2.bild.xml',
                    'credibility': 'yellow'
                }
            ]
        }

        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'GalileoResearchBot/1.0 (Educational Purpose)'
        })

    def fetch_all_sources(self, topics: List[str], days_back: int = 14) -> List[Dict[str, Any]]:
        """
        Durchsucht alle konfigurierten Quellen

        Args:
            topics: Liste von Suchbegriffen
            days_back: Wie viele Tage zurück suchen

        Returns:
            Liste von gefundenen Artikeln
        """
        all_articles = []
        cutoff_date = datetime.now() - timedelta(days=days_back)

        print(f"   🔍 Durchsuche Quellen (letzte {days_back} Tage)...")

        # Grüne Quellen
        for source in self.sources['green']:
            try:
                articles = self._fetch_rss_feed(source, cutoff_date)
                all_articles.extend(articles)
                print(f"      ✓ {source['name']}: {len(articles)} Artikel")
            except Exception as e:
                print(f"      ✗ {source['name']}: Fehler ({str(e)})")

        # Gelbe Quellen
        for source in self.sources['yellow']:
            try:
                articles = self._fetch_rss_feed(source, cutoff_date)
                all_articles.extend(articles)
                print(f"      ✓ {source['name']}: {len(articles)} Artikel")
            except Exception as e:
                print(f"      ✗ {source['name']}: Fehler ({str(e)})")

        return all_articles

    def _fetch_rss_feed(self, source: Dict[str, str], cutoff_date: datetime) -> List[Dict[str, Any]]:
        """
        Holt Artikel aus einem RSS-Feed

        Args:
            source: Quellen-Konfiguration
            cutoff_date: Ältestes erlaubtes Datum

        Returns:
            Liste von Artikeln
        """
        articles = []

        try:
            feed = feedparser.parse(source['rss'])

            for entry in feed.entries[:50]:  # Max 50 pro Quelle
                # Parse Datum
                published = None
                if hasattr(entry, 'published_parsed'):
                    published = datetime(*entry.published_parsed[:6])
                elif hasattr(entry, 'updated_parsed'):
                    published = datetime(*entry.updated_parsed[:6])

                # Überspringe zu alte Artikel
                if published and published < cutoff_date:
                    continue

                # Extrahiere Daten
                article = {
                    'title': entry.get('title', ''),
                    'summary': entry.get('summary', ''),
                    'link': entry.get('link', ''),
                    'published': published.isoformat() if published else None,
                    'source': source['name'],
                    'credibility': source['credibility']
                }

                articles.append(article)

        except Exception as e:
            raise Exception(f"RSS-Feed-Fehler: {str(e)}")

        return articles

    def search_google_news(self, query: str, days_back: int = 7) -> List[Dict[str, Any]]:
        """
        Durchsucht Google News (erfordert API-Key in Produktion)

        Args:
            query: Suchbegriff
            days_back: Wie viele Tage zurück

        Returns:
            Liste von Artikeln
        """
        # HINWEIS: In Produktion würde hier die Google News API verwendet
        # Für jetzt: Placeholder
        print(f"      ℹ️  Google News API würde hier '{query}' suchen")
        return []

    def search_youtube_trending(self, category: str = 'all') -> List[Dict[str, Any]]:
        """
        Holt YouTube Trending Videos (erfordert API-Key)

        Args:
            category: Video-Kategorie

        Returns:
            Liste von Videos
        """
        # HINWEIS: In Produktion würde hier die YouTube Data API verwendet
        # Erfordert API-Key: https://developers.google.com/youtube/v3
        print(f"      ℹ️  YouTube API würde hier Trending Videos holen")
        return []


def test_scraper():
    """Testfunktion"""
    scraper = NewsScraperService()
    articles = scraper.fetch_all_sources(
        topics=["wissenschaft", "technologie"],
        days_back=7
    )
    print(f"\nGesamt: {len(articles)} Artikel gefunden")

    # Zeige erste 3
    for i, article in enumerate(articles[:3], 1):
        print(f"\n{i}. {article['title']}")
        print(f"   Quelle: {article['source']} ({article['credibility']})")
        print(f"   Link: {article['link']}")


if __name__ == "__main__":
    test_scraper()
