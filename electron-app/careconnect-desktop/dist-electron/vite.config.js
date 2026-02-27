"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
exports.default = {
    base: "./",
    plugins: [(0, plugin_react_1.default)()],
    server: { port: 5173, strictPort: true },
    build: { sourcemap: true }
};
