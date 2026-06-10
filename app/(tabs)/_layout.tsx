import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, StyleSheet } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";

export default function TabLayout() {
  const { T } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: T.primary,
        tabBarInactiveTintColor: T.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: T.card,
          borderTopWidth: 1,
          borderTopColor: T.border,
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: T.primaryLight }]}>
                <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: T.primary }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Randevular",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: T.successLight }]}>
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={focused ? T.success : color} />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: T.success }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="diet"
        options={{
          title: "Diyet",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: T.successLight }]}>
                <Ionicons name={focused ? "nutrition" : "nutrition-outline"} size={22} color={focused ? T.success : color} />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: T.success }]} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: T.purpleLight }]}>
                <Ionicons name={focused ? "person" : "person-outline"} size={22} color={focused ? T.purple : color} />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: T.purple }]} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: "center" },
  iconBox: { width: 44, height: 32, justifyContent: "center", alignItems: "center", borderRadius: 10 },
  activeDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
});
