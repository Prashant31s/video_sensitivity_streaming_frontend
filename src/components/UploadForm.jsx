import { useState } from "react";

export function UploadForm({ onUpload, disabled }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", file);

    onUpload(formData);

    setTitle("");
    setDescription("");
    setCategory("General");
    setFile(null);
    event.target.reset();
  }

  return (
    <form className="panel upload-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <p className="eyebrow">Upload</p>
        <h3>Add a video for moderation and streaming</h3>
      </div>

      <label>
        <span>Title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Launch demo recording" />
      </label>

      <label>
        <span>Description</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="3" placeholder="Add context for reviewers" />
      </label>

      <label>
        <span>Category</span>
        <input value={category} onChange={(event) => setCategory(event.target.value)} />
      </label>

      <label>
        <span>Video File</span>
        <input type="file" accept="video/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
      </label>

      <button className="primary-button" disabled={disabled} type="submit">
        {disabled ? "Uploading..." : "Upload video"}
      </button>
    </form>
  );
}
