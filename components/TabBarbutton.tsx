
// eslint-disable-next-line import/no-unresolved
import { icon } from '@/constants/icon';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import type { GestureResponderEvent } from 'react-native';

type IconKeys = keyof typeof icon;

const TabBarbutton = ({ onPress, onLongPress, isFocused, routeName, color, label }: { onPress: (event: GestureResponderEvent) => void, onLongPress: (event: GestureResponderEvent) => void, isFocused: boolean, routeName: IconKeys, color: string, label: string }) => {
    const scale = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, { duration: 350 });
    }, [scale, isFocused])

    const animatedIconStyle = useAnimatedStyle(() => {
        const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
        const top = interpolate(scale.value, [0, 1], [0, 9]);

        return {
            transform: [{ scale: scaleValue }],
            top
        };
    })

    const animatedTextStyle = useAnimatedStyle(() => {
        const opacity = interpolate(scale.value, [0, 1], [1, 0])
        return {
            opacity
        };
    })

    return (
        <Pressable
            onPressIn={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
        >
            <Animated.View style={[animatedIconStyle]}>
                {icon[routeName]({ color: isFocused ? '#FFF' : '#222', })}
            </Animated.View>
            {/* Animated text for the label */}
            <Animated.Text style={[{ color: isFocused ? '#673ab7' : '#222', fontSize: 12 }, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </Pressable>
    )
}

export default TabBarbutton

const styles = StyleSheet.create({
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },
})