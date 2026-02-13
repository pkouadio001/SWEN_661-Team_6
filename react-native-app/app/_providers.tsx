<<<<<<< HEAD
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
=======
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
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
