"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MyInfoScreen;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Sidebar_1 = __importDefault(require("../components/Sidebar"));
const TopBar_1 = __importDefault(require("../components/TopBar"));
const STORAGE_KEY = "careconnect.profile";
const defaultProfile = {
    personal: {
        firstName: "Robert",
        lastName: "Johnson",
        dob: "04/15/1955",
        phone: "(555) 234-5678",
        email: "robert.johnson@email.com"
    },
    address: {
        street: "456 Oak Avenue",
        city: "San Francisco",
        state: "CA",
        zip: "94105"
    },
    medical: {
        primaryDoctor: "Dr. Sarah Mitchell",
        doctorPhone: "(555) 987-6543",
        preferredHospital: "San Francisco General Hospital",
        bloodType: "O+",
        insuranceProvider: "Blue Cross Blue Shield",
        insuranceId: "BCBS987654321",
        allergies: "Penicillin, Shellfish",
        currentMedications: "Carbidopa-Levodopa 25–100mg (3 times daily)\nAmantadine 100mg (twice daily)\nRasagiline 1mg (once daily)",
        medicalConditions: "Parkinson’s Disease (diagnosed 2018)\nHypertension\nMild Osteoarthritis"
    }
};
function readProfile() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return defaultProfile;
        const parsed = JSON.parse(raw);
        return parsed;
    }
    catch {
        return defaultProfile;
    }
}
function writeProfile(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}
function Field({ label, value, editable, onChange, placeholder }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("div", { className: "fieldLabel", children: label }), editable ? ((0, jsx_runtime_1.jsx)("input", { className: "input", value: value, placeholder: placeholder, onChange: (e) => onChange?.(e.target.value) })) : ((0, jsx_runtime_1.jsx)("div", { className: "readonly", children: value }))] }));
}
function TextAreaField({ label, value, editable, onChange, placeholder }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "field", children: [(0, jsx_runtime_1.jsx)("div", { className: "fieldLabel", children: label }), editable ? ((0, jsx_runtime_1.jsx)("textarea", { className: "textarea", value: value, placeholder: placeholder, onChange: (e) => onChange?.(e.target.value), rows: 4 })) : ((0, jsx_runtime_1.jsx)("div", { className: "readonly pre", children: value }))] }));
}
function MyInfoScreen() {
    const nav = (0, react_router_dom_1.useNavigate)();
    // persisted profile
    const [profile, setProfile] = (0, react_1.useState)(() => readProfile());
    // section edit mode
    const [editPersonal, setEditPersonal] = (0, react_1.useState)(false);
    const [editAddress, setEditAddress] = (0, react_1.useState)(false);
    const [editMedical, setEditMedical] = (0, react_1.useState)(false);
    // section draft copies (for cancel)
    const [draftPersonal, setDraftPersonal] = (0, react_1.useState)(profile.personal);
    const [draftAddress, setDraftAddress] = (0, react_1.useState)(profile.address);
    const [draftMedical, setDraftMedical] = (0, react_1.useState)(profile.medical);
    // keep drafts in sync when profile changes (e.g. after save)
    (0, react_1.useMemo)(() => {
        setDraftPersonal(profile.personal);
        setDraftAddress(profile.address);
        setDraftMedical(profile.medical);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile]);
    function savePersonal() {
        const next = { ...profile, personal: draftPersonal };
        setProfile(next);
        writeProfile(next);
        setEditPersonal(false);
    }
    function cancelPersonal() {
        setDraftPersonal(profile.personal);
        setEditPersonal(false);
    }
    function saveAddress() {
        const next = { ...profile, address: draftAddress };
        setProfile(next);
        writeProfile(next);
        setEditAddress(false);
    }
    function cancelAddress() {
        setDraftAddress(profile.address);
        setEditAddress(false);
    }
    function saveMedical() {
        const next = { ...profile, medical: draftMedical };
        setProfile(next);
        writeProfile(next);
        setEditMedical(false);
    }
    function cancelMedical() {
        setDraftMedical(profile.medical);
        setEditMedical(false);
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: "shell", children: [(0, jsx_runtime_1.jsx)(Sidebar_1.default, {}), (0, jsx_runtime_1.jsxs)("div", { className: "main", children: [(0, jsx_runtime_1.jsx)(TopBar_1.default, { onLogout: () => nav("/login"), onQuit: () => window.careconnect.quitApp() }), (0, jsx_runtime_1.jsxs)("div", { className: "content", children: [(0, jsx_runtime_1.jsx)("div", { className: "pageTitle", children: "User Information" }), (0, jsx_runtime_1.jsx)("div", { className: "pageSub", children: "Manage your personal and medical information" }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderRow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderLeft", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelIcon blue", children: "\uD83D\uDC64" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Personal Information" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Your basic contact details" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "panelActions", children: editPersonal ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: cancelPersonal, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: savePersonal, children: "\uD83D\uDCBE Save" })] })) : ((0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => setEditPersonal(true), children: "\u270F Edit" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "formGrid2", children: [(0, jsx_runtime_1.jsx)(Field, { label: "First Name", value: editPersonal ? draftPersonal.firstName : profile.personal.firstName, editable: editPersonal, onChange: (v) => setDraftPersonal((p) => ({ ...p, firstName: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Last Name", value: editPersonal ? draftPersonal.lastName : profile.personal.lastName, editable: editPersonal, onChange: (v) => setDraftPersonal((p) => ({ ...p, lastName: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Date of Birth", value: editPersonal ? draftPersonal.dob : profile.personal.dob, editable: editPersonal, onChange: (v) => setDraftPersonal((p) => ({ ...p, dob: v })), placeholder: "MM/DD/YYYY" }), (0, jsx_runtime_1.jsx)(Field, { label: "Phone Number", value: editPersonal ? draftPersonal.phone : profile.personal.phone, editable: editPersonal, onChange: (v) => setDraftPersonal((p) => ({ ...p, phone: v })) }), (0, jsx_runtime_1.jsx)("div", { className: "span2", children: (0, jsx_runtime_1.jsx)(Field, { label: "Email Address", value: editPersonal ? draftPersonal.email : profile.personal.email, editable: editPersonal, onChange: (v) => setDraftPersonal((p) => ({ ...p, email: v })) }) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderRow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderLeft", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelIcon green", children: "\uD83D\uDCCD" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Home Address" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Your residential address" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "panelActions", children: editAddress ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: cancelAddress, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: saveAddress, children: "\uD83D\uDCBE Save" })] })) : ((0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => setEditAddress(true), children: "\u270F Edit" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "formGrid3", children: [(0, jsx_runtime_1.jsx)("div", { className: "span3", children: (0, jsx_runtime_1.jsx)(Field, { label: "Street Address", value: editAddress ? draftAddress.street : profile.address.street, editable: editAddress, onChange: (v) => setDraftAddress((a) => ({ ...a, street: v })) }) }), (0, jsx_runtime_1.jsx)(Field, { label: "City", value: editAddress ? draftAddress.city : profile.address.city, editable: editAddress, onChange: (v) => setDraftAddress((a) => ({ ...a, city: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "State", value: editAddress ? draftAddress.state : profile.address.state, editable: editAddress, onChange: (v) => setDraftAddress((a) => ({ ...a, state: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "ZIP Code", value: editAddress ? draftAddress.zip : profile.address.zip, editable: editAddress, onChange: (v) => setDraftAddress((a) => ({ ...a, zip: v })) })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "panel", style: { marginTop: 14 }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderRow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "panelHeaderLeft", children: [(0, jsx_runtime_1.jsx)("div", { className: "panelIcon purple", children: "\uD83E\uDE7A" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "panelTitle", children: "Medical Information" }), (0, jsx_runtime_1.jsx)("div", { className: "panelSub", children: "Healthcare provider and insurance details" })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "panelActions", children: editMedical ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("button", { className: "btn outline", onClick: cancelMedical, children: "Cancel" }), (0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: saveMedical, children: "\uD83D\uDCBE Save" })] })) : ((0, jsx_runtime_1.jsx)("button", { className: "btn", onClick: () => setEditMedical(true), children: "\u270F Edit" })) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "formGrid2", children: [(0, jsx_runtime_1.jsx)(Field, { label: "Primary Doctor", value: editMedical ? draftMedical.primaryDoctor : profile.medical.primaryDoctor, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, primaryDoctor: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Doctor's Phone", value: editMedical ? draftMedical.doctorPhone : profile.medical.doctorPhone, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, doctorPhone: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Preferred Hospital", value: editMedical ? draftMedical.preferredHospital : profile.medical.preferredHospital, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, preferredHospital: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Blood Type", value: editMedical ? draftMedical.bloodType : profile.medical.bloodType, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, bloodType: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Insurance Provider", value: editMedical ? draftMedical.insuranceProvider : profile.medical.insuranceProvider, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, insuranceProvider: v })) }), (0, jsx_runtime_1.jsx)(Field, { label: "Insurance ID", value: editMedical ? draftMedical.insuranceId : profile.medical.insuranceId, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, insuranceId: v })) }), (0, jsx_runtime_1.jsx)("div", { className: "span2", children: (0, jsx_runtime_1.jsx)(TextAreaField, { label: "Allergies", value: editMedical ? draftMedical.allergies : profile.medical.allergies, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, allergies: v })), placeholder: "List allergies separated by commas..." }) }), (0, jsx_runtime_1.jsx)("div", { className: "span2", children: (0, jsx_runtime_1.jsx)(TextAreaField, { label: "Current Medications", value: editMedical ? draftMedical.currentMedications : profile.medical.currentMedications, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, currentMedications: v })), placeholder: "One per line..." }) }), (0, jsx_runtime_1.jsx)("div", { className: "span2", children: (0, jsx_runtime_1.jsx)(TextAreaField, { label: "Medical Conditions", value: editMedical ? draftMedical.medicalConditions : profile.medical.medicalConditions, editable: editMedical, onChange: (v) => setDraftMedical((m) => ({ ...m, medicalConditions: v })), placeholder: "One per line..." }) })] })] })] })] })] }));
}
