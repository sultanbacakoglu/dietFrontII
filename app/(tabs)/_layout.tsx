import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View, StyleSheet, Text } from "react-native";
import { T } from "../../constants/theme";

const COLORS = {
  primary: T.primary,
  success: T.success,
  purple: T.purple,
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
              <View style={[styles.iconBox, focused && { backgroundColor: T.primaryLight }]}>
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
              <View style={[styles.iconBox, focused && { backgroundColor: T.successLight }]}>
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
        name="diet"
        options={{
          title: "Diyet",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabItem}>
              <View style={[styles.iconBox, focused && { backgroundColor: "#D1FAE5" }]}>
                <Ionicons
                  name={focused ? "nutrition" : "nutrition-outline"}
                  size={22}
                  color={focused ? T.success : color}
                />
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
