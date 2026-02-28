"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EmergencyScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
function EmergencyScreen() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const call = (number) => {
        window.open(`tel:${number.replace(/[^\d+]/g, "")}`);
    };
    const email = (address) => {
        window.open(`mailto:${address}`);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => navigate("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "Emergency Contacts" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Quick access to important contacts" }), (0, jsx_runtime_1.jsxs)("div", { className: "panel emergencyPanel", children: [(0, jsx_runtime_1.jsxs)("div", { className: "emergencyHeader", children: [(0, jsx_runtime_1.jsx)("div", { className: "emergencyIcon", children: "\u260E" }), (0, jsx_runtime_1.jsx)("div", { className: "panelTitle red", children: "Emergency Services" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "emergencyButtons", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btnDanger wide", onClick: () => call("911"), children: "\u260E Call Emergency Services - 911" }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnDanger wide", onClick: () => call("1-800-222-1222"), children: "\u260E Call Poison Control - 1-800-222-1222" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "sectionTitle", children: "Medical Professionals" }), (0, jsx_runtime_1.jsxs)("div", { className: "contactCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "contactInfo", children: [(0, jsx_runtime_1.jsx)("div", { className: "contactName", children: "Dr. Sarah Johnson" }), (0, jsx_runtime_1.jsx)("div", { className: "muted", children: "Primary Neurologist" }), (0, jsx_runtime_1.jsx)("div", { className: "muted", children: "\uD83D\uDCDE (555) 123-4567" }), (0, jsx_runtime_1.jsx)("div", { className: "muted", children: "\u2709 dr.johnson@healthcare.com" }), (0, jsx_runtime_1.jsx)("div", { className: "muted", children: "\uD83D\uDCCD 123 Medical Center Drive" })] }), (0, jsx_runtime_1.jsx)("button", { className: "btn btnDark", onClick: () => call("(555) 123-4567"), children: "\u260E Call" })] }), (0, jsx_runtime_1.jsx)("div", { className: "sectionTitle", style: { marginTop: 20 }, children: "Family & Caregivers" }), [
                                {
                                    name: "Emily Peterson",
                                    role: "Primary Caregiver / Daughter",
                                    phone: "(555) 234-5678",
                                    email: "emily.peterson@email.com"
                                },
                                {
                                    name: "Michael Peterson",
                                    role: "Family Member / Son",
                                    phone: "(555) 345-6789",
                                    email: "michael.peterson@email.com"
                                }
                            ].map((person) => ((0, jsx_runtime_1.jsxs)("div", { className: "contactCard", children: [(0, jsx_runtime_1.jsxs)("div", { className: "contactInfo", children: [(0, jsx_runtime_1.jsx)("div", { className: "contactName", children: person.name }), (0, jsx_runtime_1.jsx)("div", { className: "muted", children: person.role }), (0, jsx_runtime_1.jsxs)("div", { className: "muted", children: ["\uD83D\uDCDE ", person.phone] }), (0, jsx_runtime_1.jsxs)("div", { className: "muted", children: ["\u2709 ", person.email] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "contactActions", children: [(0, jsx_runtime_1.jsx)("button", { className: "btn btnDark", onClick: () => call(person.phone), children: "\u260E Call" }), (0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: () => email(person.email), children: "\u2709 Email" })] })] }, person.name)))] })] })] }));
}
