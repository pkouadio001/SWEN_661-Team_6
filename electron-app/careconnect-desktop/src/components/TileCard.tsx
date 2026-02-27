type Props = {
  icon: string;
  title: string;
  subtitle: string;
  color: "blue" | "purple" | "pink" | "green" | "red";
  span?: number;
};

export default function TileCard({ icon, title, subtitle, color, span = 1 }: Props) {
  return (
    <div className="tile" style={{ gridColumn: `span ${span}` }}>
      <div className={`tileIcon ${color}`}>{icon}</div>
      <div>
        <div className="tileTitle">{title}</div>
        <div className="tileSub">{subtitle}</div>
      </div>
    </div>
  );
}