import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddActivityModal from "./components/AddActivityModal";
import { useActivities } from "../state/activitiesStore";

export default function ActivitiesScreen() {
  const navigate = useNavigate();
  const { activities, toggleActivity } = useActivities();
  const [showAdd, setShowAdd] = useState(false);

  const completed = activities.filter(a => a.completed).length;
  const total = activities.length;
  const progress = total === 0 ? 0 : (completed / total) * 100;

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <TopBar
          onLogout={() => navigate("/login")}
          onQuit={() => window.careconnect.quitApp()}
        />

        <div className="content">
          <div className="pageHead">
            <div>
              <div className="pageTitle">Daily Activities</div>
              <div className="pageSub">
                Track your daily routine and tasks
              </div>
            </div>

            <button className="btn" onClick={() => setShowAdd(true)}>
              + Add Activity
            </button>
          </div>

          {/* Progress Panel */}
          <div className="panel">
            <div className="panelTitle">Today's Progress</div>

            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="muted">
              {completed} / {total} completed
            </div>
          </div>

          {/* Activities List */}
          <div className="panel">
            <div className="panelTitle">Today's Schedule</div>

            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`activityRow ${activity.completed ? "done" : ""}`}
              >
                <div className="activityLeft">
                  <input
                    type="checkbox"
                    checked={activity.completed}
                    onChange={() => toggleActivity(activity.id)}
                  />
                  <span>{activity.title}</span>
                </div>

                {activity.time && (
                  <div className="muted">🕒 {activity.time}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddActivityModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}