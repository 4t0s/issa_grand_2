from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from context.location import get_user_location, map_location_to_context
from engine.planner import generate_learning_path
from integrations.threads import fetch_threads_data
from ml_model.recommender import load_dataset, predict, train_model

BASE_DIR = Path(__file__).resolve().parent
DATASETS_DIR = BASE_DIR / "datasets"
DEFAULT_DATASET_PATH = DATASETS_DIR / "sample_dataset.json"
UPLOADED_DATASET_PATH = DATASETS_DIR / "uploaded_dataset.json"
PROFILES_PATH = DATASETS_DIR / "profiles.json"


class Coordinates(BaseModel):
    lat: float
    lng: float


class GradeEntry(BaseModel):
    subject: str = Field(..., min_length=2)
    grade: float = Field(..., ge=0, le=100)


class StudentProfile(BaseModel):
    name: str = Field(default="Student", min_length=1)
    grades: list[GradeEntry] = Field(default_factory=list)
    strongest_subject: str = Field(..., min_length=2)
    weakest_subject: str = Field(..., min_length=2)
    interests: list[str] = Field(default_factory=list)


class ProfileRequest(StudentProfile):
    coordinates: Coordinates | None = None


class GeneratePlanRequest(StudentProfile):
    coordinates: Coordinates | None = None


class DatasetUploadRequest(BaseModel):
    dataset: dict[str, Any]


app = FastAPI(
    title="Context-Aware Adaptive Offline Learning Engine",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def ensure_storage() -> None:
    DATASETS_DIR.mkdir(parents=True, exist_ok=True)
    if not PROFILES_PATH.exists():
        PROFILES_PATH.write_text("[]", encoding="utf-8")


def read_active_dataset_path() -> Path:
    return UPLOADED_DATASET_PATH if UPLOADED_DATASET_PATH.exists() else DEFAULT_DATASET_PATH


def read_profiles() -> list[dict[str, Any]]:
    ensure_storage()
    with PROFILES_PATH.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_profiles(records: list[dict[str, Any]]) -> None:
    with PROFILES_PATH.open("w", encoding="utf-8") as file:
        json.dump(records, file, indent=2)


def serialize_profile(payload: ProfileRequest | GeneratePlanRequest) -> dict[str, Any]:
    return payload.model_dump(mode="json")


def build_location_context(coordinates: Coordinates | None) -> dict[str, Any]:
    raw_location = get_user_location(
        lat=coordinates.lat if coordinates else None,
        lng=coordinates.lng if coordinates else None,
    )
    context = map_location_to_context(raw_location["lat"], raw_location["lng"])
    return {**raw_location, **context}


def bootstrap_model() -> None:
    ensure_storage()
    dataset = load_dataset(read_active_dataset_path())
    train_model(dataset)


@app.on_event("startup")
def startup_event() -> None:
    bootstrap_model()


@app.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/profile")
def save_profile(request: ProfileRequest) -> dict[str, Any]:
    profile_payload = serialize_profile(request)
    records = read_profiles()
    record = {
        "profile_id": f"profile-{len(records) + 1}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        **profile_payload,
    }
    records.append(record)
    write_profiles(records)

    location_context = build_location_context(request.coordinates)

    return {
        "status": "stored",
        "profile_id": record["profile_id"],
        "profile": profile_payload,
        "location_context": location_context,
        "recommendations_preview": predict(profile_payload),
    }


@app.post("/upload_dataset")
def upload_dataset(request: DatasetUploadRequest) -> dict[str, Any]:
    dataset = request.dataset
    if "topic" not in dataset or "modules" not in dataset:
        raise HTTPException(status_code=400, detail="Dataset must include topic and modules fields.")

    DATASETS_DIR.mkdir(parents=True, exist_ok=True)
    with UPLOADED_DATASET_PATH.open("w", encoding="utf-8") as file:
        json.dump(dataset, file, indent=2)

    training_summary = train_model(dataset)

    return {
        "status": "dataset_uploaded",
        "saved_to": str(UPLOADED_DATASET_PATH.name),
        "training_summary": training_summary,
    }


@app.post("/generate_plan")
def generate_plan(request: GeneratePlanRequest) -> dict[str, Any]:
    profile_payload = serialize_profile(request)
    location_context = build_location_context(request.coordinates)
    topic = request.weakest_subject or request.strongest_subject
    threads_data = fetch_threads_data(topic)
    recommendations = predict(profile_payload)
    learning_path = generate_learning_path(profile_payload, threads_data, location_context)

    return {
        "profile": profile_payload,
        "location_context": location_context,
        "threads_data": threads_data,
        "recommendations": recommendations,
        "learning_path": learning_path,
        "progressive_steps": [
            "Analyzing profile",
            "Scanning Threads context",
            "Building learning plan",
            "Loading base modules",
            "Loading advanced modules",
        ],
    }

