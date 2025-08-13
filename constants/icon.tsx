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
};

export { Bx, GLYPH };

