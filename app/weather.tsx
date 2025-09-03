// app/weather.tsx
import { icon } from "@/constants/icon";
import { F } from "@/theme/fonts";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    LayoutChangeEvent,
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
import Svg, { Defs, LinearGradient, Path, Polyline, Rect, Stop } from "react-native-svg";

/* THEME */
const BG = "#F5F6F8";
const CARD = "#FFFFFF";
const TEXT = "#111";
const SUBT = "#6B7280";
const MUTED = "#E5E7EB";
const ACCENT = "#C7FF1A";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/* ========= SEGMENTED ========= */
const TABS = ["Today", "Hourly", "Daily"] as const;
function Segmented({ index, onChange }: { index: number; onChange: (i: number) => void }) {
    const w = React.useRef(0);
    const x = useSharedValue(0);
    const onLayout = (e: LayoutChangeEvent) => {
        w.current = e.nativeEvent.layout.width;
        x.value = withTiming((w.current / TABS.length) * index, { duration: 180 });
    };
    React.useEffect(() => {
        if (!w.current) return;
        x.value = withTiming((w.current / TABS.length) * index, { duration: 180 });
    }, [index]);
    const ind = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

    return (
        <View onLayout={onLayout} style={styles.segmentWrap}>
            <Animated.View style={[styles.segmentIndicator, { width: `${100 / TABS.length}%` }, ind]} />
            {TABS.map((t, i) => {
                const active = i === index;
                return (
                    <TouchableOpacity key={t} style={styles.segmentBtn} onPress={() => onChange(i)}>
                        <Text style={[styles.segmentTxt, active && { color: TEXT, fontFamily: F.bold }]}>{t}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

/* ========= CHARTS ========= */
function AreaChart({
    data,
    height = 120,
    color = ACCENT,
    softFill = true,
}: {
    data: number[];
    height?: number;
    color?: string;
    softFill?: boolean;
}) {
    const pad = 16;
    const n = data.length;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const width = pad * 2 + (n - 1) * 20;

    const pts = data
        .map((v, i) => {
            const x = pad + i * 20;
            const y = height - ((v - min) / (max - min || 1)) * (height - 16) - 8;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <Svg width={width} height={height}>
            {softFill && (
                <Defs>
                    <LinearGradient id="gtemp" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={color} stopOpacity="0.28" />
                        <Stop offset="1" stopColor={color} stopOpacity="0" />
                    </LinearGradient>
                </Defs>
            )}
            {[0.25, 0.5, 0.75, 1].map((p, i) => (
                <Rect key={i} x={pad} y={height * p} width={width - pad * 2} height={1} fill={MUTED} opacity={0.6} />
            ))}
            {softFill && (
                <Path d={`M${pad},${height - 8} L${pts.replace(/ /g, " L")} L${width - pad},${height - 8} Z`} fill="url(#gtemp)" />
            )}
            <Polyline points={pts} fill="none" stroke={color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        </Svg>
    );
}

/* ========= MINI WIDGETS ========= */
function MiniRow({ iconEl, label, value }: { iconEl: React.ReactNode; label: string; value: string }) {
    return (
        <View style={styles.miniRow}>
            <View style={styles.miniIcon}>{iconEl}</View>
            <Text style={styles.miniLabel}>{label}</Text>
            <Text style={styles.miniValue}>{value}</Text>
        </View>
    );
}

function Chip({ time, deg, iconEl }: { time: string; deg: string; iconEl: React.ReactNode }) {
    return (
        <View style={styles.chip}>
            <Text style={styles.chipTime}>{time}</Text>
            <View style={{ marginVertical: 6 }}>{iconEl}</View>
            <Text style={styles.chipDeg}>{deg}</Text>
        </View>
    );
}

/* ========= MAIN ========= */
export default function WeatherScreen() {
    const router = useRouter();
    const [tab, setTab] = React.useState(0);

    // dummy data
    const hourly = React.useMemo(() => Array.from({ length: 12 }, (_, i) => 22 + Math.sin(i / 2) * 4 + Math.random()), []);
    const daily = React.useMemo(() => Array.from({ length: 7 }, (_, i) => 23 + Math.sin(i / 1.8) * 5 + Math.random()), []);
    const humidity = 66;
    const wind = 2.3;
    const precipitation = 32;
    const pressure = 1012;

    const headerP = useSharedValue(0);
    const headerStyle = useAnimatedStyle(() => {
        const s = interpolate(headerP.value, [0, 80], [1, 0.92], Extrapolation.CLAMP);
        const t = interpolate(headerP.value, [0, 80], [0, -8], Extrapolation.CLAMP);
        return { transform: [{ scale: s }, { translateY: t }] };
    });

    return (
        <SafeAreaView style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* top buttons */}
            <View pointerEvents="box-none" style={styles.topButtonsRow}>
                <TouchableOpacity onPress={() => router.back()} activeOpacity={0.9} style={styles.circleBtn}>
                    {icon.chevronleft ? icon.chevronleft({ size: 24, color: "#111" }) : icon.search({ size: 24, color: "#111" })}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { }} activeOpacity={0.9} style={styles.circleBtn}>
                    {icon.search({ size: 24, color: "#111" })}
                </TouchableOpacity>
            </View>

            {/* appbar / hero */}
            <Animated.View style={[styles.appbar, headerStyle]}>
                <View style={styles.heroCard}>
                    <View style={styles.heroHead}>
                        <View style={styles.locationChip}>
                            {icon.location({ size: 14, color: "#111" })}
                            <Text style={styles.locationTxt} numberOfLines={1}>BTP-Telkom, Bandung</Text>
                        </View>
                        <Text style={styles.heroCond}>Cloudy</Text>
                    </View>

                    <View style={styles.heroRow}>
                        <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                            <Text style={styles.tempMain}>{Math.round(hourly[0])}</Text>
                            <Text style={styles.tempUnit}>°C</Text>
                        </View>
                        <View style={styles.heroIconBig}>{icon.weather({ size: 38, color: "#111" })}</View>
                    </View>

                    <Text style={styles.heroSub}>Day 32° · Night 14° · Feels like 29°</Text>
                </View>
            </Animated.View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={(e) => (headerP.value = e.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}
            >
                <Segmented index={tab} onChange={setTab} />

                {/* TODAY */}
                {tab === 0 && (
                    <>
                        <View style={styles.card}>
                            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
                                <Text style={styles.cardTitle}>Temperature trend (next hours)</Text>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 6 }}>
                                <AreaChart data={hourly} />
                            </ScrollView>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Today Details</Text>
                            <View style={styles.grid2}>
                                <MiniRow iconEl={icon.humidity({ size: 18, color: TEXT })} label="Humidity" value={`${humidity}%`} />
                                <MiniRow iconEl={icon.wind({ size: 18, color: TEXT })} label="Wind" value={`${wind} m/s`} />
                                <MiniRow iconEl={icon.precipitation({ size: 18, color: TEXT })} label="Precipitation" value={`${precipitation}%`} />
                                <MiniRow iconEl={icon.pressure({ size: 18, color: TEXT })} label="Pressure" value={`${pressure} hPa`} />
                            </View>
                        </View>
                    </>
                )}

                {/* HOURLY */}
                {tab === 1 && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Hourly</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 4 }}
                        >
                            {hourly.map((v, i) => (
                                <Chip
                                    key={i}
                                    time={`${(i + 9) % 24}:00`}
                                    deg={`${Math.round(v)}°`}
                                    iconEl={icon.weather({ size: 20, color: "#111" })}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* DAILY */}
                {tab === 2 && (
                    <>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Next 7 days (°C)</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 6 }}>
                                <AreaChart data={daily} />
                            </ScrollView>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Summary</Text>
                            <View style={styles.grid2}>
                                <MiniRow iconEl={icon.humidity({ size: 18, color: TEXT })} label="Avg Humidity" value="63%" />
                                <MiniRow iconEl={icon.wind({ size: 18, color: TEXT })} label="Avg Wind" value="2.1 m/s" />
                                <MiniRow iconEl={icon.precipitation({ size: 18, color: TEXT })} label="Rainy Days" value="3 / 7" />
                                <MiniRow iconEl={icon.pressure({ size: 18, color: TEXT })} label="Pressure Range" value="1006–1017" />
                            </View>
                        </View>
                    </>
                )}

                <View style={{ height: 28 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

/* ========= STYLES ========= */
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: BG },

    /* top buttons (konsisten dengan Home/Analytics) */
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

    /* hero / appbar */
    appbar: { paddingHorizontal: 16, paddingTop: 92, paddingBottom: 6, backgroundColor: BG },
    heroCard: {
        backgroundColor: CARD,
        borderRadius: 22,
        padding: 16,
        // borderWidth: 1,
        // borderColor: MUTED,
    },
    heroHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    locationChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 28,
        paddingHorizontal: 10,
        borderRadius: 16,
        backgroundColor: "#EDEFF3",
    },
    locationTxt: { fontSize: 12, color: TEXT, fontFamily: F.bold },
    heroCond: { fontSize: 12, color: SUBT, fontFamily: F.medium },

    heroRow: { marginTop: 8, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    tempMain: { fontSize: 56, lineHeight: 56, color: TEXT, fontFamily: F.extrabold },
    tempUnit: { marginTop: 6, marginLeft: 4, fontSize: 22, color: TEXT, fontFamily: F.bold },
    heroIconBig: {
        width: 64, height: 64, borderRadius: 18, backgroundColor: "#F2FCE1",
        alignItems: "center", justifyContent: "center",
    },
    heroSub: { marginTop: 8, fontSize: 12, color: SUBT, fontFamily: F.medium },

    scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

    /* segmented */
    segmentWrap: {
        flexDirection: "row",
        backgroundColor: CARD,
        borderRadius: 16,
        overflow: "hidden",
        // borderWidth: 1,
        // borderColor: MUTED,
        marginTop: 12,
    },
    segmentIndicator: { position: "absolute", top: 0, bottom: 0, backgroundColor: "#F2FCE1" },
    segmentBtn: { flex: 1, height: 44, alignItems: "center", justifyContent: "center" },
    segmentTxt: { fontSize: 12, color: SUBT, fontFamily: F.medium },

    /* cards */
    card: {
        marginTop: 12,
        backgroundColor: CARD,
        borderRadius: 18,
        padding: 14,
        // borderWidth: 1,
        // borderColor: MUTED,
    },
    cardTitle: { fontSize: 16, color: TEXT, fontFamily: F.bold },

    /* details grid */
    grid2: { marginTop: 10, rowGap: 10, columnGap: 10, flexDirection: "row", flexWrap: "wrap" },
    miniRow: {
        width: "48%",
        borderWidth: 1,
        borderColor: MUTED,
        borderRadius: 14,
        backgroundColor: CARD,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    miniIcon: {
        width: 28, height: 28, borderRadius: 14,
        alignItems: "center", justifyContent: "center", backgroundColor: "#EEF6D3", marginRight: 8,
    },
    miniLabel: { fontSize: 12, color: SUBT, fontFamily: F.medium, flex: 1 },
    miniValue: { fontSize: 14, color: TEXT, fontFamily: F.bold },

    /* chips (hourly list) */
    chip: {
        width: 64,
        height: 96,
        borderRadius: 14,
        backgroundColor: CARD,
        borderWidth: 1,
        borderColor: MUTED,
        marginHorizontal: 6,
        alignItems: "center",
        justifyContent: "center",
    },
    chipTime: { fontSize: 12, color: SUBT, fontFamily: F.medium },
    chipDeg: { fontSize: 14, color: TEXT, fontFamily: F.bold },
});
