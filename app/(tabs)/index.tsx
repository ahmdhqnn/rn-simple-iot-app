import { icon } from "@/constants/icon";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const riceImg = require("../../assets/images/examplepadi.png");

export default function Index() {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.appbarSpacer} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top App Bar (tanpa title) */}
        <View style={styles.appbar}>
          <View style={styles.appbarActions}>
            <CircleIcon icon={icon.search({ size: 24, color: "#000" })} />
            <CircleIcon icon={icon.notification({ size: 24, color: "#000" })} />
          </View>
        </View>


        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.locationChip}>
              {icon.location({ size: 14, color: "#111" })}
              <Text style={styles.locationText} numberOfLines={1}>BTP-Telkom, Bandung</Text>
            </View>
          </View>

          {/* ===== HERO (plant center + headerRow + metric pairs) ===== */}
          <View style={styles.hero}>
            {/* plant center */}
            <View style={styles.plantWrap}>
              <Image source={riceImg} resizeMode="contain" style={styles.plant} />
            </View>

            {/* +17°C (kiri)  —  H/L (kanan) */}
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

            {/* Baris 1: Humidity (kiri) — Wind (kanan) */}
            <View style={styles.metricPair}>
              <View style={styles.metricCellLeft}>
                <Metric label="Humidity" value="30%" iconEl={icon.humidity({ size: 20, color: "#C7FF1A" })} />
              </View>
              <View style={styles.metricCellRight}>
                <Metric label="Wind" value="23 m/s" align="right" iconEl={icon.wind({ size: 20, color: "#C7FF1A" })} />
              </View>
            </View>

            {/* Baris 2: Pressure (kiri) — Precipitation (kanan) */}
            <View style={styles.metricPair}>
              <View style={styles.metricCellLeft}>
                <Metric label="Pressure" value="450 hPa" iconEl={icon.pressure({ size: 20, color: "#C7FF1A" })} />
              </View>
              <View style={styles.metricCellRight}>
                <Metric label="Precipitation" value="5.1 ml" align="right" iconEl={icon.precipitation({ size: 20, color: "#C7FF1A" })} />
              </View>
            </View>
          </View>

          {/* Tombol */}

          <Pressable
            android_ripple={{ color: "#F2FCE4" }}
            style={({ hovered, pressed }) => [
              styles.detailsBtn,
              (hovered || pressed) && styles.detailsBtnHover,
            ]}
          >
            {({ hovered, pressed }) => {
              const active = hovered || pressed;
              return (
                <>
                  <Text style={[styles.detailsTxt, active && styles.detailsTxtHover]}>
                    Crop Details
                  </Text>

                  {/* Arrow di kanan, tidak mengganggu center text */}
                  <View style={styles.detailsIconWrap}>
                    {icon.arrowrightbtn({
                      size: 24,
                      color: active ? "#C7FF1A" : "#9CA3AF",
                    })}
                  </View>
                </>
              );
            }}
          </Pressable>

        </View>

        {/* Notes */}
        {/* <View style={styles.notesWrap}>
          <Text style={styles.notesTitle}>Notes</Text>
          <NoteItem time="Aug 25 | 5:43 pm" text="Excellent harvest, the grapes have a rich flavor and aroma" />
          <NoteItem time="Aug 24 | 2:16 pm" text="Excellent harvest, the grapes have a rich flavor and aroma" />
          <TouchableOpacity activeOpacity={0.9} style={styles.addBtn}>
            <Feather name="plus" size={18} color="#1f1f1f" />
            <Text style={styles.addTxt}>Add New Note</Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

function CircleIcon({ icon, onPress }: { icon: React.ReactNode; onPress?: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.circleIcon}>
      {icon}
    </TouchableOpacity>
  );
}

/** Metric item
 * align="right" -> teks rata kanan + lebar teks tetap,
 * sehingga posisi ikon kanan 100% sejajar antar baris.
 */
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
      <View style={styles.metricIcon}>
        {iconEl ?? <Feather name="wind" size={14} color="#222" />}
      </View>
      <View style={[styles.metricText, right && styles.metricTextRight]}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
    </View>
  );
}


