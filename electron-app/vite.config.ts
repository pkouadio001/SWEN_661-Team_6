import react from "@vitejs/plugin-react";

export default {
  base: "./",
  plugins: [react()],
  server: { port: 5173, strictPort: true },
  build: { sourcemap: true }
};