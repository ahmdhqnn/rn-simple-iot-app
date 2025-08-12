import React, { PropsWithChildren, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

type Props = PropsWithChildren<{
  onExpandedChange?: (expanded: boolean) => void;
  onPositionChange?: (y: number) => void;
  topInset?: number;        // posisi saat expanded dari atas
  activationHeight?: number;// tinggi zona swipe saat tertutup
}>;

const SPRING = { damping: 18, stiffness: 180 };

export default function BottomSheet({
  children,
  onExpandedChange,
  onPositionChange,
  topInset = 80,
  activationHeight = 24,
}: Props) {
  const { height: H } = useWindowDimensions();
  const TOP = topInset;
  const BOTTOM = H; // tertutup penuh

  const [isExpanded, setIsExpanded] = useState(false);
  const y = useSharedValue(BOTTOM);

  // helper aman untuk panggil JS dari worklet
  const safeEmit = (dest: number) => {
    const next = dest === TOP;
    if (onPositionChange) onPositionChange(dest);
    setIsExpanded(next);
    if (onExpandedChange) onExpandedChange(next);
  };
  const safeEmitWorklet = (dest: number) => {
    'worklet';
    if (onPositionChange) runOnJS(onPositionChange)(dest);
    runOnJS(setIsExpanded)(dest === TOP);
    if (onExpandedChange) runOnJS(onExpandedChange)(dest === TOP);
  };

  // gesture sheet (saat sudah terlihat)
  const panSheet = Gesture.Pan()
    .onChange((e) => {
      'worklet';
      y.value = Math.min(Math.max(y.value + e.changeY, TOP), BOTTOM);
      if (onPositionChange) runOnJS(onPositionChange)(y.value);
    })
    .onEnd(() => {
      'worklet';
      const middle = (TOP + BOTTOM) / 2;
      const dest = y.value < middle ? TOP : BOTTOM;
      y.value = withSpring(dest, SPRING);
      safeEmitWorklet(dest);
    });

  // zona aktivasi (saat sheet tertutup)
  const panActivator = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .onChange((e) => {
      'worklet';
      y.value = Math.min(Math.max(BOTTOM + e.translationY, TOP), BOTTOM);
      if (onPositionChange) runOnJS(onPositionChange)(y.value);
    })
    .onEnd(() => {
      'worklet';
      const middle = (TOP + BOTTOM) / 2;
      const dest = y.value < middle ? TOP : BOTTOM;
      y.value = withSpring(dest, SPRING);
      safeEmitWorklet(dest);
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  const handleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(y.value, [TOP, BOTTOM], [0.35, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <>
      {!isExpanded && (
        <GestureDetector gesture={panActivator}>
          <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: activationHeight, zIndex: 30 }} />
        </GestureDetector>
      )}

<GestureDetector gesture={panSheet}>
  <Animated.View style={[styles.sheet, sheetStyle]}>
    {/* Sembunyikan handle */}
    {/* <Animated.View style={[styles.handle, handleStyle]} /> */}
    <View style={styles.inner}>{children}</View>
  </Animated.View>
</GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
    sheet: {
      position: "absolute",
      top: 0, left: 0, right: 0, height: "100%",
      backgroundColor: "transparent",
      zIndex: 25,
    },
    inner: { flex: 1, justifyContent: "flex-end" },
    handle: { display: "none" }, // <- aman kalau View‑nya masih ada
  });
