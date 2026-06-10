import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";

export const MyInput = ({ label, error, ...props }: any) => {
  const { T } = useTheme();
  const styles = useMemo(() => createStyles(T), [T]);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={T.textMuted}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const createStyles = (T: Theme) => StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 5, color: T.text },
  input: {
    backgroundColor: T.card,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    color: T.text,
  },
  inputError: { borderColor: T.danger },
  errorText: { color: T.danger, fontSize: 12, marginTop: 4 },
});
