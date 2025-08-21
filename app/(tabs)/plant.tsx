// file: screens/Plant/index.tsx
import React from "react";
import {
    Dimensions,
    ImageSourcePropType,
    LayoutChangeEvent,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import Svg, { Circle, Polyline } from "react-native-svg";
import BottomSheet from "../../components/BottomSheet";
import { useUI } from "../../providers/UIProvider";

/*
PSEUDOCODE
- Keep card wrapper size/position as-is.
- Add header (title+subtitle), right-side circle (donut) gauge.
- Add small line-chart icon + label row.
- Add realtime sparkline below label.
- Provide typed hooks/components for TS: useRealtimeSeries, Sparkline, LineIcon, CircleGauge.
- Remove unused vars (width) to satisfy lints.
*/

// ======= TUNABLE =======
const { height: H } = Dimensions.get("window");
const CARD_H = Math.round(H * 0.45);
const OVERLAP = 280;
const TOP_INSET = 80;
const ACCENT = "#C7FF1A";
const MUTED = "#EAEDF2";
// =======================

const riceImg: ImageSourcePropType = require("../../assets/images/examplepadi.png");

// Utils
const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

// ---- Realtime Series Hook ----
interface RealtimeSeriesOptions {
    points?: number;
    min?: number;
    max?: number;
    jitter?: number;
    intervalMs?: number;
}
function useRealtimeSeries({
    points = 32,
    min = 20,
    max = 90,
    jitter = 6,
    intervalMs = 1000,
}: RealtimeSeriesOptions = {}): number[] {
    const init = React.useMemo<number[]>(
        () => Array.from({ length: points }, () => min + Math.random() * (max - min)),
        [points, min, max]
    );
    const [series, setSeries] = React.useState<number[]>(init);

    React.useEffect(() => {
        const id = setInterval(() => {
            setSeries((prev) => {
                const last = prev[prev.length - 1] ?? (min + max) / 2;
                const next = clamp(last + (Math.random() - 0.5) * jitter * 2, min, max);
                const shifted = prev.slice(1).concat(next);
                return shifted;
            });
        }, intervalMs);
        return () => clearInterval(id);
    }, [intervalMs, min, max, jitter]);

    return series;
}

// ---- UI: Sparkline ----
interface SparklineProps {
    data: number[];
    width: number;
    height: number;
    stroke?: number;
    color?: string;
}
function Sparkline({ data, width, height, stroke = 3, color = ACCENT }: SparklineProps) {
    const [min, max] = React.useMemo<[number, number]>(() => {
        let lo = Infinity;
        let hi = -Infinity;
        for (const n of data) {
            if (n < lo) lo = n;
            if (n > hi) hi = n;
        }
        if (!isFinite(lo) || !isFinite(hi) || lo === hi) {
            lo = 0;
            hi = 1;
        }
        return [lo, hi];
    }, [data]);

    const points = React.useMemo<string>(() => {
        if (!width || !height) return "";
        const n = data.length;
        if (n <= 1) return "";
        const stepX = width / (n - 1);
        return data
            .map((v: number, i: number) => {
                const x = i * stepX;
                const y = height - ((v - min) / (max - min)) * height;
                return `${x},${y}`;
            })
            .join(" ");
    }, [data, width, height, min, max]);

    return (
        <Svg width={width} height={height}>
            <Polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

// ---- UI: Small Line Icon ----
interface LineIconProps { size?: number; color?: string }
function LineIcon({ size = 18, color = ACCENT }: LineIconProps) {
    const w = size;
    const h = size;
    const pad = 3;
    return (
        <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <Polyline
                points={`${pad},${h - pad} ${w / 2},${h / 2} ${w - pad},${pad}`}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

// ---- UI: Circle (Donut) Gauge ----
interface CircleGaugeProps {
    size?: number;
    stroke?: number;
    progress?: number; // 0..1
    color?: string;
    track?: string;
    label?: string;
}
function CircleGauge({
    size = 78,
    stroke = 10,
    progress = 0.62,
    color = ACCENT,
    track = MUTED,
    label = "RH",
}: CircleGaugeProps) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - clamp(progress, 0, 1));
    const cx = size / 2;
    const cy = size / 2;
    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                <Circle cx={cx} cy={cy} r={r} stroke={track} strokeWidth={stroke} fill="none" />
                <Circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    stroke={color}
                    strokeWidth={stroke}
                    strokeDasharray={`${c} ${c}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="none"
                    // rotate start to top without type warnings
                    transform={`rotate(-90 ${cx} ${cy})`}
                />
            </Svg>
            <View style={[StyleSheet.absoluteFill, styles.gaugeCenter]}>
                <Text style={styles.gaugeLabel}>{label}</Text>
                <Text style={styles.gaugeValue}>{Math.round(clamp(progress, 0, 1) * 100)}%</Text>
            </View>
        </View>
    );
}

export default function Plant(): React.JSX.Element {
    const { setTabBarHidden, setSheetProgress } = useUI();

    // posisi Y sheet + progress 0..1 (0=tertutup,1=terbuka)
    const sheetY = useSharedValue(H);
    const p = useSharedValue(0);

    // padi: naik + sedikit mengecil saat sheet terbuka
    const riceAnim = useAnimatedStyle(() => {
        const progress = interpolate(sheetY.value, [H, TOP_INSET], [0, 1], Extrapolation.CLAMP);
        const scale = interpolate(progress, [0, 1], [1, 0.9]);
        const translateY = interpolate(progress, [0, 1], [0, -(CARD_H - OVERLAP)]);
        return { transform: [{ scale }, { translateY }] };
    });

    // card mengambang: ada gap bawah, naik sedikit, scale, bayangan lebih dalam
    const cardFloat = useAnimatedStyle(() => {
        const translateY = interpolate(p.value, [0, 1], [0, -22], Extrapolation.CLAMP);
        const scale = interpolate(p.value, [0, 1], [1, 1.02], Extrapolation.CLAMP);
        const elevation = interpolate(p.value, [0, 1], [8, 26], Extrapolation.CLAMP);
        const shadowOpacity = interpolate(p.value, [0, 1], [0.18, 0.32], Extrapolation.CLAMP);
        const shadowRadius = interpolate(p.value, [0, 1], [10, 22], Extrapolation.CLAMP);
        return {
            transform: [{ translateY }, { scale }],
            elevation,
            shadowOpacity,
            shadowRadius,
        };
    });

    // Data realtime (simulasi)
    const series = useRealtimeSeries({ points: 40, min: 24, max: 36, jitter: 1.2, intervalMs: 1200 });
    const avg = React.useMemo<number>(() => series.reduce((a, b) => a + b, 0) / series.length, [series]);
    const gaugeProgress = clamp((avg - 20) / 20, 0, 1);

    const [sparkSize, setSparkSize] = React.useState<{ w: number; h: number }>({ w: 0, h: 120 });

    const onSparkLayout = (e: LayoutChangeEvent) => {
        // Ambil nilai sebelum setState untuk menghindari synthetic event pooling
        const { width } = e.nativeEvent.layout;
        setSparkSize((s) => ({ ...s, w: width }));
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safe}>
                <View style={styles.hero}>
                    <Animated.Image source={riceImg} resizeMode="contain" style={[styles.rice, riceAnim]} />
                </View>
            </SafeAreaView>

            <BottomSheet
                topInset={TOP_INSET}
                onExpandedChange={(v: boolean) => setTabBarHidden(v)}
                onPositionChange={(y: number) => {
                    sheetY.value = y;
                    const prog = Math.min(1, Math.max(0, (H - y) / (H - TOP_INSET)));
                    p.value = prog;
                    setSheetProgress(prog);
                }}
            >
                {/* wrapper card: beri gap bawah supaya tampak mengambang */}
                <Animated.View style={[styles.cardWrap, cardFloat, { height: CARD_H, marginBottom: 76 }]}>
                    {/* === CARD CONTENT START === */}
                    <View style={styles.card}>
                        <View style={styles.cardInner}>
                            {/* Header */}
                            <View style={styles.headerRow}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.title}>Padi</Text>
                                    <Text style={styles.subtitle}>Kebutuhan Tanaman · Realtime</Text>
                                </View>
                                <View style={styles.gaugeWrap}>
                                    <CircleGauge size={80} stroke={10} progress={gaugeProgress} label="RH" />
                                </View>
                            </View>

                            {/* Label sparkline */}
                            <View style={styles.labelRow}>
                                <View style={styles.labelBadge}>
                                    <LineIcon />
                                </View>
                                <Text style={styles.labelText}>Suhu Ruang Tumbuh</Text>
                                <Text style={styles.labelValue}>{avg.toFixed(1)}°C</Text>
                            </View>

                            {/* Sparkline */}
                            <View style={styles.sparkContainer} onLayout={onSparkLayout}>
                                {sparkSize.w > 0 && (
                                    <Sparkline data={series} width={sparkSize.w} height={sparkSize.h} color={ACCENT} />
                                )}
                            </View>
                        </View>
                    </View>
                    {/* === CARD CONTENT END === */}
                </Animated.View>
            </BottomSheet>
        </View>
    );
}

/* ====== STYLES ====== */
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFF" },
    safe: { flex: 1 },

    hero: { flex: 1, alignItems: "center", justifyContent: "center" },
    rice: { width: "90%", height: "90%" },

    // base shadow (shadowOffset tidak dianimasikan → tidak ada warning)
    cardWrap: {
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },

    card: {
        flex: 1,
        backgroundColor: "#FFF",
        borderRadius: 28,
        overflow: "hidden",
    },

    cardInner: { flex: 1, padding: 16 },

    headerRow: { flexDirection: "row", alignItems: "center" },

    title: { fontSize: 28, fontWeight: "700", color: "#111" },
    subtitle: { marginTop: 2, fontSize: 14, color: "#6B7280" },

    gaugeWrap: { marginLeft: 12 },
    gaugeCenter: { alignItems: "center", justifyContent: "center" },
    gaugeLabel: { fontSize: 10, color: "#6B7280" },
    gaugeValue: { marginTop: -2, fontSize: 16, fontWeight: "700", color: "#111" },

    labelRow: { marginTop: 16, flexDirection: "row", alignItems: "center" },
    labelBadge: {
        width: 28,
        height: 28,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F2FCE1",
        marginRight: 8,
    },
    labelText: { fontSize: 15, fontWeight: "600", color: "#111" },
    labelValue: { marginLeft: "auto", fontSize: 15, fontWeight: "700", color: "#111" },

    sparkContainer: {
        marginTop: 10,
        borderRadius: 12,
        backgroundColor: "#FAFAFA",
        borderWidth: 1,
        borderColor: MUTED,
        padding: 12,
    },
});
