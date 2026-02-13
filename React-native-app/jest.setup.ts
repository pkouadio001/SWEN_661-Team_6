import "@testing-library/jest-native/extend-expect";

jest.mock("expo-router", () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();

  const router = { push, replace, back };

  const useRouter = jest.fn(() => router);

  return {
    __esModule: true,
    router, // ✅ import { router } from "expo-router"
    useRouter, // ✅ import { useRouter } from "expo-router"
    default: { router, useRouter },
    __mock: { push, replace, back, router, useRouter },
  };
});
