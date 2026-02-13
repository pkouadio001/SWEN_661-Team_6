import { HealthLogsProvider } from "@/context/HealthLogsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <HealthLogsProvider>{children}</HealthLogsProvider>
    </ThemeProvider>
  );
}
