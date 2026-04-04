import { useEffect, useState } from "react";
import { AuthForm } from "./components/AuthForm.jsx";
import { FilterBar } from "./components/FilterBar.jsx";
import { UploadForm } from "./components/UploadForm.jsx";
import { UserManagement } from "./components/UserManagement.jsx";
import { VideoCard } from "./components/VideoCard.jsx";
import { VideoPlayer } from "./components/VideoPlayer.jsx";
import { api } from "./lib/api.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useSocket } from "./hooks/useSocket.js";

const emptyFilters = {
  q: "",
  processingStatus: "",
  sensitivityStatus: "",
  category: ""
};

function buildQueryString(filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export default function App() {
  const [session, setSession] = useLocalStorage("video-processing-session", null);
  const [mode, setMode] = useState("register");
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [creatingUser, setCreatingUser] = useState(false);

  const token = session?.token;
  const currentUser = session?.user;

  const connected = useSocket(token, (incomingVideo) => {
    setVideos((current) => {
      const existing = current.find((video) => video.id === incomingVideo.id);
      if (!existing) {
        return [incomingVideo, ...current];
      }

      return current.map((video) => (video.id === incomingVideo.id ? incomingVideo : video));
    });
  });

  async function refreshVideos() {
    if (!token) {
      return;
    }

    const response = await api.listVideos(token, buildQueryString(filters));
    setVideos(response.videos);
  }

  async function refreshUsers() {
    if (!token || currentUser?.role !== "admin") {
      return;
    }

    const response = await api.listUsers(token);
    setUsers(response.users);
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    refreshVideos().catch((err) => setError(err.message));
  }, [token, filters.q, filters.processingStatus, filters.sensitivityStatus, filters.category]);

  useEffect(() => {
    refreshUsers().catch((err) => setError(err.message));
  }, [token, currentUser?.role]);

  async function handleAuth(payload) {
    setBusy(true);
    setError("");

    try {
      const response = mode === "register" ? await api.register(payload) : await api.login(payload);
      setSession(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleUpload(formData) {
    setBusy(true);
    setError("");

    try {
      const response = await api.uploadVideo(token, formData);
      setVideos((current) => [response.video, ...current]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleQuickLabelToggle(video) {
    const nextLabel = video.sensitivityStatus === "flagged" ? "safe" : "flagged";

    try {
      const response = await api.updateVideo(token, video.id, {
        description: video.description,
        title: video.title,
        category: video.category,
        sensitivityStatus: nextLabel
      });
      setVideos((current) => current.map((item) => (item.id === video.id ? response.video : item)));
    } catch (err) {
      console.log("Error toggling label:", err);
      setError(err.message);
    }
  }

  async function handleCreateUser(payload) {
    setCreatingUser(true);
    setError("");

    try {
      await api.createUser(token, payload);
      await refreshUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreatingUser(false);
    }
  }

  function handleLogout() {
    setSession(null);
    setVideos([]);
    setUsers([]);
  }

  useEffect(() => {
    console.log("Socket connection status changed:", connected);
  }, [connected]);

  if (!session) {
    return (
      <main className="landing-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Video moderation workspace</p>
            <h1>Upload, classify, and stream media with tenant-aware controls.</h1>
            <p className="hero-text">
              This assignment-ready platform combines role-based uploads, live sensitivity processing, and secure playback in one dashboard.
            </p>

            <div className="mode-toggle">
              <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
                Register
              </button>
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
                Login
              </button>
            </div>
          </div>

          <AuthForm busy={busy} mode={mode} onSubmit={handleAuth} />
          {error && <p className="error-text">{error}</p>}
        </section>
      </main>
    );
  }
  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Organization {currentUser.organizationId}</p>
          <h1>Streaming and moderation dashboard</h1>
        </div>
        <div className="topbar-actions">
          <span className={`status-dot ${connected ? "online" : "offline"}`}>{connected ? "Live updates on" : "Socket offline"}</span>
          <span className="badge neutral">{currentUser.role}</span>
          <button className="ghost-button" onClick={handleLogout} type="button">
            Log out
          </button>
        </div>
      </header>

      {error && <p className="error-text">{error}</p>}

      {(currentUser.role === "editor" || currentUser.role === "admin") && (
        <UploadForm disabled={busy} onUpload={handleUpload} />
      )}

      <FilterBar
        filters={filters}
        onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onRefresh={() => refreshVideos().catch((err) => setError(err.message))}
      />

      <section className="video-grid">
        {videos.map((video) => (
          <VideoCard
            canEdit={currentUser.role !== "viewer"}
            key={video.id}
            onPlay={setSelectedVideo}
            onQuickFlagToggle={handleQuickLabelToggle}
            video={video}
          />
        ))}
      </section>

      {currentUser.role === "admin" && (
        <UserManagement busy={creatingUser} onCreateUser={handleCreateUser} users={users} />
      )}

      <VideoPlayer onClose={() => setSelectedVideo(null)} token={token} video={selectedVideo} />
    </main>
  );
}
