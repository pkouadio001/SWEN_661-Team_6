# Desktop Design Documentation - CareConnect

**Application:** CareConnect Parkinson's Care Management System  
**Platform:** Electron Desktop Application  
**Target OS:** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)  
**Date:** February 19, 2026  
**Author:** Team 6

---

## Executive Summary

This document details the design decisions, patterns, and rationale for the CareConnect desktop application. The desktop version is optimized for mouse/keyboard interaction, larger screens, and extended work sessions, while maintaining accessibility for users with Parkinson's disease.

**Key Design Principles:**

1. **Desktop-First Patterns** - Menu bars, toolbars, multi-window support
2. **Parkinson's Optimization** - Large targets, keyboard shortcuts, error prevention
3. **Cross-Platform Consistency** - Works on Windows, macOS, and Linux
4. **Accessibility First** - WCAG 2.1 Level AA compliance with AAA enhancements

---

## 1. Desktop vs. Mobile Design Differences

### 1.1 Fundamental Differences

| Aspect                  | Mobile Design               | Desktop Design                                    | Rationale                                           |
| ----------------------- | --------------------------- | ------------------------------------------------- | --------------------------------------------------- |
| **Input Method**        | Touch (fingers)             | Mouse + Keyboard                                  | More precise pointing, keyboard shortcuts available |
| **Screen Size**         | 5-7" (375-428px)            | 13-32" (1024-3840px)                              | More information density possible                   |
| **Interaction Pattern** | Tap, swipe, pinch           | Click, double-click, right-click, hover, keyboard | Richer interaction vocabulary                       |
| **Navigation**          | Bottom tabs, hamburger menu | Menu bar, sidebars, breadcrumbs                   | Persistent navigation                               |
| **Content Density**     | Minimal (one task)          | High (multiple panes)                             | Can show more context                               |
| **Session Length**      | Short (2-5 min)             | Extended (30+ min)                                | Sustained focus sessions                            |
| **Window Management**   | Single fullscreen           | Multi-window, resizable                           | Can compare side-by-side                            |
| **Error Tolerance**     | High (fat fingers)          | Lower (precise cursor)                            | Smaller targets acceptable (with exceptions)        |

### 1.2 CareConnect-Specific Differences

**Mobile CareConnect:**

```
┌─────────────────────┐
│   Dashboard         │
│                     │
│  [Big SOS Button]   │
│                     │
│  [Profile Tile]     │
│  [Notifications]    │
│  [Tasks]            │
│                     │
│ ┌───┬───┬───┬───┐   │
│ │Hom│Tsk│Hth│Msg│   │ Bottom Nav
│ └───┴───┴───┴───┘   │
└─────────────────────┘
One task focus
Large touch targets (60x60px)
Bottom navigation
```

**Desktop CareConnect:**

```
┌───────────────────────────────────────────────┐
│ File Edit View Help        [Profile] [SOS]    │ Menu Bar
├───────────────────────────────────────────────┤
│ [Home][Tasks][Health][Messages][Alerts]       │ Toolbar
├──────────┬────────────────────────────────────┤
│          │  Dashboard                         │
│ Sidebar  │                                    │
│          │  [Profile]  [Notifications]        │
│ Quick    │  [Tasks]    [Patient Info]         │
│ Links    │                                    │
│          │  Today's Schedule:                 │
│          │  - 9:00 AM Medication              │
│          │  - 11:30 AM Physical Therapy       │
│          │                                    │
│          │  Recent Activity: ...              │
├──────────┴────────────────────────────────────┤
│ Status: Last sync 2 minutes ago               │ Status Bar
└───────────────────────────────────────────────┘
Multi-panel view
Persistent menu bar
Sidebar navigation
More information density
```

**Key Differences Explained:**

1. **Navigation Structure:**
   - Mobile: Bottom tabs (thumb-friendly)
   - Desktop: Menu bar + toolbar + sidebar (always visible)

2. **Information Density:**
   - Mobile: One card at a time (vertical scroll)
   - Desktop: Multiple panels visible simultaneously (dashboard + sidebar + status)

3. **Actions:**
   - Mobile: Primary actions as large buttons
   - Desktop: Actions in menus, toolbars, context menus, keyboard shortcuts

4. **Interaction:**
   - Mobile: Touch gestures (tap, swipe)
   - Desktop: Click, right-click, hover, keyboard shortcuts

5. **SOS Button:**
   - Mobile: Always visible on main screen (large)
   - Desktop: Persistent in menu bar (smaller but always accessible via Ctrl+E)

