import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";

export default function AppLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar
          onLogout={() => {}}
          onQuit={() => window.careconnect.quitApp?.()}
        />
        <Outlet />
      </div>
    </div>
  );
}