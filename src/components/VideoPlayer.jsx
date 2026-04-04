import { api } from "../lib/api.js";

export function VideoPlayer({ token, video, onClose }) {
  if (!video) {
    return null;
  }

  return (
    <div className="modal-shell" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Streaming preview</p>
            <h3>{video.title}</h3>
          </div>
          <button className="ghost-button" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <video
          className="video-player"
          controls
          src={`${api.apiUrl}/api/videos/${video.id}/stream?token=${token}`}
        />
      </div>
    </div>
  );
}
