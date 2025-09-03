import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UIProvider } from "../providers/UIProvider";

export default function RootLayout() {
  // load Poppins + Boxicons sekaligus
  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Boxicons: require("../assets/fonts/boxicons.ttf"),
  });

  useEffect(() => {
    if (!loaded) return;

    // Jadikan Poppins default untuk semua Text & TextInput
    const base = { fontFamily: "Poppins_400Regular" } as const;

    // @ts-ignore
    Text.defaultProps = Text.defaultProps || {};
    // @ts-ignore
    Text.defaultProps.style = [Text.defaultProps.style, base];

    // @ts-ignore
    TextInput.defaultProps = TextInput.defaultProps || {};
    // @ts-ignore
    TextInput.defaultProps.style = [TextInput.defaultProps.style, base];
  }, [loaded]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UIProvider>
        <Slot />
      </UIProvider>
    </GestureHandlerRootView>
  );
}
