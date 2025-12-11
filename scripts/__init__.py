"""
Galileo Research Tool - Automatische Themenrecherche für TV-Redakteure

Dieses Paket enthält alle Module für die automatische Recherche,
Analyse und Bewertung von TV-Themen für die Sendung Galileo.
"""

__version__ = "1.0.0"
__author__ = "Maximus Film GmbH"
__email__ = "support@maximusfilm.de"

# Module exports
from .main_research import GalileoResearchTool
from .news_scraper import NewsScraperService
from .ai_analyzer import AIAnalyzerService
from .duplicate_checker import DuplicateCheckerService

__all__ = [
    'GalileoResearchTool',
    'NewsScraperService',
    'AIAnalyzerService',
    'DuplicateCheckerService',
]
