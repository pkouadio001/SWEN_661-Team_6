import React, { useMemo, useState } from "react";
import AddActivityModal from "./components/AddActivityModal";
import { useActivities } from "../state/activitiesStore";

export default function ActivitiesScreen() {
  const { activities, toggleActivity, deleteActivity } = useActivities();
  const [showAdd, setShowAdd] = useState(false);

  const completedCount = useMemo(() => activities.filter((a) => a.completed).length, [activities]);
  const totalCount = activities.length;
  const remaining = Math.max(0, totalCount - completedCount);
  const progressPct = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="page">
      <div className="pageHeaderRow">
        <div>
          <h1 className="pageTitle">Daily Activities</h1>
          <p className="pageSubtitle">Track your daily routine and tasks</p>
        </div>

        <button className="btn primary" onClick={() => setShowAdd(true)}>
          + Add Activity
        </button>
      </div>

      {/* Progress Card */}
      <section className="card">
        <div className="cardHeader">
          <div className="cardTitleRow">
            <span className="cardIcon" aria-hidden="true">📅</span>
            <h2 className="cardTitle">Today&apos;s Progress</h2>
          </div>
        </div>

        <div className="progressWrap" aria-label="Activities completed progress">
          <div className="progressMeta">
            <span className="muted">Activities Completed</span>
            <strong className="progressCount">
              {completedCount} / {totalCount}
            </strong>
          </div>

          <div
            className="progressBar"
            role="progressbar"
            aria-valuenow={completedCount}
            aria-valuemin={0}
            aria-valuemax={totalCount}
            aria-valuetext={`${completedCount} of ${totalCount} completed`}
          >
            <div className="progressFill" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="muted">{remaining} activities remaining</div>
        </div>
      </section>

      {/* Schedule Card */}
      <section className="card">
        <div className="cardHeader">
          <h2 className="cardTitle">Today&apos;s Schedule</h2>
          <p className="cardSubtitle">Check off activities as you complete them throughout the day</p>
        </div>

        <ul className="activityList" aria-label="Today schedule list">
          {activities.map((a) => {
            const rowClass = a.completed ? "activityRow done" : "activityRow";
            return (
              <li key={a.id} className={rowClass}>
                <label className="activityLeft">
                  <input
                    type="checkbox"
                    className="bigCheckbox"
                    checked={a.completed}
                    onChange={() => toggleActivity(a.id)}
                    aria-label={`Mark ${a.title} as ${a.completed ? "not completed" : "completed"}`}
                  />
                  <span className="activityTitle">{a.title}</span>
                </label>

                <div className="activityRight">
                  {a.time && (
                    <span className="activityTime" aria-label={`Time ${a.time}`}>
                      🕒 {a.time}
                    </span>
                  )}

                  {/* If you later implement edit, keep icon button here */}
                  <button
                    className="iconBtn danger"
                    onClick={() => deleteActivity(a.id)}
                    aria-label={`Delete ${a.title}`}
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="tipsBox">
          <div className="tipsTitleRow">
            <span className="tipsIcon" aria-hidden="true">✅</span>
            <strong>Daily Routine Tips</strong>
          </div>
          <ul className="tipsList">
            <li>Stick to a consistent daily schedule when possible</li>
            <li>Plan activities during your best times of day</li>
            <li>Break larger tasks into smaller, manageable steps</li>
            <li>Don&apos;t forget to schedule rest periods throughout the day</li>
          </ul>
        </div>
      </section>

      {showAdd && <AddActivityModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}