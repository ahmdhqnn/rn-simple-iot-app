import React from "react";
import { Text } from "react-native";

const GLYPH: Record<string, string> = {
  // ===== Home =====
  "bx-home-alt-2": "eb16",   // outline
  "bxs-home-alt-2": "edea",  // filled

  // ===== Chart =====
  "bx-bar-chart-alt-2": "e99a",
  "bxs-bar-chart-alt-2": "ec98",

  // ===== Setting =====
  "bx-server": "ebfd",
  "bxs-server": "ee9e",

  // ===== Location =====
  "bxs-map": "ee19",

  // ===== Other icons =====
  "bxs-stopwatch": "eebb",
  "bx-stopwatch": "ec2d",
  "bx-cloud-rain": "ea65",
  "bx-wind": "ec81",
  'bx-humidity': "ec7a",
  "bx-arrow-btn-right": "ebea",
  "bx-notification": "e9d2",
  "bx-search": "ebf8",
};

/**
 * Komponen render karakter dari font Boxicons.
 * Pastikan font sudah di-load di root app:
 * 
 * const [loaded] = useFonts({
 *   Boxicons: require("../assets/fonts/boxicons.ttf"),
 * });
 */
function Bx({
  code,
  size = 24,
  color = "#222",
}: {
  code: string;
  size?: number;
  color?: string;
}) {
  return (
    <Text
      style={{
        fontFamily: "Boxicons",
        fontSize: size,
        color,
      }}
      allowFontScaling={false}
    >
      {String.fromCharCode(parseInt(code, 16))}
    </Text>
  );
}

type IconProps = { focused?: boolean; size?: number; color?: string };

/**
 * Kumpulan icon untuk Tab Bar atau komponen lain.
 * Tinggal panggil: icon.index({ focused, size, color })
 */
export const icon = {
  index: ({ focused, size = 24, color = "#222" }: IconProps) =>
    focused ? (
      <Bx code={GLYPH["bxs-home-alt-2"]} size={size} color={color} />
    ) : (
      <Bx code={GLYPH["bx-home-alt-2"]} size={size} color={color} />
    ),

  plant: ({ focused, size = 24, color = "#222" }: IconProps) =>
    focused ? (
      <Bx code={GLYPH["bxs-bar-chart-alt-2"]} size={size} color={color} />
    ) : (
      <Bx code={GLYPH["bx-bar-chart-alt-2"]} size={size} color={color} />
    ),

  device: ({ focused, size = 24, color = "#222" }: IconProps) =>
    focused ? (
      <Bx code={GLYPH["bxs-server"]} size={size} color={color} />
    ) : (
      <Bx code={GLYPH["bx-server"]} size={size} color={color} />
    ),

  location: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bxs-map"]} size={size} color={color} />
  ),

  pressure: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-stopwatch"]} size={size} color={color} />
  ),

  precipitation: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-cloud-rain"]} size={size} color={color} />
  ),

  wind: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-wind"]} size={size} color={color} />
  ),

  humidity: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-humidity"]} size={size} color={color} />
  ),

  arrowrightbtn: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-arrow-btn-right"]} size={size} color={color} />
  ),

  notification: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-notification"]} size={size} color={color} />
  ),

  search: ({ size = 14, color = "#111" }) => (
    <Bx code={GLYPH["bx-search"]} size={size} color={color} />
  ),
};

export { Bx, GLYPH };

