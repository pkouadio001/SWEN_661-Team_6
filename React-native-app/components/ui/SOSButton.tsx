import { useTheme } from "@/context/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SOSButtonProps {
  onActivate?: () => void;
}

const HOLD_DURATION_MS = 5000;

export default function SOSButton({ onActivate }: SOSButtonProps) {
  const { highContrastMode } = useTheme();

  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0..1
  const [isActivated, setIsActivated] = useState(false);

  const holdStartRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startHold = () => {
    if (isActivated) return;

    setIsHolding(true);
    setHoldProgress(0);
    holdStartRef.current = Date.now();

    // complete after HOLD_DURATION_MS
    timerRef.current = setTimeout(() => {
      setIsActivated(true);
      setIsHolding(false);
      setHoldProgress(1);

      onActivate?.();

      // auto-reset after 3s
      setTimeout(() => {
        setIsActivated(false);
        setHoldProgress(0);
      }, 3000);
    }, HOLD_DURATION_MS);

    const tick = () => {
      const elapsed = Date.now() - holdStartRef.current;
      const p = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setHoldProgress(p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const endHold = () => {
    if (isActivated) return;
    clearTimers();
    setIsHolding(false);
    setHoldProgress(0);
  };

  useEffect(() => {
    return () => clearTimers(); // cleanup on unmount
  }, []);

  const bgColor = isActivated
    ? highContrastMode
      ? "#FFFF00"
      : "#22C55E"
    : isHolding
      ? highContrastMode
        ? "#FF6B6B"
        : "#DC2626"
      : "#EF4444";

  const textColor = isActivated
    ? highContrastMode
      ? "#000"
      : "#FFF"
    : highContrastMode
      ? "#FFFF00"
      : "#FFF";

  return (
    <View style={styles.container}>
      <Pressable
        onPressIn={startHold}
        onPressOut={endHold}
        disabled={isActivated}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={isActivated ? "SOS activated" : "Emergency SOS button"}
        accessibilityHint={isActivated ? "Emergency alert has been sent" : "Press and hold for 5 seconds to send emergency alert"}
        accessibilityState={{ disabled: isActivated }}
        style={[
          styles.button,
          { backgroundColor: bgColor },
          isHolding && styles.buttonHolding,
        ]}
      >
        {/* Simple progress ring substitute: a top bar that fills (RN-friendly) */}
        {isHolding && (
          <View 
            style={styles.progressTrack}
            accessible={true}
            accessibilityRole="progressbar"
            accessibilityLabel={`Emergency alert progress ${Math.round(holdProgress * 100)} percent`}
          >
            <View style={[styles.progressFill, { width: `${holdProgress * 100}%`, backgroundColor: highContrastMode ? "#FFFF00" : "rgba(255,255,255,0.6)" }]} />
          </View>
        )}

        <View style={styles.content}>
          <Text style={[styles.label, { color: textColor }]}>
            {isActivated ? "SOS SENT" : "SOS"}
          </Text>
          {!isActivated && (
            <Text style={[styles.subLabel, { color: textColor }]}>
              Hold 5s
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 9999,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6, // Android shadow
  },
  buttonHolding: {
    transform: [{ scale: 1.08 }],
  },
  content: {
    alignItems: "center",
  },
  label: {
    fontWeight: "800",
    fontSize: 12,
  },
  subLabel: {
    fontWeight: "700",
    fontSize: 10,
    opacity: 0.9,
  },
  progressTrack: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 6,
    width: "100%",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  progressFill: {
    height: "100%",
  },
});
