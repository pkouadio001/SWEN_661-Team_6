"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const jsx_runtime_1 = require("react/jsx-runtime");
const router_1 = __importDefault(require("./router"));
//import { UiScaleProvider } from "../state/uiScale";
function App() {
    return (0, jsx_runtime_1.jsx)(router_1.default, {});
    // (<UiScaleProvider>
    // </UiScaleProvider>);
}
