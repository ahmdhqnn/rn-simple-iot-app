import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UIProvider } from '../providers/UIProvider'; // pastikan file ini ada (dari jawaban sebelumnya)

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UIProvider>
        <Slot />
      </UIProvider>
    </GestureHandlerRootView>
  );
}
