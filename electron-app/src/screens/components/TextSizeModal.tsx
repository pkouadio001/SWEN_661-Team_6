import { useUiScale, UiScale } from "../../state/uiScale";

type Props = {
  onClose: () => void;
};

const options: { key: UiScale; title: string; desc: string }[] = [
  { key: "small", title: "Small (90% page scale)", desc: "Compact text, buttons, and page" },
  { key: "medium", title: "Medium (100% - Default)", desc: "Balanced text, buttons, and page" },
  { key: "large", title: "Large (110% page scale)", desc: "Large text, buttons, and page" }
];

export default function TextSizeModal({ onClose }: Props) {
  const { scale, setScale } = useUiScale();

  return (
    <div className="modalOverlay" onMouseDown={onClose}>
      <div className="sizeModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="sizeModalHeader">
          <div className="sizeModalTitle">Adjust All Interface Elements</div>
          <button className="xBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="sizeModalList">
          {options.map((o) => (
            <button
              key={o.key}
              className={`sizeOption ${scale === o.key ? "active" : ""}`}
              onClick={() => setScale(o.key)}
              type="button"
            >
              <div className="sizeOptionText">
                <div className="sizeOptionTitle">
                  {o.title}
                  {scale === o.key && <span className="sizeCheck">✓</span>}
                </div>
                <div className="sizeOptionDesc">{o.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="sizeModalHint">
          Tip: You can also change this from the <strong>Size Demo</strong> screen.
        </div>
      </div>
    </div>
  );
}