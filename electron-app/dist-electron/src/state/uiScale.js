"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiScaleProvider = UiScaleProvider;
exports.useUiScale = useUiScale;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const UiScaleContext = (0, react_1.createContext)(null);
const STORAGE_KEY = "careconnect.uiScale";
const HIGH_CONTRAST_STORAGE_KEY = "careconnect.highContrast";
function applyBodyClass(scale) {
    document.body.classList.remove("ui-small", "ui-medium", "ui-large");
    document.body.classList.add(`ui-${scale}`);
}
function applyHighContrastClass(enabled) {
    document.body.classList.toggle("high-contrast", enabled);
}
function UiScaleProvider({ children }) {
    const [scale, setScaleState] = (0, react_1.useState)("medium");
    const [highContrast, setHighContrastState] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedHighContrast = localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
        if (saved === "small" || saved === "medium" || saved === "large") {
            setScaleState(saved);
            applyBodyClass(saved);
        }
        else {
            applyBodyClass("medium");
        }
        const highContrastEnabled = savedHighContrast === "true";
        setHighContrastState(highContrastEnabled);
        applyHighContrastClass(highContrastEnabled);
    }, []);
    function setScale(s) {
        setScaleState(s);
        localStorage.setItem(STORAGE_KEY, s);
        applyBodyClass(s);
    }
    function setHighContrast(enabled) {
        setHighContrastState(enabled);
        localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, String(enabled));
        applyHighContrastClass(enabled);
    }
    const value = (0, react_1.useMemo)(() => ({ scale, setScale, highContrast, setHighContrast }), [highContrast, scale]);
    return (0, jsx_runtime_1.jsx)(UiScaleContext.Provider, { value: value, children: children });
}
function useUiScale() {
    const ctx = (0, react_1.useContext)(UiScaleContext);
    if (!ctx)
        throw new Error("useUiScale must be used inside UiScaleProvider");
    return ctx;
}
