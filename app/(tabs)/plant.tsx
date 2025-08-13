import React from "react";
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated";
import BottomSheet from "../../components/BottomSheet";
import { useUI } from "../../providers/UIProvider";

// ======= TUNABLE =======
const { height: H } = Dimensions.get("window");
const CARD_H = Math.round(H * 0.45);   // tinggi card saat expanded
const OVERLAP = 280;                   // padi “duduk” di bibir card
const TOP_INSET = 80;                  // jarak sheet dari atas saat expanded
// =======================

const riceImg = require("../../assets/images/examplepadi.png");

export default function Plant() {
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
        const translateY = interpolate(p.value, [0, 1], [0, -22], Extrapolation.CLAMP); // naik 22px saat expanded
        const scale = interpolate(p.value, [0, 1], [1, 1.02], Extrapolation.CLAMP);     // sedikit membesar
        const elevation = interpolate(p.value, [0, 1], [8, 26], Extrapolation.CLAMP);   // Android
        const shadowOpacity = interpolate(p.value, [0, 1], [0.18, 0.32], Extrapolation.CLAMP); // iOS
        const shadowRadius = interpolate(p.value, [0, 1], [10, 22], Extrapolation.CLAMP);      // iOS
        return {
            transform: [{ translateY }, { scale }],
            elevation,
            shadowOpacity,
            shadowRadius,
        };
    });

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safe}>
                <View style={styles.hero}>
                    <Animated.Image
                        source={riceImg}
                        resizeMode="contain"
                        style={[styles.rice, riceAnim]}
                    />
                </View>
            </SafeAreaView>

            <BottomSheet
                topInset={TOP_INSET}
                onExpandedChange={(v) => setTabBarHidden(v)}
                onPositionChange={(y) => {
                    sheetY.value = y;
                    const prog = Math.min(1, Math.max(0, (H - y) / (H - TOP_INSET)));
                    p.value = prog;          // animasi kartu
                    setSheetProgress(prog);  // animasi TabBar
                }}
            >
                {/* wrapper card: beri gap bawah supaya tampak mengambang */}
                <Animated.View
                    style={[
                        styles.cardWrap,
                        cardFloat,
                        { height: CARD_H, marginBottom: 76 }, // GAP DARI BAWAH → efek melayang
                    ]}
                >
                    {/* isi card sengaja kosong dulu */}
                    <View style={styles.card} />
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

    // CARD KOSONG (hitam) — nanti isi indikator sensor realtime di sini
    card: {
        flex: 1,
        backgroundColor: "#000", // hitam biar efek “mengambang” terlihat jelas
        borderRadius: 28,
    },
});
