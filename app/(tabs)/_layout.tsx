import { Tabs } from "expo-router";
import { TabBar } from "../../components/TabBar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="plant" options={{ title: "Plant" }} />
      <Tabs.Screen name="setting" options={{ title: "Setting" }} />
    </Tabs>
  );
}
