from __future__ import annotations

from typing import Any

MOCK_THREADS_POSTS = {
    "physics": [
        "Short challenge reels about motion and force are trending with strong student engagement.",
        "Creators are breaking down energy transfer with everyday examples and quick diagrams.",
        "Peer study groups are sharing problem-solving checklists for mechanics revision.",
    ],
    "math": [
        "Mental-math walkthroughs and algebra pattern drills are showing high repeat views.",
        "Students are posting graph interpretation tips tied to real classroom assessments.",
        "Exam-week discussion threads are pushing spaced repetition for formulas.",
    ],
    "chemistry": [
        "Reaction balancing explainers and quick stoichiometry hacks are trending this week.",
        "Micro-lab recap posts are connecting chemistry concepts to household materials.",
        "Students are asking for faster ways to review periodic patterns offline.",
    ],
    "general": [
        "Learning communities are favoring short concept recaps plus downloadable notes.",
        "Offline study kits and low-bandwidth revision packs are performing well.",
        "Students respond best to guided practice and visible progress markers.",
    ],
}


def fetch_threads_data(topic: str) -> list[dict[str, Any]]:
    normalized = topic.strip().lower() if topic else "general"
    feed = MOCK_THREADS_POSTS.get(normalized, MOCK_THREADS_POSTS["general"])
    return [
        {
            "text": text,
            "topic": normalized,
            "engagement_score": 100 - index * 9,
        }
        for index, text in enumerate(feed)
    ]

