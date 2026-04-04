function formatBytes(bytes) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatDuration(seconds) {
  if (!seconds) {
    return "Duration pending";
  }

  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function VideoCard({ video, canEdit, onPlay, onQuickFlagToggle }) {
  const sensitivityBadgeClass = video.sensitivityStatus === "flagged" ? "flagged" : video.sensitivityStatus === "safe" ? "safe" : "pending";
  const streamStatus = video.processingStatus === "ready" ? "Stream ready" : "Preparing stream";
  const transcriptStatus = video.transcript ? "Transcript ready" : "No transcript";
  const optimizedSize = video.optimizedFileSize ? formatBytes(video.optimizedFileSize) : null;

  return (
    <article className="video-card">
      <div className="video-card-top">
        <div className="video-card-heading">
          <p className="video-title" title={video.title}>{video.title}</p>
          <p className="video-subtitle" title={video.originalName}>{video.originalName}</p>
        </div>
        <span className={`badge ${sensitivityBadgeClass}`}>{video.sensitivityStatus}</span>
      </div>

      <p className="video-description">{video.description || "No description added."}</p>

      <div className="video-card-metrics">
        <span className="video-pill">{video.category}</span>
        <span className="video-pill">{formatDuration(video.durationSeconds)}</span>
        <span className="video-pill">{streamStatus}</span>
        <span className="video-pill">{transcriptStatus}</span>
      </div>

      <div className="meta-row">
        <span>Original {formatBytes(video.fileSize)}</span>
        <span>{optimizedSize ? `Stream ${optimizedSize}` : "Stream file pending"}</span>
      </div>

      <div className="progress-group">
        <div className="progress-label-row">
          <span className="progress-status">{video.processingStatus}</span>
          <span>{video.processingProgress}%</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${video.processingProgress}%` }} />
        </div>
      </div>

      <div className="card-actions">
        <button className="primary-button" disabled={video.processingStatus !== "ready"} onClick={() => onPlay(video)} type="button">
          Stream
        </button>
        {canEdit && (
          <button className="ghost-button" onClick={() => onQuickFlagToggle(video)} type="button">
            Toggle label
          </button>
        )}
      </div>
    </article>
  );
}