---

## 2. Desktop Patterns Used and Why

### 2.1 Menu Bar Pattern

**What It Is:**
Traditional desktop application menu bar (File, Edit, View, Help) at the top of the window.

**Why We Use It:**

1. **Familiar to Desktop Users:**
   - Standard pattern since 1984 (Macintosh)
   - Users know to look at top-left for actions

2. **Keyboard Accessible:**
   - Alt+F opens File menu
   - Full keyboard navigation (Alt+F, Down, Enter)
   - Critical for Parkinson's patients who prefer keyboard

3. **Persistent Access:**
   - Always visible (unlike hamburger menus)
   - No need to remember where actions are hidden

4. **Hierarchical Organization:**
   - Logical grouping (File operations, Edit operations, etc.)
   - Reduces cognitive load

**CareConnect Menu Structure:**

```
File
├── New Entry
├── Open Profile
├── Save
├── Print
├── ─────────
├── Import Data
├── Export Data
├── ─────────
├── Preferences (Ctrl+,)
└── Exit (Alt+F4)

Edit
├── Undo (Ctrl+Z)
├── Redo (Ctrl+Y)
├── ─────────
├── Cut (Ctrl+X)
├── Copy (Ctrl+C)
├── Paste (Ctrl+V)
├── ─────────
└── Find (Ctrl+F)

View
├── Dashboard (Ctrl+1)
├── Tasks (Ctrl+2)
├── Health Logs (Ctrl+3)
├── Messages (Ctrl+4)
├── Alerts (Ctrl+5)
├── Profile (Ctrl+6)
├── ─────────
├── Toggle Sidebar
├── Zoom In (Ctrl++)
├── Zoom Out (Ctrl+-)
├── Reset Zoom (Ctrl+0)
└── Fullscreen (F11)

Emergency
├── Trigger SOS (Ctrl+E)
├── View Emergency Contacts
└── Emergency Information (F12)

Help
├── User Guide (F1)
├── Keyboard Shortcuts
├── Accessibility Guide
├── ─────────
├── Check for Updates
└── About CareConnect
```

**Parkinson's Optimization:**

- **Emergency menu:** Prominent placement for critical actions
- **Large menu items:** 36px height (vs. standard 24px)
- **Clear labels:** "Trigger SOS" (not just "SOS")
- **Keyboard shortcuts shown:** Reinforces learning

### 2.2 Toolbar Pattern

**What It Is:**
Quick-access icon buttons below the menu bar for common actions.

**Why We Use It:**

1. **One-Click Access:**
   - Most frequent actions immediately accessible
   - No need to navigate through menus

