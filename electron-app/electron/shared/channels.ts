export const IPC = {
  QUIT_APP: "app:quit",
  NAVIGATE: "app:navigate",
  GET_VERSION: "app:getVersion"
} as const;

export type NavigatePayload = { route: "/login" | "/dashboard" };