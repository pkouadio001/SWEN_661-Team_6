import { useUiScale, UiScale } from "../state/uiScale";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

const cards: { key: UiScale; title: string; subtitle: string }[] = [
  { key: "small", title: "Small", subtitle: "Compact text, buttons, and inputs" },
  { key: "medium", title: "Medium", subtitle: "Balanced sizing (Default)" },
  { key: "large", title: "Large", subtitle: "Maximum accessibility sizing" }
];

export default function SizeDemoScreen() {
  const nav = useNavigate();
  const { scale, setScale } = useUiScale();

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="pageTitle">Typography &amp; Size Demo</div>
          <div className="pageSub">
            Currently viewing: <strong>{scale}</strong> size - All Elements
          </div>

          <div className="panel">
            <div className="panelTitleRow">
              <div className="panelIcon">T</div>
              <div>
                <div className="panelTitle">How to Change Size</div>
                <div className="panelSub">
                  Click the “Text &amp; Button Size” button in the menu bar, or choose a size below.
                </div>
              </div>
            </div>

            <div className="sizeCardRow">
              {cards.map((c) => (
                <button
                  key={c.key}
                  className={`sizeCard ${scale === c.key ? "active" : ""}`}
                  onClick={() => setScale(c.key)}
                  type="button"
                >
                  <div className="sizeCardTitle">{c.title}</div>
                  <div className="sizeCardSub">{c.subtitle}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelTitle">Typography Hierarchy</div>
            <div className="panelSub">All text scales automatically based on your size preference</div>

            <div style={{ marginTop: 14 }}>
              <div className="label">Heading Text (Page Titles)</div>
              <div className="demoH1">Main Page Heading</div>

              <div className="label" style={{ marginTop: 14 }}>Subheading Text (Section Headers)</div>
              <div className="demoH2">Section Subheading</div>

              <div className="label" style={{ marginTop: 14 }}>Card Title Text</div>
              <div className="demoH3">Card Component Title</div>

              <div className="label" style={{ marginTop: 14 }}>Content Text (Body Copy)</div>
              <div className="demoBody">
                This is standard body text used throughout the application for descriptions, information, and general content.
              </div>

              <div className="label" style={{ marginTop: 14 }}>Label Text (Form Labels &amp; Metadata)</div>
              <div className="demoMuted">Form labels, timestamps, and supplementary information</div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelTitle">Interactive Buttons</div>
            <div className="panelSub">Buttons adapt their padding and icon sizes automatically</div>

            <div style={{ marginTop: 12 }}>
              <div className="label">Primary Action Buttons</div>
              <div className="demoBtnRow">
                <button className="btn">Primary Action</button>
                <button className="btn">Schedule</button>
                <button className="btn">View Details</button>
              </div>

              <div className="label" style={{ marginTop: 14 }}>Secondary Action Buttons</div>
              <div className="demoBtnRow">
                <button className="btn secondary">Secondary Action</button>
                <button className="btn outline">Outline Button</button>
              </div>
            </div>
          </div>

          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelTitle">Form Elements</div>
            <div className="panelSub">Input fields and checkboxes scale for better accessibility</div>

            <div style={{ marginTop: 12 }}>
              <div className="label">Text Input Field</div>
              <input className="input" placeholder="Enter text here..." />

              <div style={{ marginTop: 12 }}>
                <label className="checkRow">
                  <input type="checkbox" />
                  <span>Checkbox with scaled size</span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}