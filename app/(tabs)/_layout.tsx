import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, StyleSheet, Text } from "react-native";

const COLORS = {
  primary: "#6366F1",
  success: "#10B981",
  purple: "#8B5CF6",
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: "#94A3B8",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          height: Platform.OS === "ios" ? 88 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: "#EEF2FF" }]}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={22}
                  color={color}
                />
              </View>
              {focused && <View style={styles.activeDot} />}
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
              <View style={[styles.iconBox, focused && { backgroundColor: "#D1FAE5" }]}>
                <Ionicons
                  name={focused ? "calendar" : "calendar-outline"}
                  size={22}
                  color={focused ? COLORS.success : color}
                />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.success }] } />}
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
              <View style={[styles.iconBox, focused && { backgroundColor: "#EDE9FE" }]}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={22}
                  color={focused ? COLORS.purple : color}
                />
              </View>
              {focused && <View style={[styles.activeDot, { backgroundColor: COLORS.purple }] } />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
});
