import { StyleSheet, Text, TextInput, View } from "react-native";

export const MyInput = ({ label, error, ...props }: any) => (
  <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholderTextColor="#999"
      {...props}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: "#333" },
  input: {
    backgroundColor: "#F0F2F5",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
  },
  inputError: { borderWidth: 1, borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
});
