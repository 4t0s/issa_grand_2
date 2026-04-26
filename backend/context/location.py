from __future__ import annotations

from typing import Any


def get_user_location(lat: float | None = None, lng: float | None = None) -> dict[str, Any]:
    if lat is None or lng is None:
        return {
            "lat": 44.8488,
            "lng": 65.4823,
            "source": "mock-fallback",
        }

    return {
        "lat": lat,
        "lng": lng,
        "source": "browser-geolocation",
    }


def map_location_to_context(lat: float, lng: float) -> dict[str, Any]:
    if 42 <= lat <= 47 and 63 <= lng <= 79:
        return {
            "region": "Central Asia Learning Corridor",
            "context_topics": ["applied physics", "water systems", "space science"],
        }

    if lat > 47:
        return {
            "region": "Northern STEM Belt",
            "context_topics": ["energy systems", "climate data", "engineering math"],
        }

    return {
        "region": "Global Remote Cohort",
        "context_topics": ["digital literacy", "self-paced study", "systems thinking"],
    }

