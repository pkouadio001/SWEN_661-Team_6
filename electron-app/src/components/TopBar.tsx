/*import { useState } from "react";
import TextSizeModal from "../screens/components/TextSizeModal";

const [showSizeModal, setShowSizeModal] = useState(false);*/
type Props = {
  onLogout: () => void;
  onQuit: () => void;
};

export default function TopBar({ onLogout, onQuit }: Props) {
  return (
    <header className="topbar">
      <div className="topActions">
        <button className="chip">Colors / High Contrast</button>
        <button className="chip">Text & Button Size</button>
        <button className="chip">Print Preview</button>
        <button className="chip" onClick={onLogout}>Logout</button>
        <button className="btn btnDanger" onClick={onQuit}>✕ Quit</button>
      </div>
    </header>
  );
}