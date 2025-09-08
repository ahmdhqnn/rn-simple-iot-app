import { icon } from "@/constants/icon";
import { F } from "@/theme/fonts";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const riceImg = require("../../assets/images/examplepadi.png");

export default function Index() {
  const router = useRouter();
  const moreItems = [
    { key: "analytics", label: "Analitik", icon: icon.analitik({ size: 24, color: "#fff" }), onPress: () => router.push("/analytics") },
    { key: "notes", label: "Notes", icon: icon.notes({ size: 24, color: "#fff" }), onPress: () => { } },
    { key: "ai", label: "AI assist", icon: icon.aiassist({ size: 24, color: "#fff" }), onPress: () => { } },
    { key: "weather", label: "Weather", icon: icon.weather({ size: 24, color: "#fff" }), onPress: () => router.push("/weather") },
    { key: "device", label: "Device", icon: icon.devices({ size: 24, color: "#fff" }), onPress: () => router.push("/device") },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* ===== Header persis referensi ===== */}
        <HeaderProfile
          name="Ahmad"
          tagline="Kebun padi siap di awasi hari ini."
          notifDot
        />

        {/* Judul besar + search row */}
        <Text style={styles.bigTitle}>What are you looking for today?</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchField}>
            <View style={{ marginRight: 6 }}>
              {icon.search({ size: 18, color: "#9CA3AF" })}
            </View>
            <TextInput
              placeholder="Search here"
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
          <TouchableOpacity style={styles.smallCircle}>
            <Feather name="sliders" size={18} color="#111" />
          </TouchableOpacity>
        </View>

        {/* ===== Main Card ===== */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.locationChip}>
              {icon.location({ size: 14, color: "#111" })}
              <Text style={styles.locationText} numberOfLines={1}>BTP-Telkom, Bandung</Text>
            </View>
          </View>

          <View style={styles.hero}>
            <View style={styles.plantWrap}>
              <Image source={riceImg} resizeMode="contain" style={styles.plant} />
            </View>

            <View style={styles.headerRow}>
              <View style={styles.tempRow}>
                <Text style={styles.plus}>+</Text>
                <Text style={styles.tempMain}>17</Text>
                <Text style={styles.tempUnit}>°C</Text>
              </View>
              <View style={styles.hlBlock}>
                <Text style={styles.hlText}>H:23°C</Text>
                <Text style={styles.hlText}>L:14°C</Text>
              </View>
            </View>

            <View style={styles.metricPair}>
              <View style={styles.metricCellLeft}>
                <Metric label="Humidity" value="30%" iconEl={icon.humidity({ size: 20, color: "#C7FF1A" })} />
              </View>
              <View style={styles.metricCellRight}>
                <Metric label="Wind" value="23 m/s" align="right" iconEl={icon.wind({ size: 20, color: "#C7FF1A" })} />
              </View>
            </View>

            <View style={styles.metricPair}>
              <View style={styles.metricCellLeft}>
                <Metric label="Pressure" value="450 hPa" iconEl={icon.pressure({ size: 20, color: "#C7FF1A" })} />
              </View>
              <View style={styles.metricCellRight}>
                <Metric label="Precipitation" value="5.1 ml" align="right" iconEl={icon.precipitation({ size: 20, color: "#C7FF1A" })} />
              </View>
            </View>
          </View>

          <Pressable
            style={({ hovered, pressed }) => [
              styles.detailsBtn,
              (hovered || pressed) && styles.detailsBtnHover,
            ]}
          >
            {({ hovered, pressed }) => {
              const active = hovered || pressed;
              return (
                <>
                  <Text style={[styles.detailsTxt, active && styles.detailsTxtHover]}>Crop Details</Text>
                  <View style={styles.detailsIconWrap}>
                    {icon.arrowrightbtn({ size: 24, color: active ? "#C7FF1A" : "#9CA3AF" })}
                  </View>
                </>
              );
            }}
          </Pressable>
        </View>

        {/* ===== More menu ===== */}
        <View style={styles.moreWrap}>
          <Text style={styles.sectionTitle}>More menu</Text>
          <View style={styles.menuCard}>
            {moreItems.map((it) => (
              <MenuItem key={it.key} label={it.label} icon={it.icon} onPress={it.onPress} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- Header Profile ---------- */
function HeaderProfile({
  name,
  tagline,
  notifDot = true,
}: {
  name?: string;
  tagline?: string;
  notifDot?: boolean;
}) {
  const hour = new Date().getHours();
  const segment = hour < 11 ? "Morning" : hour < 15 ? "Afternoon" : hour < 19 ? "Evening" : "Night";
  const displayName = (name ?? "User").toLowerCase();

  return (
    <View style={styles.headerTop}>
      {/* kiri: avatar + block teks */}
      <View style={styles.headerLeft}>
        <View style={styles.avatar} />
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>{segment}, {displayName}</Text>
          {!!tagline && <Text style={styles.headerSub} numberOfLines={1}>{tagline}</Text>}
        </View>
      </View>

      {/* kanan: action */}
      <View style={styles.headerActions}>
        <CircleIcon icon={icon.search({ size: 24, color: "#111" })} />
        <CircleIcon icon={icon.notification({ size: 24, color: "#111" })} />
        {/* dot={notifDot} */}
      </View>
    </View>
  );
}

/* ---------- Small blocks ---------- */
function CircleIcon({
  icon,
  onPress,
  dot = false,
}: {
  icon: React.ReactNode;
  onPress?: () => void;
  dot?: boolean;
}) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.circleIcon}>
      {icon}
      {dot && <View style={styles.redDot} />}
    </TouchableOpacity>
  );
}

