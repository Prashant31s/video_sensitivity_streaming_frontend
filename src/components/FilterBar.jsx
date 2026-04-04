export function FilterBar({ filters, onChange, onRefresh }) {
  return (
    <div className="panel filter-bar">
      <div className="section-heading compact">
        <p className="eyebrow">Library filters</p>
        <h3>Slice the moderation queue quickly</h3>
      </div>

      <div className="filter-grid">
        <label>
          <span>Search</span>
          <input value={filters.q} onChange={(event) => onChange("q", event.target.value)} placeholder="Search title or filename" />
        </label>

        <label>
          <span>Processing</span>
          <select value={filters.processingStatus} onChange={(event) => onChange("processingStatus", event.target.value)}>
            <option value="">All</option>
            <option value="uploaded">Uploaded</option>
            <option value="processing">Processing</option>
            <option value="ready">Ready</option>
            <option value="failed">Failed</option>
          </select>
        </label>

        <label>
          <span>Sensitivity</span>
          <select value={filters.sensitivityStatus} onChange={(event) => onChange("sensitivityStatus", event.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
          </select>
        </label>

        <label>
          <span>Category</span>
          <input value={filters.category} onChange={(event) => onChange("category", event.target.value)} placeholder="General" />
        </label>
      </div>

      <button className="ghost-button" onClick={onRefresh} type="button">
        Refresh list
      </button>
    </div>
  );
}
