// app/analytics.tsx
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  LayoutChangeEvent,
  TouchableOpacity,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import Svg, { Rect, Polyline, Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { F } from "@/theme/fonts";
import { icon } from "@/constants/icon";

const BG = "#F5F6F8";
const CARD = "#FFFFFF";
const MUTED = "#E5E7EB";
const TEXT = "#111";
const SUBT = "#6B7280";
const ACCENT = "#C7FF1A";
const ACCENT_DARK = "#6CA800";
const wht = "#fff";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/* ============ Segmented ============ */
const SEGMENTS = ["Details", "Plant", "Task/Notes", "Device", "Activity"] as const;

function Segmented({ index, onChange }: { index: number; onChange: (i: number) => void }) {
  const w = React.useRef(0);
  const x = useSharedValue(0);

  const onLayout = (e: LayoutChangeEvent) => {
    w.current = e.nativeEvent.layout.width;
    x.value = withTiming((w.current / SEGMENTS.length) * index, { duration: 180 });
  };

  React.useEffect(() => {
    if (!w.current) return;
    x.value = withTiming((w.current / SEGMENTS.length) * index, { duration: 180 });
  }, [index, x]);

  const ind = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View onLayout={onLayout} style={styles.segmentWrap}>
      <Animated.View style={[styles.segmentIndicator, { width: `${100 / SEGMENTS.length}%` }, ind]} />
      {SEGMENTS.map((label, i) => {
        const active = i === index;
        return (
          <Pressable key={label} style={styles.segmentBtn} onPress={() => onChange(i)}>
            <Text style={[styles.segmentTxt, active && { color: TEXT, fontFamily: F.bold }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ============ MiniCard ============ */
function MiniStat({ iconEl, label, value }: { iconEl: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.minicard}>
      <View style={styles.miniIcon}>{iconEl}</View>
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.miniLabel}>{label}</Text>
        <Text style={styles.miniValue}>{value}</Text>
      </View>
    </View>
  );
}

/* ============ Charts ============ */
function BarChart({ data, height = 140, barColor = ACCENT }: { data: number[]; height?: number; barColor?: string }) {
  const pad = 16;
  const max = Math.max(...data, 1);
  const w = 12;
  const gap = 8;
  const width = pad * 2 + data.length * w + (data.length - 1) * gap;

  return (
    <Svg width={width} height={height}>
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <Rect key={i} x={pad} y={height * p} width={width - pad * 2} height={1} fill={MUTED} opacity={0.6} />
      ))}
      {data.map((v, i) => {
        const h = clamp((v / max) * (height - 24), 2, height - 24);
        const x = pad + i * (w + gap);
        const y = height - h - 8;
        return <Rect key={i} x={x} y={y} width={w} height={h} rx={4} fill={barColor} />;
      })}
    </Svg>
  );
}

function AreaChart({ data, height = 140, color = ACCENT, softFill = true }: { data: number[]; height?: number; color?: string; softFill?: boolean }) {
  const pad = 16;
  const n = data.length;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const width = pad * 2 + (n - 1) * 18;

  const pts = data
    .map((v, i) => {
      const x = pad + i * 18;
      const y = height - ((v - min) / (max - min || 1)) * (height - 16) - 8;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <Svg width={width} height={height}>
      {softFill && (
        <Defs>
          <LinearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.28" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
      )}
      {[0.25, 0.5, 0.75, 1].map((p, i) => (
        <Rect key={i} x={pad} y={height * p} width={width - pad * 2} height={1} fill={MUTED} opacity={0.6} />
      ))}
      {softFill && (
        <Path d={`M${pad},${height - 8} L${pts.replace(/ /g, " L")} L${width - pad},${height - 8} Z`} fill="url(#g1)" />
      )}
      <Polyline points={pts} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

/* ============ Sections ============ */
function SectionCard({ title, subtitle, children }: React.PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={styles.cardTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.cardSub}>{subtitle}</Text>}
      </View>
      <View>{children}</View>
    </View>
  );
}

function DetailsTab() {
  const temp = React.useMemo(() => Array.from({ length: 24 }, () => 20 + Math.random() * 12), []);
  const humi = React.useMemo(() => Array.from({ length: 30 }, () => 50 + Math.random() * 30), []);
  const soil = React.useMemo(() => Array.from({ length: 30 }, () => 30 + Math.random() * 40), []);
  const avg = (arr: number[]) => (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);

  return (
    <>
      <View style={styles.minicardRow}>
        <MiniStat iconEl={icon.analitik({ size: 18, color: TEXT })} label="Avg Temp" value={`${avg(temp)}°C`} />
        <MiniStat iconEl={icon.humidity({ size: 18, color: TEXT })} label="Avg Humidity" value={`${avg(humi)}%`} />
        <MiniStat iconEl={icon.devices({ size: 18, color: TEXT })} label="Devices Online" value="5/6" />
      </View>

      <SectionCard title="Temperature">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          <BarChart data={temp} />
        </ScrollView>
      </SectionCard>

      <SectionCard title="Humidity">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          <AreaChart data={humi} />
        </ScrollView>
      </SectionCard>

      <SectionCard title="Soil Moisture">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          <AreaChart data={soil} color={ACCENT_DARK} />
        </ScrollView>
      </SectionCard>
    </>
  );
}

function PlantTab() {
  return (
    <>
      <SectionCard title="Plant Overview" subtitle="Padi · Phase: Tillering">
        <View style={styles.rowBetween}>
          <MiniStat iconEl={icon.analitik({ size: 18, color: TEXT })} label="Health" value="92% Good" />
          <MiniStat iconEl={icon.wind({ size: 18, color: TEXT })} label="VPD" value="1.1 kPa" />
          <MiniStat iconEl={icon.precipitation({ size: 18, color: TEXT })} label="Irrigation" value="Moderate" />
        </View>
      </SectionCard>

      <SectionCard title="Growth (NDVI proxy)">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 8 }}>
          <AreaChart data={Array.from({ length: 28 }, (_, i) => 60 + Math.sin(i / 3) * 20 + Math.random() * 6)} />
        </ScrollView>
      </SectionCard>
    </>
  );
}

function TaskTab() {
  const items = [
    { id: "t1", title: "Watering", note: "0.8 inch this morning", time: "07:00" },
    { id: "t2", title: "Fertilizing", note: "NPK 16-16-16 2 kg/ha", time: "09:30" },
    { id: "t3", title: "Pest inspection", note: "Check leafhopper", time: "16:00" },
  ];
  return (
    <SectionCard title="Tasks & Notes" subtitle="Last 7 days">
      {items.map((t, i) => (
        <View key={t.id} style={[styles.taskItem, i < items.length - 1 && styles.divider]}>
          <View style={styles.miniIcon}>{icon.notes({ size: 18, color: TEXT })}</View>
          <View style={{ flex: 1 }}>
            <Text style={styles.taskTitle}>{t.title}</Text>
            <Text style={styles.taskNote}>{t.note}</Text>
          </View>
          <Text style={styles.taskTime}>{t.time}</Text>
        </View>
      ))}
    </SectionCard>
  );
}

function DeviceTab() {
  const rows = [
    { id: "d1", name: "#TH101 · Temp&Humidity", status: "Online", value: "OK" },
    { id: "d2", name: "#WS004 · Weather Station", status: "Online", value: "OK" },
    { id: "d3", name: "#SM201 · Soil Moisture", status: "Offline", value: "-" },
  ];
  return (
    <SectionCard title="Devices">
      {rows.map((r, i) => (
        <View key={r.id} style={[styles.devRow, i < rows.length - 1 && styles.divider]}>
          <View style={[styles.statusDot, { backgroundColor: r.status === "Online" ? "#22C55E" : "#9CA3AF" }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.devName}>{r.name}</Text>
            <Text style={styles.devSub}>{r.status}</Text>
          </View>
          <Text style={styles.devVal}>{r.value}</Text>
        </View>
      ))}
    </SectionCard>
  );
}

function ActivityTab() {
  const logs = [
    { id: "a1", msg: "Signal issue from sensor #TH101", time: "08:02" },
    { id: "a2", msg: "Irrigation cycle started", time: "06:30" },
    { id: "a3", msg: "AI: Temperature trend rising", time: "Yesterday" },
  ];
  return (
    <SectionCard title="Activity">
      {logs.map((l, i) => (
        <View key={l.id} style={[styles.activityRow, i < logs.length - 1 && styles.divider]}>
          <View style={styles.miniIcon}>{icon.notification({ size: 18, color: TEXT })}</View>
          <View style={{ flex: 1 }}>
            <Text style={styles.activityMsg}>{l.msg}</Text>
            <Text style={styles.activityTime}>{l.time}</Text>
          </View>
        </View>
      ))}
    </SectionCard>
  );
}

export default function AnalyticsScreen() {
  const router = useRouter();
  const [seg, setSeg] = React.useState(0);
  const headerP = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => {
    const s = interpolate(headerP.value, [0, 80], [1, 0.92], Extrapolation.CLAMP);
    const t = interpolate(headerP.value, [0, 80], [0, -8], Extrapolation.CLAMP);
    return { transform: [{ scale: s }, { translateY: t }] };
  });

  return (
    <SafeAreaView style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* TOP ACTION BUTTONS */}
      <View pointerEvents="box-none" style={styles.topButtonsRow}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()} style={styles.circleBtn}>
          {icon.chevronleft({ size: 24, color: "#111" })}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            // TODO: open menu/sheet
          }}
          style={styles.circleBtn}
        >
          {icon.moredote({ size: 24, color: "#111" })}
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.appbar, headerStyle]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.appIcon}>{icon.analitik({ size: 22, color: TEXT })}</View>
          <View>
            <Text style={styles.h1}>Analytics</Text>
            <Text style={styles.h2}>Greenhouse 1 · Bandung</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => (headerP.value = e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <Segmented index={seg} onChange={setSeg} />

        <View style={{ height: 12 }} />
        {seg === 0 && <DetailsTab />}
        {seg === 1 && <PlantTab />}
        {seg === 2 && <TaskTab />}
        {seg === 3 && <DeviceTab />}
        {seg === 4 && <ActivityTab />}

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ============ Styles ============ */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // TOP ACTION BUTTONS (match Home circle buttons)
  topButtonsRow: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 8,
    zIndex: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  circleBtn: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  appbar: { paddingHorizontal: 16, paddingTop: 90, paddingBottom: 6, backgroundColor: BG },
  appIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: CARD,
    alignItems: "center", justifyContent: "center", marginRight: 10,
  },
  h1: { fontSize: 24, color: TEXT, fontFamily: F.semibold },
  h2: { fontSize: 12, color: SUBT, fontFamily: F.medium },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  segmentWrap: {
    flexDirection: "row", backgroundColor: CARD, borderRadius: 16,
    overflow: "hidden", borderWidth: 1, borderColor: MUTED,
  },
  segmentIndicator: { position: "absolute", top: 0, bottom: 0, backgroundColor: "#F2FCE1" },
  segmentBtn: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
  segmentTxt: { fontSize: 12, color: SUBT, fontFamily: F.medium },

  card: { marginTop: 12, backgroundColor: CARD, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: MUTED },
  cardHead: { marginBottom: 8 },
  cardTitle: { fontSize: 16, color: TEXT, fontFamily: F.bold },
  cardSub: { fontSize: 12, color: SUBT, fontFamily: F.medium },

  minicardRow: { flexDirection: "row", gap: 10 },
  minicard: { flex: 1, backgroundColor: CARD, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: MUTED, flexDirection: "row", alignItems: "center" },
  miniIcon: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#EEF6D3" },
  miniLabel: { fontSize: 11, color: SUBT, fontFamily: F.medium },
  miniValue: { fontSize: 14, color: TEXT, fontFamily: F.bold },

  rowBetween: { flexDirection: "row", gap: 10 },

  taskItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: MUTED },
  taskTitle: { fontSize: 14, color: TEXT, fontFamily: F.bold },
  taskNote: { fontSize: 12, color: SUBT, fontFamily: F.medium },
  taskTime: { fontSize: 12, color: TEXT, fontFamily: F.semibold },

  devRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 10 },
  devName: { fontSize: 14, color: TEXT, fontFamily: F.bold },
  devSub: { fontSize: 12, color: SUBT, fontFamily: F.medium },
  devVal: { fontSize: 12, color: TEXT, fontFamily: F.semibold },

  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  activityMsg: { fontSize: 14, color: TEXT, fontFamily: F.bold },
  activityTime: { fontSize: 12, color: SUBT, fontFamily: F.medium },
});