2. **Visual Recognition:**
   - Icons provide quick visual cues
   - Paired with text labels (Parkinson's requirement)

3. **Customizable:**
   - Users can add/remove tools they need
   - Accommodates individual workflows

**CareConnect Toolbar:**

```
┌────────────────────────────────────────────────────────┐
│ [🏠 Home] [📋 Tasks] [❤️ Health] [💬 Messages] [🔔 Alerts] [👤 Profile] │ 44px height
└────────────────────────────────────────────────────────┘
```

**Design Decisions:**

- **Icon + Text:** Not icon-only (accessibility requirement)
- **Generous Spacing:** 12px between buttons (prevent mis-clicks)
- **Large Buttons:** 44px height, 100-120px width (easy targets)
- **Tooltips on Hover:** Reinforce function (e.g., "View Dashboard - Ctrl+1")

**Customization:**

```
Settings → Toolbar Customization
[Available Actions]      [Current Toolbar]
- Add Medication    →    - Home
- Quick Note             - Tasks
- Vitals Entry           - Health
- Schedule Appt          - SOS
```

### 2.3 Sidebar/Panel Pattern

**What It Is:**
Vertical navigation panel on the left side showing section links and quick actions.

**Why We Use It:**

1. **Persistent Navigation:**
   - Always visible (unlike mobile hamburger)
   - No need to open/close menu

2. **Contextual Actions:**
   - Shows relevant quick links for current section
   - Reduces clicks to reach destinations

3. **Visual Hierarchy:**
   - Clear separation of navigation from content
   - Easy to scan

**CareConnect Sidebar:**

```
┌──────────────┐
│ Quick Access │
├──────────────┤
│ 🏠 Dashboard │ ← Current (highlighted)
│ 📋 Tasks     │
│ ❤️ Health    │
│ 💬 Messages  │
│ 🔔 Alerts    │
│ 👤 Profile   │
├──────────────┤
│ Quick Tasks  │
├──────────────┤
│ + Add Med    │
│ + New Note   │
│ + Log Vitals │
├──────────────┤
│ 🆘 Emergency │
└──────────────┘
220px width
```

**Design Decisions:**

- **Fixed Width:** 220px (doesn't resize with window)
- **Collapsible:** Can hide for more content space (Ctrl+B)
- **Large Click Targets:** 48px height per item
- **Clear Current State:** Active item has background color + border
- **Keyboard Navigation:** Arrow keys to navigate, Enter to activate

**Responsiveness:**

- **Wide screens (1920px+):** Sidebar always visible
- **Medium screens (1440px):** Sidebar visible, can collapse
- **Small screens (1024px):** Sidebar auto-collapses to icons only

### 2.4 Context Menu Pattern (Right-Click)

**What It Is:**
Menu that appears when right-clicking on an element, showing relevant actions.

**Why We Use It:**

1. **Contextual Efficiency:**
   - Actions specific to clicked item
   - Faster than navigating to menu bar

2. **Power User Feature:**
   - Advanced users appreciate it
   - Doesn't clutter main UI

3. **Desktop Convention:**
   - Expected behavior on desktop
   - Part of "desktop feel"

**CareConnect Context Menus:**

**Right-click on Medication:**

```
┌────────────────────┐
│ View Details       │
│ Edit Medication    │
│ Mark as Taken      │
│ ────────────────   │
│ Duplicate          │
│ Delete             │
└────────────────────┘
```

**Right-click on Task:**

```
┌────────────────────┐
│ Mark Complete      │
│ Edit Task          │
│ Reschedule         │
│ ────────────────   │
│ Set Reminder       │
│ Delete Task        │
└────────────────────┘
```

**Design Decisions:**

- **Large Menu Items:** 40px height (vs. standard 28px)
- **Clear Icons:** Each action has icon + text
- **Destructive Actions Last:** Delete at bottom, separated
- **Keyboard Accessible:** Arrow keys + Enter (no mouse required)

**Parkinson's Consideration:**

- **Alternative Access:** All context menu actions also available via menus/toolbars
- **No Right-Click Only:** Context menus are convenience, not requirement

### 2.5 Modal Dialog Pattern

**What It Is:**
Overlay window for focused tasks (confirmation, settings, forms).

**Why We Use It:**

1. **Focus User Attention:**
   - Single task at a time
   - Blocks background distractions

2. **Error Prevention:**
   - Confirmation before destructive actions
   - Critical for Parkinson's patients (tremor-induced mis-clicks)

3. **Progressive Disclosure:**
   - Complex forms broken into steps
   - Reduces cognitive load

**CareConnect Dialog Types:**

**1. Confirmation Dialog (SOS):**

```
┌─────────────────────────────────────────┐
│  ⚠️  Emergency SOS Alert                │
│                                         │
│  You are about to notify your emergency │
│  contacts and caregiver.                │
│                                         │
│  Are you sure you want to continue?     │
│                                         │
│  [Cancel]           [Send SOS Now]      │
│  (Escape)           (Enter)             │
└─────────────────────────────────────────┘
```

**2. Form Dialog (Add Medication):**

```
┌─────────────────────────────────────────┐
│  Add New Medication            [X]      │
├─────────────────────────────────────────┤
│  Medication Name:                       │
│  [_____________________________]        │
│                                         │
│  Dosage:                                │
│  [_____] [mg ▼]                        │
│                                         │
│  Frequency:                             │
│  [Daily ▼]                             │
│                                         │
│  Time of Day:                           │
│  [Morning ▼]                           │
│                                         │
│  [Cancel]              [Save]           │
└─────────────────────────────────────────┘
```

**3. Settings Dialog:**

```
┌─────────────────────────────────────────┐
│  Settings                      [X]      │
├──────────┬──────────────────────────────┤
│ General  │  Application Settings        │
│ Display  │                              │
│ Access.  │  Language:                   │
│ Privacy  │  [English ▼]                 │
│ About    │                              │
│          │  Notifications:              │
│          │  [✓] Enable notifications    │
│          │  [✓] Sound alerts            │
│          │                              │
│          │  [Cancel]  [Apply]  [OK]     │
└──────────┴──────────────────────────────┘
```

**Design Decisions:**

- **Large Buttons:** 44px height, 120px+ width
- **Clear Spacing:** 16px between buttons (prevent mis-clicks)
- **Escape to Cancel:** Always available keyboard shortcut
- **Enter for Primary:** Primary action triggered by Enter
- **Tab Order:** Logical (top to bottom, left to right)
- **Focus Trap:** Tab cycles within dialog only

### 2.6 Status Bar Pattern

**What It Is:**
Information bar at bottom of window showing system status.

**Why We Use It:**

1. **Persistent Information:**
   - Always visible, non-intrusive
   - User can glance for status

2. **Contextual Feedback:**
   - Shows results of actions
   - Displays current state

3. **Desktop Convention:**
   - Expected in desktop apps
   - Familiar placement

**CareConnect Status Bar:**

```
┌────────────────────────────────────────────────────────┐
│ ✓ Synced 2 minutes ago  │  3 tasks due today  │  [⚙️] │
└────────────────────────────────────────────────────────┘
24px height
```

**Sections:**

1. **Left:** Sync status, connectivity
2. **Center:** Contextual information (tasks, alerts)
3. **Right:** Quick settings access

**Design Decisions:**

- **Subtle Styling:** Light gray background, smaller text (14px)
- **Icons for Status:** ✓ (synced), ⟳ (syncing), ✗ (error)
- **Click for Details:** Click sync status to see sync log
- **Always Visible:** Never hides, persistent reference

---

## 3. Mouse/Keyboard vs. Touch Optimization

### 3.1 Mouse-Specific Optimizations

**Hover States:**

Mobile doesn't have hover; desktop does. We leverage it:

```css
/* Button hover feedback */
button:hover {
  background-color: #0056b3;
  cursor: pointer;
  transform: translateY(-1px); /* Subtle lift */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Tooltip on hover */
.toolbar-button:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  /* Tooltip styling */
}

/* Row hover in tables */
tr:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
```

**Benefits:**

- **Discoverability:** Hover reveals interactive elements
- **Feedback:** User knows element is clickable
- **Efficiency:** Tooltips on hover (vs. long press on mobile)

**Right-Click Actions:**

Desktop users expect right-click context menus:

```javascript
element.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  showContextMenu(e.clientX, e.clientY, contextActions);
});
```

**Precise Cursor:**

Smaller targets acceptable (within reason):

| Element          | Mobile Size | Desktop Size | Rationale                       |
| ---------------- | ----------- | ------------ | ------------------------------- |
| Primary Button   | 60x60px     | 44x44px      | Parkinson's: still large        |
| Secondary Button | 48x48px     | 36x36px      | Less critical, mouse is precise |
| Link             | 44x44px     | 24x24px min  | Mouse can click small text      |
| Checkbox         | 48x48px     | 20x20px      | Standard desktop size           |

**But:** For Parkinson's-specific elements, we keep targets large (60x60px) even on desktop.

### 3.2 Keyboard-Specific Optimizations

**Comprehensive Keyboard Shortcuts:**

Desktop users expect keyboard efficiency:

```
Global Shortcuts:
Ctrl+N    New entry
Ctrl+S    Save
Ctrl+P    Print
Ctrl+F    Find
Ctrl+Z    Undo
Ctrl+Y    Redo

Navigation:
Ctrl+1-6  Switch sections
Tab       Next field/element
Shift+Tab Previous field/element
Alt       Access menu bar

CareConnect-Specific:
Ctrl+E    Emergency SOS
Ctrl+M    Add medication
Ctrl+T    New task
Ctrl+H    Log health data
```

**Visual Keyboard Hints:**

Show keyboard shortcuts in UI:

```
[Save]  Ctrl+S
[Print] Ctrl+P
[Find]  Ctrl+F
```

**Tab Navigation Optimization:**

Logical tab order through page:

```html
<!-- Tab order: 1 → 2 → 3 → 4 -->
<button tabindex="1">Primary Action</button>
<input tabindex="2" />
<input tabindex="3" />
<button tabindex="4">Secondary Action</button>
```

**Accesskey Attribute:**

Underlined letters in menus (like Windows apps):

```html
<button accesskey="f"><u>F</u>ile</button>

<!-- Alt+F activates this button -->
```

### 3.3 Removing Touch Gestures

**Mobile Has:**

- Swipe to navigate
- Pinch to zoom
- Long press for context menu
- Pull to refresh

**Desktop Replaces With:**

- Arrow keys / Page Up/Down to navigate
- Ctrl+Plus/Minus to zoom
- Right-click for context menu
- F5 to refresh

**Implementation:**

```javascript
// Disable touch gestures in Electron
webContents.on("will-navigate", (event) => {
  event.preventDefault(); // No swipe-to-navigate
});

// Disable pinch-to-zoom (use Ctrl+Plus instead)
webContents.setZoomFactor(1.0);
webContents.on("zoom-changed", (event) => {
  event.preventDefault();
});
```

### 3.4 Multi-Selection Patterns

**Desktop Advantage:**

Mouse + keyboard enables multi-selection:

```
Click            Select one item
Ctrl+Click       Toggle selection
Shift+Click      Select range
Ctrl+A           Select all
```

**Use Cases in CareConnect:**

```
Tasks Screen:
□ Take morning medication
□ Log blood pressure
□ Physical therapy appointment
□ Evening medication

[Select All] [Mark Complete] [Delete Selected]

User can:
1. Ctrl+Click multiple tasks
2. Click "Mark Complete"
3. All selected tasks marked at once
```

**Parkinson's Consideration:**

- **Also provide:** "Select All" button (no keyboard required)
- **Also provide:** Individual action buttons on each item
- **Multi-select is efficiency**, not requirement

---

## 4. Platform-Specific Considerations

### 4.1 Windows-Specific Design

**Menu Bar Behavior:**

- **Alt key:** Activates menu bar (Windows convention)
- **Underlined letters:** Alt+F for File menu
- **Right-aligned system menu:** Minimize, Maximize, Close (X)

**Window Chrome:**

```
┌─[App Icon] CareConnect - Dashboard    [_][□][X]┐
│ File  Edit  View  Emergency  Help              │
└─────────────────────────────────────────────────┘
```

**Keyboard Shortcuts:**

- **Ctrl** (not Cmd)
- **Alt+F4** to close window
- **F10** to activate menu bar
- **Windows key** integration (optional)

**Styling:**

- **Window corners:** Square (Windows 10) or rounded (Windows 11)
- **Title bar color:** System theme or custom
- **Acrylic effects:** Blur/transparency (Windows 11)

**Accessibility:**

- **Narrator support:** Windows screen reader
- **High Contrast themes:** Black, White, Custom
- **Magnifier:** App scales with Windows Magnifier

**File Paths:**

```
C:\Users\[Username]\AppData\Roaming\CareConnect\
```

### 4.2 macOS-Specific Design

**Menu Bar Behavior:**

- **Cmd key:** Primary modifier (not Ctrl)
- **Application menu:** "CareConnect" menu (left of File)
- **System menu items:** Services, Hide, Quit

**Window Chrome:**

```
┌[●][●][●] CareConnect - Dashboard               ┐
│ CareConnect  File  Edit  View  Emergency  Help │
└──────────────────────────────────────────────────┘
```

**Traffic Lights:**

- Red (close), Yellow (minimize), Green (fullscreen)
- Left side of title bar (Mac convention)

**Keyboard Shortcuts:**

- **Cmd** (not Ctrl)
- **Cmd+Q** to quit app
- **Cmd+W** to close window
- **Cmd+,** for Preferences

**Menu Structure:**

```
CareConnect (Application Menu)
├── About CareConnect
├── ─────────
├── Preferences... (Cmd+,)
├── ─────────
├── Services  ▶
├── ─────────
├── Hide CareConnect (Cmd+H)
├── Hide Others (Cmd+Alt+H)
├── Show All
├── ─────────
└── Quit CareConnect (Cmd+Q)
```

**Styling:**

- **Title bar:** Integrated with toolbar (macOS Big Sur+)
- **Vibrancy:** Translucent sidebars
- **SF Symbols:** Use macOS system icons

**Accessibility:**

- **VoiceOver:** macOS screen reader
- **Increase Contrast:** System preference
- **Reduce Motion:** Respect preference

**File Paths:**

```
~/Library/Application Support/CareConnect/
```

### 4.3 Linux-Specific Design

**Desktop Environments:**
Support multiple DEs:

- GNOME
- KDE Plasma
- XFCE
- Cinnamon

**Menu Bar Behavior:**

- **Context-dependent:** Some DEs have global menu bar (Unity)
- **Ctrl key:** Like Windows
- **Varies by DE:** Respect system conventions

**Window Chrome:**

```
┌─ CareConnect - Dashboard           [_][□][X]┐
│ File  Edit  View  Emergency  Help           │
└──────────────────────────────────────────────┘
```

**Styling:**

- **Respect system theme:** GTK/Qt themes
- **No assumptions:** Different DEs have different styles
- **Native look:** Match system window decorations

**Accessibility:**

- **Orca:** Linux screen reader
- **Compiz accessibility:** Screen magnifier
- **Desktop accessibility settings:** Respect all

**File Paths:**

```
~/.config/careconnect/
~/.local/share/careconnect/
```

### 4.4 Cross-Platform Consistency

**What Stays Consistent:**

- **Application logic:** Same features on all platforms
- **Keyboard shortcuts (adjusted):** Ctrl (Win/Linux) vs. Cmd (Mac)
- **Layout:** Same menu structure (adjusted for platform)
- **Accessibility:** WCAG 2.1 Level AA on all platforms

**What Changes:**

- **Keyboard modifier:** Ctrl vs. Cmd
- **Menu placement:** Windows/Linux (in-window) vs. macOS (global)
- **Window controls:** Position and style
- **File paths:** Platform-specific locations
- **System integration:** Different APIs per OS

**Implementation Strategy:**

```javascript
// Detect platform
const platform = process.platform; // 'win32', 'darwin', 'linux'

// Adjust keyboard shortcuts
const shortcut = platform === "darwin" ? "Cmd+S" : "Ctrl+S";

// Adjust menu
if (platform === "darwin") {
  // Add macOS application menu
  menu.unshift({
    label: "CareConnect",
    submenu: [
      /* About, Preferences, Quit */
    ],
  });
}

// Adjust window chrome
if (platform === "win32") {
  window.setMenuBarVisibility(true);
} else if (platform === "darwin") {
  window.setTitleBarStyle("hiddenInset"); // macOS Big Sur style
}
```

---

## 5. Responsive Desktop Design

### 5.1 Breakpoints for Desktop

Unlike mobile-first design, desktop starts large and adapts smaller:

```css
/* Extra large desktop (1920px+) */
@media (min-width: 1920px) {
  .sidebar {
    width: 280px;
  }
  .main-content {
    max-width: 1400px;
  }
  font-size: 18px;
}

/* Standard desktop (1440px-1919px) */
@media (min-width: 1440px) and (max-width: 1919px) {
  .sidebar {
    width: 220px;
  }
  .main-content {
    max-width: 1200px;
  }
  font-size: 16px;
}

/* Small desktop / laptop (1024px-1439px) */
@media (min-width: 1024px) and (max-width: 1439px) {
  .sidebar {
    width: 180px; /* or collapse to icons */
  }
  .main-content {
    max-width: 100%;
  }
  font-size: 16px;
}
```

### 5.2 Window Resizing Behavior

**User Resizes Window:**

```
1920px wide:
┌─────────────────────────────────────────┐
│ Sidebar │ Main Content    │  Extra Info │
│ (280px) │ (1400px)        │  (240px)    │
└─────────────────────────────────────────┘

1440px wide:
┌───────────────────────────────────┐
│ Sidebar │ Main Content           │
│ (220px) │ (1220px)               │
└───────────────────────────────────┘

1024px wide:
┌─────────────────────────────┐
│ ≡ │ Main Content           │
│   │ (sidebar collapsed)    │
└─────────────────────────────┘
```

**Minimum Window Size:**

- **Width:** 1024px (smaller goes to "mobile" layout)
- **Height:** 768px (vertical scroll if needed)

**Maximum Window Size:**

- **No maximum:** Scales to any size
- **Content max-width:** 1600px (centered if wider)

### 5.3 Multi-Monitor Support

**Considerations:**

- **Remember window position:** Save position to local storage
- **Handle moved monitors:** Detect if saved position is off-screen
- **DPI awareness:** Respect system scaling on high-DPI monitors

```javascript
// Save window position on close
window.on("close", () => {
  const bounds = window.getBounds();
  localStorage.setItem("windowBounds", JSON.stringify(bounds));
});

// Restore on open
const saved = JSON.parse(localStorage.getItem("windowBounds"));
if (saved) {
  window.setBounds(saved);
}
```

---

## 6. Parkinson's-Specific Desktop Optimizations

### 6.1 Large Click Targets on Desktop

**Standard Desktop:**

- Buttons: 32x32px
- Links: 16x16px
- Checkboxes: 13x13px

**CareConnect Desktop (Parkinson's):**

- Primary Buttons: 44x44px minimum (60x60px for critical actions)
- Links: 24x24px minimum (or larger padding)
- Checkboxes: 24x24px (vs. standard 13px)

**Rationale:**
Even with precise mouse, Parkinson's patients have tremor. Larger targets reduce frustration and errors.

### 6.2 Keyboard-First Design

**Why Critical for Parkinson's:**

- Tremor makes precise mouse control difficult
- Keyboard offers more stability (resting hands)
- Less physical movement required

**Implementation:**

- **100% keyboard accessible:** Every feature has keyboard shortcut
- **Visual keyboard hints:** Shortcuts shown in UI
- **Logical tab order:** Minimal Tab presses to reach any element
- **Sticky Keys compatible:** No simultaneous key presses required

### 6.3 Error Prevention on Desktop

**Confirmation Dialogs:**

```
Delete Medication?

[Yes, Delete]  [No, Cancel]

vs.

[Cancel]  [Yes, Delete]
```

**Best Practice:** Destructive action on right, safe action on left (or vice versa, but consistent)

**Undo Functionality:**

```
Medication deleted. [Undo]  [X]
(5 second timeout)
```

**Prevents:**

- Accidental clicks from tremor
- Keyboard shortcut accidents
- Loss of critical data

### 6.4 Customizable UI

**User Can Adjust:**

```
Settings → Accessibility → Motor Assistance

[ ] Enable Motor Assistance Mode
    When enabled:
    - Extra large UI (60x60px buttons)
    - Increased spacing (20px)
    - No double-click required
    - Longer timeouts (no rush)

Text Size: [Small] [Medium] [Large] [Extra Large]

Button Size: [Standard (44px)] [Large (60px)] [Extra Large (80px)]

Spacing: [Standard] [Comfortable] [Spacious]
```

**Benefits:**

- Accommodates varying symptom severity
- Adapts to "on/off" medication periods
- Personalized to individual needs

---

## 7. Design System Components

### 7.1 Component Library

**Created for CareConnect Desktop:**

1. **Buttons**
   - Primary (blue, high contrast)
   - Secondary (gray outline)
   - Danger (red, for delete)
   - SOS (red, extra large)

2. **Form Controls**
   - Text inputs (large, clear labels)
   - Dropdowns (large tap targets)
   - Checkboxes (24x24px)
   - Radio buttons (24x24px)
   - Date pickers (calendar overlay)

3. **Navigation**
   - Menu bar items
   - Toolbar buttons
   - Sidebar links
   - Breadcrumbs
   - Tabs

4. **Feedback**
   - Toast notifications
   - Modal dialogs
   - Confirmation alerts
   - Loading spinners
   - Progress bars

5. **Layout**
   - Grid system (12-column)
   - Cards (content containers)
   - Panels (sidebars)
   - Status bar

### 7.2 Design Tokens

**Colors:**

```
--primary-blue: #0066CC
--secondary-gray: #6C757D
--danger-red: #DC3545
--success-green: #28A745
--warning-yellow: #FFC107

--text-primary: #212529
--text-secondary: #6C757D
--background: #FFFFFF
--surface: #F8F9FA
```

**Typography:**

```
--font-family: 'Segoe UI', 'SF Pro', 'Ubuntu', sans-serif
--font-size-base: 16px
--font-size-large: 20px
--font-size-heading: 32px

--line-height: 1.5
--letter-spacing: 0.02em
```

**Spacing:**

```
--space-xs: 4px
--space-sm: 8px
--space-md: 16px
--space-lg: 24px
--space-xl: 32px
```

**Sizes:**

```
--button-height: 44px
--button-height-large: 60px
--input-height: 44px
--checkbox-size: 24px
--icon-size: 24px
```

---

## 8. Implementation Guidelines

### 8.1 Technology Stack

**Electron App Structure:**

```
careconnect-desktop/
├── src/
│   ├── main/              # Main process (Node.js)
│   │   ├── index.js       # Entry point
│   │   ├── menu.js        # Menu bar definition
│   │   └── window.js      # Window management
│   ├── renderer/          # Renderer process (React)
│   │   ├── App.jsx        # Root component
│   │   ├── components/    # UI components
│   │   ├── pages/         # Screen components
│   │   └── styles/        # CSS/styling
│   └── preload.js         # Bridge between main/renderer
├── public/
│   ├── index.html
│   └── icon.png
└── package.json
```

**Key Technologies:**

- **Electron:** Desktop app framework
- **React:** UI library
- **TypeScript:** Type safety
- **Tailwind CSS:** Styling (with custom config for Parkinson's)
- **Electron Builder:** Packaging for Windows/macOS/Linux

### 8.2 Accessibility Implementation

**React Component Example:**

```jsx
// Accessible button component
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "large",
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        btn 
        btn-${variant} 
        btn-${size}
        focus:outline-3
        focus:outline-blue-600
      `}
      aria-label={props["aria-label"]}
      {...props}
    >
      {children}
    </button>
  );
};

// Usage
<Button
  onClick={handleSOS}
  variant="danger"
  size="extra-large"
  aria-label="Emergency SOS - Press to notify emergency contacts"
>
  🆘 SOS EMERGENCY
</Button>;
```

**Keyboard Shortcut Implementation:**

```javascript
// Register global keyboard shortcuts
const { globalShortcut } = require("electron");

app.whenReady().then(() => {
  // Emergency SOS
  globalShortcut.register("CommandOrControl+E", () => {
    mainWindow.webContents.send("trigger-sos");
  });

  // Navigate sections
  for (let i = 1; i <= 6; i++) {
    globalShortcut.register(`CommandOrControl+${i}`, () => {
      mainWindow.webContents.send("navigate-section", i);
    });
  }
});
```

### 8.3 Testing Strategy

**Desktop-Specific Testing:**

1. **Cross-Platform Testing:**
   - Test on Windows 10/11
   - Test on macOS 11/12/13
   - Test on Ubuntu 20.04/22.04

2. **Screen Size Testing:**
   - 1024x768 (minimum)
   - 1366x768 (common laptop)
   - 1920x1080 (Full HD)
   - 2560x1440 (2K)
   - 3840x2160 (4K)

3. **Keyboard Testing:**
   - Complete all tasks using keyboard only
   - Test all shortcuts on each platform
   - Verify no keyboard traps

4. **Accessibility Testing:**
   - NVDA (Windows)
   - JAWS (Windows, if available)
   - VoiceOver (macOS)
   - Orca (Linux)

5. **Performance Testing:**
   - App launch time < 3 seconds
   - Navigation response < 100ms
   - Smooth scrolling (60fps)

---

## 9. Future Enhancements

### 9.1 Planned Features

**Phase 2 (Post-Launch):**

- **Multi-window support:** Open multiple patients in separate windows
- **Dark mode:** System-aware dark theme
- **Offline sync:** Work offline, sync when connected
- **Voice commands:** "Computer, trigger SOS" (accessibility)
- **Custom themes:** User-created color schemes

**Phase 3 (Advanced):**

- **Tablet mode:** Touch-optimized UI for touchscreen laptops
- **Plugin system:** Third-party extensions
- **Advanced keyboard customization:** User-defined shortcuts
- **Screen reader mode:** Optimized layout for screen reader users
- \*\*International

ization:\*\* Multiple languages

### 9.2 Known Limitations

**Current Constraints:**

- **Single window:** Only one app window at a time
- **No touch gestures:** Mouse/keyboard only
- **English only:** No internationalization yet
- **Limited offline:** Requires internet for sync

**To Be Addressed:**

- Multi-window support in Phase 2
- Touch optimization for Surface devices
- Internationalization in Phase 3

---

## 10. Conclusion

The CareConnect desktop application design prioritizes accessibility, keyboard navigation, and large click targets to accommodate users with Parkinson's disease. By implementing desktop-specific patterns (menu bars, toolbars, context menus, keyboard shortcuts) and adapting them for Parkinson's users (larger targets, error prevention, keyboard-first), we create a powerful, accessible desktop experience.

**Key Achievements:**

1. ✅ Desktop-optimized UI patterns (menu bar, toolbar, sidebar, dialogs)
2. ✅ 100% keyboard accessible with comprehensive shortcuts
3. ✅ Parkinson's-specific optimizations (large targets, error prevention)
4. ✅ Cross-platform consistency (Windows, macOS, Linux)
5. ✅ WCAG 2.1 Level AA compliance with AAA enhancements
6. ✅ Responsive design for various desktop screen sizes

**Differentiation from Mobile:**

- More information density (multi-panel layouts)
- Persistent navigation (menu bar, sidebar always visible)
- Richer interactions (hover, right-click, keyboard shortcuts)
- Extended work sessions (optimized for productivity)

**Design Philosophy:**

> "Desktop applications should feel like desktop applications, leveraging the advantages of larger screens, precise pointing devices, and powerful keyboards, while maintaining accessibility for all users, especially those with motor disabilities like Parkinson's disease."

---
