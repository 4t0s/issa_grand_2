from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATASETS_DIR = Path(__file__).resolve().parents[1] / "datasets"
DEFAULT_DATASET_PATH = DATASETS_DIR / "sample_dataset.json"
UPLOADED_DATASET_PATH = DATASETS_DIR / "uploaded_dataset.json"


def _load_dataset_modules() -> tuple[str, list[dict[str, Any]]]:
    dataset_path = UPLOADED_DATASET_PATH if UPLOADED_DATASET_PATH.exists() else DEFAULT_DATASET_PATH
    with dataset_path.open("r", encoding="utf-8") as file:
        dataset = json.load(file)
    return str(dataset.get("topic", "General")), dataset.get("modules", [])


def _bump_topic(scores: dict[str, float], topic: str, value: float) -> None:
    key = topic.strip().lower()
    if not key:
        return
    scores[key] = scores.get(key, 0) + value


def _title_case(topic: str) -> str:
    return " ".join(part.capitalize() for part in topic.split())


def generate_learning_path(
    profile: dict[str, Any],
    threads_data: list[dict[str, Any]],
    location_context: dict[str, Any],
) -> dict[str, Any]:
    topic_scores: dict[str, float] = {}
    weakest = str(profile.get("weakest_subject", "")).strip().lower()
    strongest = str(profile.get("strongest_subject", "")).strip().lower()
    interests = [str(item).strip().lower() for item in profile.get("interests", []) if str(item).strip()]
    grades = profile.get("grades", [])

    _bump_topic(topic_scores, weakest, 5)
    _bump_topic(topic_scores, strongest, 1)

    for interest in interests:
        _bump_topic(topic_scores, interest, 2)

    for grade_entry in grades:
        subject = str(grade_entry.get("subject", "")).strip().lower()
        score = float(grade_entry.get("grade", 0))
        if score < 70:
            _bump_topic(topic_scores, subject, 3)
        elif score < 80:
            _bump_topic(topic_scores, subject, 1.5)

    for post in threads_data:
        post_topic = str(post.get("topic", "")).strip().lower()
        _bump_topic(topic_scores, post_topic, 2)
        if weakest and weakest in str(post.get("text", "")).lower():
            _bump_topic(topic_scores, weakest, 1)

    for contextual_topic in location_context.get("context_topics", []):
        _bump_topic(topic_scores, str(contextual_topic), 2.5)

    ranked_topics = [
        _title_case(topic)
        for topic, _score in sorted(topic_scores.items(), key=lambda item: item[1], reverse=True)
    ]

    dataset_topic, dataset_modules = _load_dataset_modules()
    priority_modules: list[dict[str, Any]] = []

    for index, module in enumerate(dataset_modules):
        priority_modules.append(
            {
                "title": module.get("title", f"{dataset_topic} Module {index + 1}"),
                "topic": dataset_topic,
                "reason": "Local offline dataset aligned to the adaptive plan.",
                "content": module.get("content", "Placeholder content"),
                "video": module.get("video", "placeholder_url"),
                "offline_ready": True,
            }
        )

    for topic in ranked_topics[:3]:
        if topic.lower() == dataset_topic.lower():
            continue
        priority_modules.append(
            {
                "title": f"{topic} Rapid Reinforcement",
                "topic": topic,
                "reason": f"Ranked from weaknesses, social signals, and {location_context.get('region', 'local')} context.",
                "content": f"Adaptive drill set for {topic}.",
                "video": "placeholder_url",
                "offline_ready": True,
            }
        )

    download_queue = []
    for index, module in enumerate(priority_modules[:5]):
        download_queue.append(
            {
                "title": module["title"],
                "topic": module["topic"],
                "tier": "base" if index < 2 else "advanced",
                "status": "queued",
                "offline_ready": module["offline_ready"],
            }
        )

    return {
        "recommended_topics": ranked_topics[:5],
        "priority_modules": priority_modules[:5],
        "download_queue": download_queue,
    }
