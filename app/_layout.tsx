import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import { UIProvider } from '../providers/UIProvider';
import { View } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    Boxicons: require('../assets/fonts/boxicons.ttf'),
  });

  if (!loaded) return <View style={{ flex: 1, backgroundColor: '#fff' }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UIProvider>
        <Slot />
      </UIProvider>
    </GestureHandlerRootView>
  );
}