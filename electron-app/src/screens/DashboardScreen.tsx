import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TileCard from "../components/TileCard";
import Panel from "../components/Panel";

export default function DashboardScreen() {
  const nav = useNavigate();
  const location = useLocation();
  const username = (location.state as any)?.username ?? "pemson";

  const now = new Date();
  const day = now.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <TopBar
          onLogout={() => nav("/login")}
          onQuit={() => window.careconnect.quitApp()}
        />

        <div className="content">
          <div className="welcomeRow">
            <div>
              <div className="welcomeTitle">Welcome Back, {username}!</div>
              <div className="welcomeSub">{day}</div>
            </div>
            <div className="timeBig">{time}</div>
          </div>

          <div className="tiles">
            <TileCard icon="✎" title="Medications" subtitle="Track your daily medications" color="blue" />
            <TileCard icon="∿" title="Log Symptoms" subtitle="Record how you're feeling" color="purple" />
            <TileCard icon="♡" title="My Health" subtitle="Track blood pressure, mood & meals" color="pink" />
            <TileCard icon="⟡" title="Exercises" subtitle="View your exercise plan" color="green" />
          </div>

          <div className="tiles" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <TileCard icon="☎" title="Emergency" subtitle="Quick access to contacts" color="red" span={2} />
          </div>

          <div className="panels">
            <Panel
              title="Upcoming Medications"
              buttonText="View All Medications"
              buttonVariant="primary"
              items={[
                { leftTitle: "Carbidopa-Levodopa", leftSub: "25-100mg", right: "2:00 PM" },
                { leftTitle: "Amantadine", leftSub: "100mg", right: "6:00 PM" }
              ]}
            />
            <Panel
              title="Today's Exercises"
              buttonText="View Exercise Plan"
              buttonVariant="success"
              items={[
                { leftTitle: "Stretching Routine", leftSub: "15 min", right: "3:00 PM" },
                { leftTitle: "Walking", leftSub: "20 min", right: "5:00 PM" }
              ]}
            />
          </div>

          <div className="banner">
            <div className="bannerIcon">♡</div>
            <div>
              <div className="bannerTitle">Remember to stay hydrated!</div>
              <div className="bannerSub">Drink water regularly throughout the day.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}