"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UiScaleProvider = UiScaleProvider;
exports.useUiScale = useUiScale;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const UiScaleContext = (0, react_1.createContext)(null);
const STORAGE_KEY = "careconnect.uiScale";
function applyBodyClass(scale) {
    document.body.classList.remove("ui-small", "ui-medium", "ui-large");
    document.body.classList.add(`ui-${scale}`);
}
function UiScaleProvider({ children }) {
    const [scale, setScaleState] = (0, react_1.useState)("medium");
    (0, react_1.useEffect)(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === "small" || saved === "medium" || saved === "large") {
            setScaleState(saved);
            applyBodyClass(saved);
        }
        else {
            applyBodyClass("medium");
        }
    }, []);
    function setScale(s) {
        setScaleState(s);
        localStorage.setItem(STORAGE_KEY, s);
        applyBodyClass(s);
    }
    const value = (0, react_1.useMemo)(() => ({ scale, setScale }), [scale]);
    return (0, jsx_runtime_1.jsx)(UiScaleContext.Provider, { value: value, children: children });
}
function useUiScale() {
    const ctx = (0, react_1.useContext)(UiScaleContext);
    if (!ctx)
        throw new Error("useUiScale must be used inside UiScaleProvider");
    return ctx;
}
