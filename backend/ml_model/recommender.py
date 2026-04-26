from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from sklearn.dummy import DummyClassifier


class PlaceholderRecommender:
    def __init__(self) -> None:
        self.model = DummyClassifier(strategy="most_frequent")
        self.dataset: dict[str, Any] = {}
        self.is_trained = False
        self.topics: list[str] = []

    def load_dataset(self, path: str | Path) -> dict[str, Any]:
        dataset_path = Path(path)
        with dataset_path.open("r", encoding="utf-8") as file:
            return json.load(file)

    def train_model(self, dataset: dict[str, Any]) -> dict[str, Any]:
        self.dataset = dataset
        topic = str(dataset.get("topic", "General")).strip()
        modules = dataset.get("modules", [])
        self.topics = [topic]

        feature_rows: list[list[float]] = []
        labels: list[str] = []

        for module in modules:
            title = str(module.get("title", ""))
            content = str(module.get("content", ""))
            feature_rows.append([len(title), len(content), len(content.split())])
            labels.append(topic.lower())

        if feature_rows:
            self.model.fit(feature_rows, labels)
            self.is_trained = True
        else:
            self.is_trained = False

        return {
            "status": "placeholder_model_ready" if self.is_trained else "mock_mode",
            "topic": topic,
            "module_count": len(modules),
        }

    def predict(self, profile: dict[str, Any]) -> list[dict[str, Any]]:
        weakest = str(profile.get("weakest_subject", "")).strip().lower()
        strongest = str(profile.get("strongest_subject", "")).strip().lower()
        interests = [str(item).strip().lower() for item in profile.get("interests", []) if str(item).strip()]

        if not self.is_trained:
            return self._build_mock_recommendations(weakest, strongest, interests)

        ordered_topics: list[str] = []
        for topic in [weakest, *interests, strongest]:
            if topic and topic not in ordered_topics:
                ordered_topics.append(topic)

        dataset_topic = str(self.dataset.get("topic", "")).strip().lower()
        if dataset_topic and dataset_topic not in ordered_topics:
            ordered_topics.append(dataset_topic)

        return [
            {
                "topic": topic.title(),
                "confidence": round(max(0.58, 0.92 - index * 0.09), 2),
                "source": "placeholder-model",
            }
            for index, topic in enumerate(ordered_topics[:4])
        ]

    def _build_mock_recommendations(
        self,
        weakest: str,
        strongest: str,
        interests: list[str],
    ) -> list[dict[str, Any]]:
        ordered_topics: list[str] = []
        for topic in [weakest, *interests, strongest, "Foundational Review"]:
            normalized = topic.strip()
            if normalized and normalized.lower() not in [item.lower() for item in ordered_topics]:
                ordered_topics.append(normalized)

        return [
            {
                "topic": topic.title(),
                "confidence": round(max(0.55, 0.88 - index * 0.08), 2),
                "source": "mock-fallback",
            }
            for index, topic in enumerate(ordered_topics[:4])
        ]


MODEL = PlaceholderRecommender()


def load_dataset(path: str | Path) -> dict[str, Any]:
    return MODEL.load_dataset(path)


def train_model(dataset: dict[str, Any]) -> dict[str, Any]:
    return MODEL.train_model(dataset)


def predict(profile: dict[str, Any]) -> list[dict[str, Any]]:
    return MODEL.predict(profile)

