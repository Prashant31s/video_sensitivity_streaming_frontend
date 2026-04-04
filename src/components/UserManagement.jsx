import { useState } from "react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "viewer"
};

export function UserManagement({ users, onCreateUser, busy }) {
  const [form, setForm] = useState(initialForm);

  function handleSubmit(event) {
    event.preventDefault();
    onCreateUser(form);
    setForm(initialForm);
  }

  return (
    <div className="panel admin-grid access-control-panel">
      <div>
        <div className="section-heading compact">
          <p className="eyebrow">Access Control</p>
          <h3>Provision tenant members</h3>
        </div>

        <form className="user-form" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} required />
          </label>
          <label>
            <span>Role</span>
            <select value={form.role} onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button className="primary-button" disabled={busy} type="submit">
            {busy ? "Creating..." : "Create user"}
          </button>
        </form>
      </div>

      <div>
        <div className="section-heading compact">
          <p className="eyebrow">Tenant Members</p>
          <h3>Current organization roster</h3>
        </div>

        <div className="user-list">
          {users.map((user) => (
            <div className="user-row" key={user.id}>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <span className="badge neutral">{user.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
