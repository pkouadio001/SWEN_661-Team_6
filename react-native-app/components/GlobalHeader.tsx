import { useRouter, useSegments } from "expo-router";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import SOSButton from "@/components/ui/SOSButton";
import { useTheme } from "@/context/ThemeContext";

export default function GlobalHeader() {
  const router = useRouter();
  const segments = useSegments();
  const { highContrastMode } = useTheme();

  const isLoginLikeScreen = useMemo(() => {
    const path = "/" + segments.join("/");
    return path === "/" || path === "/register" || path.includes("forgot") || path.includes("login");
  }, [segments]);

  const handleSOSActivation = () => {
    router.push("/emergency-sos");
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        { backgroundColor: highContrastMode ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)" },
      ]}
    >
      {!isLoginLikeScreen && <SOSButton onActivate={handleSOSActivation} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 9999,
  },
});
