// app/device.tsx
import { icon } from "@/constants/icon";
import { F } from "@/theme/fonts";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";

/* THEME */
const BG = "#F5F6F8";
const CARD = "#FFFFFF";
const TEXT = "#111";
const SUBT = "#6B7280";
const MUTED = "#E5E7EB";
const ACCENT = "#C7FF1A";

/* ====== Small helpers ====== */
const rooms = ["All", "Section A", "Section B", "Section C"] as const;
type Room = (typeof rooms)[number];

type Dev = {
    id: string;
    name: string;
    room: Room;
    type: "fan" | "pump" | "light" | "camera" | "sensor";
    online: boolean;
    on: boolean;
    meta?: string; // misal "Philips 20W"
};

/* Dummy devices */
const seed: Dev[] = [
    { id: "d1", name: "Vent Fan", room: "Section A", type: "fan", online: true, on: true, meta: "Exhaust 300mm" },
    { id: "d2", name: "Irrigation Pump", room: "Section A", type: "pump", online: true, on: false, meta: "0.6 bar" },
    { id: "d3", name: "Grow Light", room: "Section B", type: "light", online: true, on: true, meta: "LED 120W" },
    { id: "d4", name: "Camera 1", room: "Section B", type: "camera", online: true, on: true, meta: "1080p" },
    { id: "d5", name: "Soil Sensor", room: "Section C", type: "sensor", online: false, on: false, meta: "SM-201" },
];

/* ====== Icons ====== */
function DeviceGlyph({ type, size = 18, color = TEXT }: { type: Dev["type"]; size?: number; color?: string }) {
    // gunakan icon yang sudah ada supaya aman
    switch (type) {
        case "fan":
            return icon.wind({ size, color });
        case "pump":
            return icon.precipitation({ size, color });
        case "light":
            return icon.weather({ size, color });
        case "camera":
            return icon.notification({ size, color });
        default:
            return icon.devices({ size, color });
    }
}

/* ====== Power icon (SVG biar konsisten, tidak butuh glyph baru) ====== */
function PowerIcon({ size = 20, color = TEXT }: { size?: number; color?: string }) {
    const r = size / 2 - 2;
    const c = Math.PI * r * 2;
    return (
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={color}
                strokeWidth={2}
                fill="none"
                strokeDasharray={`${c * 0.8} ${c}`}
                strokeDashoffset={c * 0.1}
                strokeLinecap="round"
            />
            <Path
                d={`M${size / 2} ${size / 2 - r} v${r * 0.6}`}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

/* ====== iOS-like Switch ====== */
function Toggle({
    value,
    onChange,
}: { value: boolean; onChange: (v: boolean) => void }) {
    const p = useSharedValue(value ? 1 : 0);
    React.useEffect(() => { p.value = withTiming(value ? 1 : 0, { duration: 160 }); }, [value]);

    const s = useAnimatedStyle(() => {
        const bg = `rgba(${Math.round(ACCENT_RGB.r)},${Math.round(ACCENT_RGB.g)},${Math.round(ACCENT_RGB.b)},${0.25 + 0.55 * p.value})`;
        return { backgroundColor: p.value > 0.5 ? bg : "#E5E7EB" };
    });
    const knob = useAnimatedStyle(() => ({
        transform: [{ translateX: withTiming(p.value * 22) }],
    }));

    return (
        <Pressable onPress={() => onChange(!value)} style={styles.toggleWrap}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.toggleBg, s]} />
            <Animated.View style={[styles.toggleKnob, knob]} />
        </Pressable>
    );
}

