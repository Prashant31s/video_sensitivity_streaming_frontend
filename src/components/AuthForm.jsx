import { useState } from "react";

const defaultRegisterForm = {
  name: "",
  email: "",
  password: "",
  organizationId: ""
};

const defaultLoginForm = {
  email: "",
  password: ""
};

export function AuthForm({ mode, onSubmit, busy }) {
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [loginForm, setLoginForm] = useState(defaultLoginForm);

  const isRegister = mode === "register";

  function updateForm(field, value) {
    if (isRegister) {
      setRegisterForm((current) => ({ ...current, [field]: value }));
      return;
    }

    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(isRegister ? registerForm : loginForm);
  }

  return (
    <form className="panel auth-panel" onSubmit={handleSubmit}>
      <div className="auth-title-group">
        <p className="eyebrow">{isRegister ? "Create workspace access" : "Welcome back"}</p>
        <h2>{isRegister ? "Set up your tenant and start reviewing videos." : "Log in to manage your streaming queue."}</h2>
      </div>

      {isRegister && (
        <label>
          <span>Name</span>
          <input value={registerForm.name} onChange={(event) => updateForm("name", event.target.value)} required />
        </label>
      )}

      <label>
        <span>Email</span>
        <input type="email" value={isRegister ? registerForm.email : loginForm.email} onChange={(event) => updateForm("email", event.target.value)} required />
      </label>

      <label>
        <span>Password</span>
        <input type="password" value={isRegister ? registerForm.password : loginForm.password} onChange={(event) => updateForm("password", event.target.value)} required />
      </label>

      {isRegister && (
        <label>
          <span>Organization ID</span>
          <input value={registerForm.organizationId} onChange={(event) => updateForm("organizationId", event.target.value)} required />
        </label>
      )}

      <button className="primary-button" disabled={busy} type="submit">
        {busy ? "Working..." : isRegister ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
