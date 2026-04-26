const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const body = await response.json();
      message = body.detail || message;
    } catch {
      message = `${message} (${response.status})`;
    }
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  saveProfile(payload) {
    return request("/profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  generatePlan(payload) {
    return request("/generate_plan", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  uploadDataset(dataset) {
    return request("/upload_dataset", {
      method: "POST",
      body: JSON.stringify({ dataset }),
    });
  },
};