/* helper to get rgb for switch bg */
const ACCENT_RGB = hexToRgb(ACCENT);
function hexToRgb(hex: string) {
    const h = hex.replace("#", "");
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

/* ====== Filter Pills ====== */
function RoomChips({
    active,
    onChange,
}: { active: Room; onChange: (r: Room) => void }) {
    return (
        <View style={styles.chipsRow}>
            {rooms.map((r) => {
                const a = r === active;
                return (
                    <TouchableOpacity key={r} onPress={() => onChange(r)} activeOpacity={0.9}>
                        <View style={[styles.chip, a && styles.chipActive]}>
                            <Text style={[styles.chipTxt, a && styles.chipTxtActive]}>{r}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/* ====== Device Tile ====== */
function DeviceTile({
    dev,
    onToggle,
}: { dev: Dev; onToggle: (id: string, v: boolean) => void }) {
    const dotColor = dev.online ? "#22C55E" : "#9CA3AF";
    return (
        <View style={styles.tile}>
            <View style={styles.tileHead}>
                <View style={styles.tileIcon}>
                    <DeviceGlyph type={dev.type} />
                </View>
                <Toggle value={dev.on} onChange={(v) => onToggle(dev.id, v)} />
            </View>

            <Text style={styles.tileName} numberOfLines={1}>{dev.name}</Text>
            {!!dev.meta && <Text style={styles.tileMeta} numberOfLines={1}>{dev.meta}</Text>}

            <View style={styles.tileFoot}>
                <View style={[styles.dot, { backgroundColor: dotColor }]} />
                <Text style={styles.tileStatus}>{dev.online ? "Online" : "Offline"}</Text>
                <View style={{ marginLeft: "auto" }}>
                    <PowerIcon size={18} color={dev.on ? TEXT : "#A1A1AA"} />
                </View>
            </View>
        </View>
    );
}

/* ====== Screen ====== */
export default function DeviceScreen() {
    const router = useRouter();

    const [room, setRoom] = React.useState<Room>("All");
    const [list, setList] = React.useState<Dev[]>(seed);

    const headerP = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => {
        const s = interpolate(headerP.value, [0, 80], [1, 0.92], Extrapolation.CLAMP);
        const t = interpolate(headerP.value, [0, 80], [0, -8], Extrapolation.CLAMP);
        return { transform: [{ scale: s }, { translateY: t }] };
    });

    const onlineCount = list.filter((d) => d.online).length;
    const onCount = list.filter((d) => d.on).length;

    const filtered = list.filter((d) => (room === "All" ? true : d.room === room));

    const handleToggle = (id: string, v: boolean) => {
        setList((prev) => prev.map((d) => (d.id === id ? { ...d, on: v } : d)));
    };

    return (
        <SafeAreaView style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Top buttons (back & more) */}
            <View pointerEvents="box-none" style={styles.topButtonsRow}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => router.back()} style={styles.circleBtn}>
                    {icon.chevronleft({ size: 24, color: "#111" })}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={() => { }} style={styles.circleBtn}>
                    {icon.moredote({ size: 24, color: "#111" })}
                </TouchableOpacity>
            </View>

            {/* Appbar / summary */}
            <Animated.View style={[styles.appbar, headerStyle]}>
                <View style={styles.headerRow}>
                    <View style={styles.headerIcon}>{icon.devices({ size: 22, color: TEXT })}</View>
                    <View>
                        <Text style={styles.h1}>Devices</Text>
                        <Text style={styles.h2}>Greenhouse 1 · Bandung</Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Total</Text>
                        <Text style={styles.statValue}>{list.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Online</Text>
                        <Text style={styles.statValue}>{onlineCount}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statTitle}>Power On</Text>
                        <Text style={styles.statValue}>{onCount}</Text>
                    </View>
                </View>
            </Animated.View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={(e) => (headerP.value = e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
            >
                {/* filter by room */}
                <RoomChips active={room} onChange={setRoom} />

                {/* grid devices */}
                <View style={styles.grid}>
                    {filtered.map((d) => (
                        <DeviceTile key={d.id} dev={d} onToggle={handleToggle} />
                    ))}
                </View>

                <View style={{ height: 28 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

/* ====== STYLES ====== */
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    topButtonsRow: {
        position: "absolute",
        left: 16,
        right: 16,
        top: 8,
        zIndex: 50,
        flexDirection: "row",
        justifyContent: "space-between",
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

    appbar: { paddingHorizontal: 16, paddingTop: 92, paddingBottom: 6, backgroundColor: BG },
    headerRow: { flexDirection: "row", alignItems: "center" },
    headerIcon: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: CARD, alignItems: "center", justifyContent: "center", marginRight: 10,
    },
    h1: { fontSize: 22, color: TEXT, fontFamily: F.extrabold },
    h2: { fontSize: 12, color: SUBT, fontFamily: F.medium },

    statsRow: { flexDirection: "row", gap: 10, marginTop: 12 },
    statCard: { flex: 1, backgroundColor: CARD, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: MUTED },
    statTitle: { fontSize: 12, color: SUBT, fontFamily: F.medium },
    statValue: { fontSize: 18, color: TEXT, fontFamily: F.bold },

    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

    chipsRow: { flexDirection: "row", flexWrap: "wrap", columnGap: 8, rowGap: 8, marginTop: 12 },
    chip: { paddingHorizontal: 12, height: 34, borderRadius: 18, backgroundColor: CARD, borderWidth: 1, borderColor: MUTED, alignItems: "center", justifyContent: "center" },
    chipActive: { backgroundColor: "#F2FCE1", borderColor: ACCENT },
    chipTxt: { fontSize: 12, color: SUBT, fontFamily: F.medium },
    chipTxtActive: { color: TEXT, fontFamily: F.bold },

    grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 12 },
    tile: {
        width: "48%",
        borderRadius: 18,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: MUTED,
        padding: 12,
        marginBottom: 12,
    },
    tileHead: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
    tileIcon: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: "#EEF6D3", alignItems: "center", justifyContent: "center",
    },
    tileName: { marginTop: 2, fontSize: 14, color: TEXT, fontFamily: F.bold },
    tileMeta: { fontSize: 12, color: SUBT, fontFamily: F.medium },
    tileFoot: { marginTop: 8, flexDirection: "row", alignItems: "center" },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    tileStatus: { fontSize: 12, color: TEXT, fontFamily: F.semibold },

    /* toggle */
    toggleWrap: {
        marginLeft: "auto",
        width: 46,
        height: 26,
        borderRadius: 13,
        overflow: "hidden",
        justifyContent: "center",
    },
    toggleBg: {
        borderRadius: 13,
    },
    toggleKnob: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#fff",
        marginLeft: 2,
        elevation: 2,
        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
    },
});
