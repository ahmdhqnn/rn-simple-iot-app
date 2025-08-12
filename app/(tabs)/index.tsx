import { Feather } from "@expo/vector-icons";
import React from "react";
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import BottomSheet from "../../components/BottomSheet";
import { useUI } from "../../providers/UIProvider";

// ======= TUNABLE =======
// tinggi card ~ setengah layar
const { height: H } = Dimensions.get("window");
const CARD_H = Math.round(H * 0.55);  // 55% layar (sesuaikan 0.50–0.60)
const OVERLAP = 300;                   // padi sedikit "masuk" card (px)
const TOP_INSET = 80;                 // jarak sheet dari atas saat expanded
// =======================

const riceImg = require("../../assets/images/examplepadi.png");

export default function Index() {
  const { setTabBarHidden } = useUI();
  const sheetY = useSharedValue(H);

  // Padi membesar & naik, lalu "duduk" di bibir card saat panel terbuka
  const riceAnim = useAnimatedStyle(() => {
    const y = sheetY.value; // 80 .. H
    const p = interpolate(y, [H, TOP_INSET], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(p, [0, 1], [1, 0.9]);               // sedikit lebih besar di state expanded
    const translateY = interpolate(p, [0, 1], [0, -(CARD_H - OVERLAP)]);
    return { transform: [{ scale }, { translateY }] };
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <Text style={styles.title}>Padi Monitor</Text>
          <TouchableOpacity>
            <Feather name="bell" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Gambar padi */}
        <View style={styles.hero}>
          <Animated.Image source={riceImg} resizeMode="contain" style={[styles.rice, riceAnim]} />
        </View>
      </SafeAreaView>

      {/* Panel detail (card setengah layar) */}
      <BottomSheet
        topInset={TOP_INSET}
        onExpandedChange={(v) => setTabBarHidden(v)}      // sembunyikan tab bar saat swipe up
        onPositionChange={(y) => { sheetY.value = y; }}   // sinkron animasi padi
      >
        <View style={[styles.cardWrap, { height: CARD_H, marginBottom: 16 }]}>
          <View style={styles.card}>
            {/* Header dots + label */}
            <View style={styles.kpiDotsRow}>
              <View style={styles.kpiDot} />
              <View style={styles.kpiDot} />
              <View style={styles.kpiDot} />
            </View>
            <View style={styles.kpiLabelRow}>
              <Text style={styles.kpiLabel}>5 m/s</Text>
              <Text style={styles.kpiLabel}>20 %</Text>
              <Text style={styles.kpiLabel}>1 Type</Text>
            </View>

            {/* Sliders + toggle kanan (dummy UI) */}
            {[
              { name: "Humidity", fill: 60 },
              { name: "Temperature", fill: 45 },
              { name: "Soil Moisture", fill: 70 },
              { name: "Water Level", fill: 85 },
            ].map((it) => (
              <View key={it.name} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.trackLabel}>{it.name}</Text>
                  <View style={styles.track}>
                    <View style={[styles.trackFill, { width: `${it.fill}%` }]} />
                    <View style={styles.trackCap} />
                  </View>
                </View>
                <View style={styles.toggleRing} />
              </View>
            ))}
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

/* ====== STYLES ====== */
const BG = "#FFF";         
const CARD = "#FFFFFFEE";     // putih semi (bisa diganti Blur nanti)
const TRACK = "#D0D0D0";
const FILL = "#6B6B6B";

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  safe: { flex: 1 },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: { fontSize: 20, fontWeight: "700", color: "#222" },

  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  rice: { width: "90%", height: "90%" },

  // Card setengah layar
  cardWrap: { paddingHorizontal: 16 },
  card: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  kpiDotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 6,
  },
  kpiDot: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#BEBEBE" },

  kpiLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 6,
    marginTop: 6,
    marginBottom: 14,
  },
  kpiLabel: { color: "#444", fontSize: 12 },

  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  rowLeft: { flex: 1, marginRight: 14 },

  trackLabel: { marginBottom: 6, color: "#444", fontSize: 13, fontWeight: "500" },
  track: {
    height: 32,
    borderRadius: 16,
    backgroundColor: TRACK,
    justifyContent: "center",
    overflow: "hidden",
  },
  trackFill: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    backgroundColor: FILL,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  trackCap: {
    position: "absolute",
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#D6D6D6",
  },
  toggleRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: "#C9C9C9",
  },
});
