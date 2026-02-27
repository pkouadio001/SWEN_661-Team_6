type Item = { leftTitle: string; leftSub: string; right: string };

type Props = {
  title: string;
  items: Item[];
  buttonText: string;
  buttonVariant: "primary" | "success";
};

export default function Panel({ title, items, buttonText, buttonVariant }: Props) {
  return (
    <div className="panel">
      <div className="panelTitle">{title}</div>

      <div className="panelList">
        {items.map((it) => (
          <div className="panelRow" key={it.leftTitle}>
            <div>
              <div className="panelMain">{it.leftTitle}</div>
              <div className="panelSub">{it.leftSub}</div>
            </div>
            <div className="panelRight">{it.right}</div>
          </div>
        ))}
      </div>

      <button className={`btn ${buttonVariant === "primary" ? "btnPrimary" : "btnSuccess"} panelBtn`}>
        {buttonText}
      </button>
    </div>
  );
}