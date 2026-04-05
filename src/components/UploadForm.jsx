import { useState } from "react";

const MAX_VIDEO_SIZE_MB = 10;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

export function UploadForm({ onUpload, disabled }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);
  const [validationError, setValidationError] = useState("");

  function validateFile(nextFile) {
    if (!nextFile) {
      return "Video file is required.";
    }

    if (nextFile.size > MAX_VIDEO_SIZE_BYTES) {
      return `Video file must be ${MAX_VIDEO_SIZE_MB} MB or smaller.`;
    }

    return "";
  }

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    const nextError = validateFile(nextFile);

    setValidationError(nextError);

    if (nextError) {
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(nextFile);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextError = validateFile(file);

    if (nextError) {
      setValidationError(nextError);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("video", file);

    try {
      await onUpload(formData);

      setTitle("");
      setDescription("");
      setCategory("General");
      setFile(null);
      setValidationError("");
      event.target.reset();
    } catch (_error) {
      // Preserve the form values so the user can retry after fixing the issue.
    }
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
        <input type="file" accept="video/*" onChange={handleFileChange} required />
      </label>
      <p className="field-note">Maximum file size: {MAX_VIDEO_SIZE_MB} MB.</p>
      {validationError && <p className="error-text">{validationError}</p>}

      <button className="primary-button" disabled={disabled} type="submit">
        {disabled ? "Uploading..." : "Upload video"}
      </button>
    </form>
  );
}