// function NoteItem({ time, text }: { time: string; text: string }) {
//   return (
//     <View style={styles.noteItem}>
//       <View style={styles.noteThumb} />
//       <View style={{ flex: 1 }}>
//         <Text style={styles.noteTime}>{time}</Text>
//         <Text style={styles.noteText} numberOfLines={2}>{text}</Text>
//       </View>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F6F8" },
  content: { paddingVertical: 16, paddingHorizontal: 16, paddingBottom: 28 },

  /* app bar */
  appbar: {
    position: 'relative',
    height: 80,              // cukup tinggi biar action bisa "agak bawah"
    marginBottom: 0,
  },
  appbarActions: {
    position: 'absolute',
    right: 16,               // tetap kanan atas
    top: 12,                 // agak lebih rendah dari tepi atas
    flexDirection: 'row',
    gap: 10,
  },
  appbarSpacer: {
    height: 36,              // ruang ekstra sebelum card (bisa 12–16 sesuai selera)
  },

  circleIcon: {
    width: 50, height: 50, borderRadius: 50,
    backgroundColor: "#ECEFF3", alignItems: "center", justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C9CDD6",
  },

  /* card */
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 24,          // ↑ beri ruang ke bawah untuk card header
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  locationChip: {
    maxWidth: "78%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 16,
    backgroundColor: "#EDEFF3",
  },
  locationText: { fontSize: 12, fontWeight: "700", color: "#111" },

  /* HERO layout */
  hero: {
    position: "relative",
    paddingTop: 4,
    paddingBottom: 8,
    minHeight: 225,                 // ruang total agar plant muat
  },
  plantWrap: {
    position: "absolute",
    top: -40,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
  },
  plant: { width: 300, height: 300 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 22,               // TURUNKAN metrik (lebih bawah)
  },
  tempRow: { flexDirection: "row", alignItems: "flex-start" },
  plus: { fontSize: 28, fontWeight: "800", color: "#111", marginRight: 2, lineHeight: 36 },
  tempMain: { fontSize: 56, lineHeight: 56, fontWeight: "800", color: "#111", marginBottom: 70 },
  tempUnit: { marginTop: 6, marginLeft: 4, fontSize: 22, fontWeight: "700", color: "#111" },

  hlBlock: { alignItems: "flex-end" },
  hlText: { fontSize: 12, color: "#2B2B2E", fontWeight: "600", lineHeight: 16 },


  /* metric pairs (sejajar kiri–kanan) */
  metricPair: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricCellLeft: { width: "45%", alignItems: "flex-start" },
  metricCellRight: { width: "45%", alignItems: "flex-end" },

  metricRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  metricRowRight: { alignSelf: "flex-end", justifyContent: "flex-end" },

  metricIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "#F2FCE1",
  },
  // lebar tetap agar ikon kanan SELALU di garis yang sama pada dua baris
  metricTextRight: { width: 68, alignItems: "flex-start" },

  metricText: {},
  metricLabel: { fontSize: 12, color: "#6B7280" },
  metricValue: { fontSize: 15, color: "#111", fontWeight: "800" },

  /* tombol */
  detailsBtn: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#ECEFF3",
    borderWidth: 1,
    borderColor: "#C9CDD6",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBtnHover: {
    backgroundColor: "#F2FCE1",
    borderColor: "#C7FF1A",
  },
  detailsTxt: { fontSize: 15, fontWeight: "700", color: "#1f1f1f" },
  detailsTxtHover: { color: "#C7FF1A" },
  detailsIconWrap: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  /* notes */
  notesWrap: { marginTop: 16, gap: 12 },
  notesTitle: { fontSize: 14, fontWeight: "800", color: "#1A1A1A" },
  noteItem: { flexDirection: "row", gap: 12, alignItems: "center", paddingVertical: 6 },
  noteThumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: "#DBDEE4" },
  noteTime: { fontWeight: "800", color: "#111", fontSize: 13, marginBottom: 2 },
  noteText: { color: "#3B3B3B", fontSize: 13, lineHeight: 18 },

  addBtn: {
    marginTop: 6,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#ECEFF3",
    borderWidth: 1,
    borderColor: "#C9CDD6",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  addTxt: { fontSize: 15, fontWeight: "800", color: "#1f1f1f" },
});
