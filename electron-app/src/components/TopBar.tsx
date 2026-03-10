import { useState } from "react";
import TextSizeModal from "../screens/components/TextSizeModal";
import { useUiScale } from "../state/uiScale";

const AUTH_KEY = "careconnect.authenticated";

type Props = {
  onLogout: () => void;
  onQuit: () => void;
};

export default function TopBar({ onLogout, onQuit }: Props) {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const { highContrast, setHighContrast } = useUiScale();

  return (
    <>
      <header className="topbar">
        <div className="topActions">
          <button
            aria-pressed={highContrast}
            className={`chip ${highContrast ? "chipActive" : ""}`}
            onClick={() => setHighContrast(!highContrast)}
          >
            {highContrast ? "Standard Colors" : "High Contrast"}
          </button>

          <button
            className="chip topBtn"
            onClick={() => setShowSizeModal(true)}
          >
            Text &amp; Button Size
          </button>

          <button className="chip">Print Preview</button>
          <button
            className="chip"
            onClick={() => {
              localStorage.removeItem(AUTH_KEY);
              onLogout();
            }}
          >
            Logout
          </button>
          <button className="btn btnDanger" onClick={onQuit}>
            ✕ Quit
          </button>
        </div>
      </header>

      {showSizeModal && (
        <TextSizeModal onClose={() => setShowSizeModal(false)} />
      )}
    </>
  );
}