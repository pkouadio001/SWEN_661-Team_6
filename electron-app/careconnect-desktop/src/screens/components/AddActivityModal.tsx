import React, { useEffect, useMemo, useRef, useState } from "react";
import { useActivities } from "../../state/activitiesStore";

type Props = {
  onClose: () => void;
};

function getFocusable(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  const nodes = container.querySelectorAll<HTMLElement>(
    'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
}

export default function AddActivityModal({ onClose }: Props) {
  const { addActivity } = useActivities();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // Basic focus trap
      if (e.key === "Tab") {
        const focusables = getFocusable(dialogRef.current);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        const active = document.activeElement as HTMLElement | null;
        if (!active) return;

        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  function submit() {
    const t = title.trim();
    if (!t) {
      setError("Activity title is required.");
      titleRef.current?.focus();
      return;
    }
    addActivity(t, time.trim() || undefined);
    onClose();
  }

  return (
    <div
      className="modalOverlay"
      role="presentation"
      onMouseDown={(e) => {
        // click outside closes
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-activity-title"
        ref={dialogRef}
      >
        <div className="modalHeader">
          <div>
            <h2 id="add-activity-title" className="modalTitle">
              Add New Activity
            </h2>
            <p className="modalSubtitle">Add a task or reminder to your daily schedule</p>
          </div>

          <button className="iconBtn" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>

        <div className="modalBody">
          <label className="fieldLabel" htmlFor="activityTitle">
            Activity Title
          </label>
          <input
            id="activityTitle"
            ref={titleRef}
            className="textInput"
            placeholder="e.g., Take a walk"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
          />

          <label className="fieldLabel" htmlFor="activityTime">
            Time (optional)
          </label>
          <input
            id="activityTime"
            className="textInput"
            placeholder="e.g., 3:00 PM"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          {error && (
            <div className="formError" role="alert">
              {error}
            </div>
          )}
        </div>

        <div className="modalFooter">
          <button
            className="btn primary wide"
            onClick={submit}
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
          >
            Add Activity
          </button>
        </div>
      </div>
    </div>
  );
}