import { useLocation, useNavigate } from "react-router-dom";

type NavItem = { label: string; path?: string };

export default function Sidebar() {
  const nav = useNavigate();
  const loc = useLocation();

  const items: NavItem[] = [
    { label: "Home", path: "/dashboard" },
    { label: "My Info", path: "/my-info" },
     { label: "Medications", path: "/medications" },
    { label: "Symptoms", path: "/symptoms" },
    { label: "My Health", path: "/my-health" },
    { label: "Exercises", path: "/exercises" },
    { label: "Activities", path: "/activities" },
    { label: "Emergency", path: "/emergency" },
    { label: "Size Demo", path: "/size-demo" }
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">♡</div>
        <div>
          <div className="brandTitle">Care Connect</div>
          <div className="brandSub">Your Health Companion</div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => {
          const active = it.path ? loc.pathname === it.path : false;

          return (
            <button
              key={it.label}
              className={`navItem ${active ? "active" : ""}`}
              onClick={() => it.path && nav(it.path)}
              disabled={!it.path}
              title={!it.path ? "Not implemented yet" : undefined}
              style={!it.path ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
            >
              {it.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}