function Metric({
  label,
  value,
  align = "left",
  iconEl,
}: {
  label: string;
  value: string;
  align?: "left" | "right";
  iconEl?: React.ReactNode;
}) {
  const right = align === "right";
  return (
    <View style={[styles.metricRow, right && styles.metricRowRight]}>
      <View style={styles.metricIcon}>{iconEl ?? <Feather name="wind" size={14} color="#222" />}</View>
      <View style={[styles.metricText, right && styles.metricTextRight]}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}

function MenuItem({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      {({ hovered, pressed }) => {
        const active = hovered || pressed;
        return (
          <>
            <View style={[styles.menuIconWrap, active && styles.menuIconWrapHover]}>
              {icon}
            </View>
            <Text style={styles.menuLabel} numberOfLines={1}>{label}</Text>
          </>
        );
      }}
    </Pressable>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6F8" },
  content: { paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 28 },

  /* header */
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D9D9D9",
  },
  headerTextWrap: { marginLeft: 10, justifyContent: "center" },
  headerTitle: { fontSize: 16, color: "#111", fontFamily: F.bold },
  headerSub: { fontSize: 12, color: "#111", fontFamily: F.medium },

  headerActions: { flexDirection: "row", gap: 10 },
  circleIcon: {
    width: 56, height: 56, borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    elevation: 2,
    shadowColor: "rgba(0,0,0,0.08)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 4,
    position: "relative",
  },
  redDot: {
    position: "absolute", right: 7, top: 7,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: "#FF3B30", borderWidth: 1, borderColor: "#fff",
  },

  /* big title + search */
  bigTitle: { marginTop: 40, fontSize: 24, lineHeight: 30, color: "#111", fontFamily: F.bold },
  searchRow: { marginTop: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  searchField: {
    flex: 1, height: 48, borderRadius: 26, backgroundColor: "#fff",
    paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 8,
  },
  searchInput: { flex: 1, paddingVertical: 0, fontSize: 14, color: "#111" },
  smallCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#fff", alignItems: "center", justifyContent: "center",
  },

  /* main card */
  card: { marginTop: 14, backgroundColor: "#FFF", borderRadius: 18, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 24 },
  cardHead: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  locationChip: {
    maxWidth: "78%", flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 10, height: 28, borderRadius: 16, backgroundColor: "#EDEFF3",
  },
  locationText: { fontSize: 12, color: "#111", fontFamily: F.bold },

  hero: { position: "relative", paddingTop: 4, paddingBottom: 8, minHeight: 225 },
  plantWrap: { position: "absolute", top: -40, left: 0, right: 0, alignItems: "center", pointerEvents: "none" },
  plant: { width: 300, height: 300 },

  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 },
  tempRow: { flexDirection: "row", alignItems: "flex-start" },
  plus: { fontSize: 28, color: "#111", marginRight: 2, lineHeight: 36, fontFamily: F.medium },
  tempMain: { fontSize: 56, lineHeight: 56, color: "#111", marginBottom: 70, fontFamily: F.bold },
  tempUnit: { marginTop: 6, marginLeft: 4, fontSize: 22, color: "#111", fontFamily: F.bold },
  hlBlock: { alignItems: "flex-end" },
  hlText: { fontSize: 12, color: "#2B2BE", lineHeight: 16, fontFamily: F.semibold },

  metricPair: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  metricCellLeft: { width: "45%", alignItems: "flex-start" },
  metricCellRight: { width: "45%", alignItems: "flex-end" },
  metricRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metricRowRight: { alignSelf: "flex-end", justifyContent: "flex-end" },
  metricIcon: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#F2FCE1" },
  metricTextRight: { width: 78, alignItems: "flex-start" },
  metricText: {},
  metricLabel: { fontSize: 12, color: "#6B7280", fontFamily: F.medium },
  metricValue: { fontSize: 15, color: "#111", fontFamily: F.bold },

  detailsBtn: {
    marginTop: 12, height: 52, borderRadius: 14,
    backgroundColor: "#ECEFF3", borderWidth: 1, borderColor: "#C9CDD6",
    alignItems: "center", justifyContent: "center",
  },
  detailsBtnHover: { backgroundColor: "#F2FCE1", borderColor: "#C7FF1A" },
  detailsTxt: { fontSize: 15, color: "#1f1f1f", fontFamily: F.bold },
  detailsTxtHover: { color: "#C7FF1A" },
  detailsIconWrap: { position: "absolute", right: 16, top: 0, bottom: 0, justifyContent: "center", alignItems: "center" },

  /* more menu */
  moreWrap: { marginTop: 16 },
  sectionTitle: { fontSize: 16, color: "#1A1A1A", marginBottom: 8, fontFamily: F.medium },
  menuCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 14, paddingHorizontal: 12, backgroundColor: "#FFF", borderRadius: 22 },
  menuItem: { width: 64, alignItems: "center", justifyContent: "center" },
  menuIconWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: "#C7FF1A", alignItems: "center", justifyContent: "center", marginBottom: 6 },
  menuIconWrapHover: { backgroundColor: "#F2FCE1" },
  menuLabel: { fontSize: 12, color: "#111", fontFamily: F.medium },
});
