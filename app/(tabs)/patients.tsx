import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Page() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Bu ekran yakında hazırlanacak.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  text: { fontSize: 16, color: "#666" },
});
