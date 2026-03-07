import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../screens/components/RegisterModal";

type Errors = { username?: string; pin?: string };

function isSixDigits(pin: string) {
  return /^[0-9]{6}$/.test(pin);
}

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [showRegister, setShowRegister] = useState(false);

  const todayText = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  }, []);

  function validate(): boolean {
    const next: Errors = {};
    if (!username.trim()) next.username = "Username is required.";
    if (!pin.trim()) next.pin = "PIN is required.";
    else if (!isSixDigits(pin.trim())) next.pin = "PIN must be exactly 6 digits.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    navigate("/dashboard", { state: { username: username.trim() } });
  }

  return (
    <div className="bg">
      <div className="topRight">
        <button className="btn btnDanger" onClick={() => window.careconnect.quitApp()}>
          ✕ Quit
        </button>
      </div>

      <div className="centerCard">
        <div className="logoCircle">♡</div>
        <h1 className="title">Care Connect</h1>
        <div className="subtitle">Your Personal Health Companion</div>

        <form className="form" onSubmit={onSubmit}>
          <label className="label">Username</label>
          <input
            className={`input ${errors.username ? "inputError" : ""}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <div className="hint">Username is not case sensitive</div>
          {errors.username && <div className="error">{errors.username}</div>}

          <label className="label" style={{ marginTop: 14 }}>PIN Number</label>
          <input
            className={`input ${errors.pin ? "inputError" : ""}`}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 6-digit PIN"
            inputMode="numeric"
            type="password"
          />
          <div className="hint">Enter your 6 digit PIN number</div>
          {errors.pin && <div className="error">{errors.pin}</div>}

          <button className="btn btnPrimary" type="submit" style={{ marginTop: 14 }}>
            Sign In
          </button>

          <div className="links">
            <span>Forgot your username or PIN? </span>
            <a href="#">Recover credentials</a>
          </div>
          <div className="links">
            <span>Don't have an account? </span>
            <button type="button" className="linkBtn" onClick={() => setShowRegister(true)}>
              Register Now
            </button>
          </div>

          <div className="infoBox">
            <strong>Welcome to Care Connect</strong>
            <div>Manage your medications, track symptoms, and stay connected with your care team.</div>
            <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>Today: {todayText}</div>
          </div>
        </form>
      </div>

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
        />
      )}
    </div>
  );
}