import { useState } from "react";

type Props = { onClose: () => void };
type Errors = { username?: string; email?: string; pin?: string; confirm?: string };

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function isSixDigits(pin: string) {
  return /^[0-9]{6}$/.test(pin);
}

export default function RegisterModal({ onClose }: Props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  function validate(): boolean {
    const next: Errors = {};
    if (!username.trim()) next.username = "Username is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!isEmail(email.trim())) next.email = "Enter a valid email.";
    if (!pin.trim()) next.pin = "PIN is required.";
    else if (!isSixDigits(pin.trim())) next.pin = "PIN must be 6 digits.";
    if (!confirm.trim()) next.confirm = "Confirm your PIN.";
    else if (confirm.trim() !== pin.trim()) next.confirm = "PINs do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onCreate() {
    if (!validate()) return;
    // demo behavior: close modal
    onClose();
  }

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalTitleRow">
          <div className="modalIcon">+</div>
          <div>
            <div className="modalTitle">Register New Account</div>
            <div className="modalSubtitle">Create your Care Connect account to get started.</div>
          </div>
        </div>

        <label className="label">Username</label>
        <input className={`input ${errors.username ? "inputError" : ""}`} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />
        {errors.username && <div className="error">{errors.username}</div>}

        <label className="label" style={{ marginTop: 10 }}>Email Address</label>
        <input className={`input ${errors.email ? "inputError" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your.email@example.com" />
        {errors.email && <div className="error">{errors.email}</div>}

        <label className="label" style={{ marginTop: 10 }}>Create PIN Number</label>
        <input className={`input ${errors.pin ? "inputError" : ""}`} value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Enter 6-digit PIN" type="password" inputMode="numeric" />
        {errors.pin && <div className="error">{errors.pin}</div>}

        <label className="label" style={{ marginTop: 10 }}>Confirm PIN Number</label>
        <input className={`input ${errors.confirm ? "inputError" : ""}`} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter 6-digit PIN" type="password" inputMode="numeric" />
        {errors.confirm && <div className="error">{errors.confirm}</div>}

        <div className="modalActions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btnSuccess" onClick={onCreate}>Create Account</button>
        </div>
      </div>
    </div>
  );
}