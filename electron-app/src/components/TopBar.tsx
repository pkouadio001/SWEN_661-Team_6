import { useState } from "react";
import TextSizeModal from "../screens/components/TextSizeModal";

type Props = {
  onLogout: () => void;
  onQuit: () => void;
};

export default function TopBar({ onLogout, onQuit }: Props) {
  const [showSizeModal, setShowSizeModal] = useState(false);

  return (
    <>
      <header className="topbar">
        <div className="topActions">
          <button className="chip">Colors / High Contrast</button>

          <button
            className="topBtn"
            onClick={() => setShowSizeModal(true)}
          >
            Text &amp; Button Size
          </button>

          <button className="chip">Print Preview</button>
          <button className="chip" onClick={onLogout}>Logout</button>
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