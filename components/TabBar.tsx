import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import TabBarbutton from './TabBarbutton';


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {

    const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
    const buttonWidth = dimensions.width / state.routes.length;
    const onTabBarLayout = (e: LayoutChangeEvent) => {
        setDimensions({
            height: e.nativeEvent.layout.height,
            width: e.nativeEvent.layout.width
        })
    }

    const tabPositionsX = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: tabPositionsX.value }],
        };
    })

    return (
        <View onLayout={onTabBarLayout} style={styles.tabBar}>
            <Animated.View style={[animatedStyle, {
                position: 'absolute',
                backgroundColor: '#723FEB',
                borderRadius: 100,
                marginHorizontal: 12,
                height: dimensions.height - 15,
                width: buttonWidth - 25,
            }]} />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                let label: string;
                if (typeof options.tabBarLabel === 'string') {
                    label = options.tabBarLabel;
                } else if (typeof options.title === 'string') {
                    label = options.title;
                } else {
                    label = route.name;
                }

                const isFocused = state.index === index;

                const onPress = () => {
                    tabPositionsX.value = withSpring(buttonWidth * index, { duration: 1500 });
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabBarbutton
                        key={route.name}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        isFocused={isFocused}
                        routeName={route.name as 'index' | 'chart' | 'setting'}
                        color={isFocused ? '#FFF' : '#222'}
                        label={label}
                    />
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
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
        // shadowColor: '#000',
        // shadowOpacity: 0.1,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 10,
        elevation: 10,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
    },
    // tabBarItem: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     gap: 5,
    // },
})