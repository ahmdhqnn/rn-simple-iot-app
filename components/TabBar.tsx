import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useUI } from '../providers/UIProvider';
import TabBarbutton from './TabBarbutton';

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { tabBarHidden, sheetProgress } = useUI();

  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;
  const onTabBarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionsX = useSharedValue(0);
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionsX.value }],
  }));

  // === progress dari context → shared value biar anim halus saat drag
  const p = useSharedValue(0); // 0=show, 1=hide
  useEffect(() => {
    // respon cepat saat jari bergerak (durasi kecil)
    p.value = withTiming(sheetProgress, { duration: 50 });
  }, [sheetProgress, p]);

  // style hide berdasarkan progress
  const hideStyle = useAnimatedStyle(() => {
    const translateY = interpolate(p.value, [0, 1], [0, 160], Extrapolation.CLAMP);
    const scale = interpolate(p.value, [0, 1], [1, 0.96], Extrapolation.CLAMP);
    const opacity = interpolate(p.value, [0, 1], [1, 0], Extrapolation.CLAMP);
    return { transform: [{ translateY }, { scale }], opacity };
  });

  return (
    <Animated.View
      onLayout={onTabBarLayout}
      style={[styles.tabBar, hideStyle]}
      pointerEvents={tabBarHidden ? 'none' : 'auto'} // tetap non-interaktif saat sheet terbuka penuh
    >
      <Animated.View
        style={[
          indicatorStyle,
          {
            position: 'absolute',
            backgroundColor: '#98CD00',
            borderRadius: 100,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionsX.value = withSpring(buttonWidth * index, { duration: 1500 });
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };

        return (
          <TabBarbutton
            key={route.name}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            isFocused={isFocused}
            routeName={route.name as 'index' | 'plant' | 'device'}
            color={isFocused ? '#FFF' : '#222'}
            label={label}
          />
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // desain asli kamu—tanpa perubahan
  tabBar: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 80,
    paddingVertical: 15,
    borderRadius: 100,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 10,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 0,
  },
});
