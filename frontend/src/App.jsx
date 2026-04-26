import { startTransition, useDeferredValue, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { AppShell } from "./components/AppShell";
import { api } from "./lib/api";
import { AnalysisPage } from "./pages/AnalysisPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { ProfilePage } from "./pages/ProfilePage";

const STORAGE_KEY = "adaptive-learning-offline-session";

const progressSteps = [
  {
    id: "profile",
    label: "Analyzing profile",
    helper: "Normalizing grades, strengths, weaknesses, and student interests.",
    message: "Profile ingested. Translating academic signals into a structured recommendation context.",
  },
  {
    id: "threads",
    label: "Scanning Threads context",
    helper: "Sampling relevant mocked social posts around the weakest subject.",
    message: "Threads-style activity is being scanned to detect what peer communities are emphasizing.",
  },
  {
    id: "planner",
    label: "Building learning plan",
    helper: "Combining local profile weights with context-aware topic scoring.",
    message: "Planner is ranking the next modules by urgency, relevance, and likely engagement.",
  },
  {
    id: "base",
    label: "Loading base modules",
    helper: "Preparing the fastest offline-capable lesson pack for immediate use.",
    message: "Base offline modules are being queued first so the dashboard can open without waiting.",
  },
  {
    id: "advanced",
    label: "Loading advanced modules",
    helper: "Staging deeper material in the background for continued progression.",
    message: "Advanced modules are entering the background queue and will appear once the local cache settles.",
  },
];

const sleep = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function getBrowserCoordinates() {
  if (!("geolocation" in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 3000, maximumAge: 120000 },
    );
  });
}

function parseStoredSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [sessionData, setSessionData] = useState(() => parseStoredSession());
  const [analysisState, setAnalysisState] = useState({
    activeIndex: 0,
    progress: 0,
    messages: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [advancedReady, setAdvancedReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const deferredQueue = useDeferredValue(sessionData?.learning_path?.download_queue || []);

  useEffect(() => {
    if (screen !== "dashboard" || !sessionData?.learning_path) {
      return undefined;
    }

    setAdvancedReady(false);
    const timer = window.setTimeout(() => setAdvancedReady(true), 1800);
    return () => window.clearTimeout(timer);
  }, [screen, sessionData]);

  async function handleProfileSubmit(profile) {
    setSubmitting(true);
    setErrorMessage("");
    setAnalysisState({ activeIndex: 0, progress: 0, messages: [] });
    setScreen("analysis");

    try {
      const coordinates = await getBrowserCoordinates();
      const payload = { ...profile, coordinates };

      await api.saveProfile(payload);
      const planPromise = api.generatePlan(payload);

      for (let index = 0; index < progressSteps.length; index += 1) {
        const step = progressSteps[index];
        setAnalysisState((current) => ({
          activeIndex: index,
          progress: ((index + 1) / progressSteps.length) * 100,
          messages: [...current.messages, step.message],
        }));
        await sleep(index === progressSteps.length - 1 ? 900 : 700);
      }

      const result = await planPromise;
      const storedSession = {
        ...result,
        generated_at: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSession));

      startTransition(() => {
        setSessionData(storedSession);
        setScreen("dashboard");
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to build a learning plan.");
      setScreen("profile");
    } finally {
      setSubmitting(false);
    }
  }

  function resumeCachedSession() {
    const cachedSession = parseStoredSession();
    if (!cachedSession) {
      return;
    }

    setSessionData(cachedSession);
    setScreen("dashboard");
  }

  function restartFlow() {
    setScreen("profile");
  }

  function renderScreen() {
    if (screen === "landing") {
      return (
        <LandingPage
          key="landing"
          onStart={() => setScreen("profile")}
          onResume={resumeCachedSession}
          cachedSessionAvailable={Boolean(sessionData)}
        />
      );
    }

    if (screen === "profile") {
      return (
        <ProfilePage
          key="profile"
          onSubmit={handleProfileSubmit}
          submitting={submitting}
          errorMessage={errorMessage}
        />
      );
    }

    if (screen === "analysis") {
      return (
        <AnalysisPage
          key="analysis"
          steps={progressSteps}
          activeIndex={analysisState.activeIndex}
          progress={analysisState.progress}
          messages={analysisState.messages}
        />
      );
    }

    if (screen === "dashboard" && sessionData) {
      return (
        <DashboardPage
          key="dashboard"
          sessionData={sessionData}
          advancedReady={advancedReady}
          deferredQueue={deferredQueue}
          onRestart={restartFlow}
        />
      );
    }

    return (
      <LandingPage
        key="landing-fallback"
        onStart={() => setScreen("profile")}
        onResume={resumeCachedSession}
        cachedSessionAvailable={Boolean(sessionData)}
      />
    );
  }

  return (
    <AppShell screen={screen} cachedSessionAvailable={Boolean(sessionData)} onHome={() => setScreen("landing")}>
      <AnimatePresence mode="wait">{renderScreen()}</AnimatePresence>
    </AppShell>
  );
}
