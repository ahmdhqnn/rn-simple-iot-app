import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color }) => (<AntDesign name="home" size={24} color={color} />) }} />
      <Tabs.Screen name="chart" options={{ title: "Chart", tabBarIcon: ({ color }) => (<AntDesign name="linechart" size={24} color={color} />) }} />
      <Tabs.Screen name="setting" options={{ title: "Setting", tabBarIcon: ({ color }) => (<AntDesign name="setting" size={24} color={color} />) }} />
    </Tabs>
  );
}
