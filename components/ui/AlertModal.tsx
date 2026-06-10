import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { Theme } from "../../constants/theme";

export type AlertType = "success" | "error" | "info" | "warning";

interface Props {
    visible: boolean;
    type?: AlertType;
    title: string;
    message?: string;
    onClose: () => void;
    confirmText?: string;
}

const getConfig = (T: Theme): Record<AlertType, { icon: any; color: string; bg: string }> => ({
    success: { icon: "checkmark-circle", color: T.success, bg: T.successLight },
    error:   { icon: "close-circle",     color: T.danger,  bg: T.dangerLight },
    info:    { icon: "information-circle", color: T.primary, bg: T.primaryLight },
    warning: { icon: "alert-circle",     color: T.warning, bg: T.warningLight },
});

export function AlertModal({ visible, type = "info", title, message, onClose, confirmText = "Tamam" }: Props) {
    const { T } = useTheme();
    const styles = useMemo(() => createStyles(T), [T]);
    const cfg = getConfig(T)[type];
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.box} onPress={(e) => e.stopPropagation()}>
                    <View style={[styles.iconWrap, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon} size={36} color={cfg.color} />
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    {message ? <Text style={styles.message}>{message}</Text> : null}
                    <TouchableOpacity
                        style={[styles.btn, { backgroundColor: cfg.color }]}
                        onPress={onClose}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>{confirmText}</Text>
                    </TouchableOpacity>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const createStyles = (T: Theme) => StyleSheet.create({
    overlay: {
        flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center", alignItems: "center", paddingHorizontal: 32,
    },
    box: {
        backgroundColor: T.card, borderRadius: 20, padding: 24,
        width: "100%", maxWidth: 360, alignItems: "center",
    },
    iconWrap: {
        width: 72, height: 72, borderRadius: 36,
        justifyContent: "center", alignItems: "center", marginBottom: 16,
    },
    title: { fontSize: 18, fontWeight: "700", color: T.text, marginBottom: 8, textAlign: "center" },
    message: { fontSize: 14, color: T.textSec, textAlign: "center", marginBottom: 20, lineHeight: 20 },
    btn: { width: "100%", paddingVertical: 13, borderRadius: 12, alignItems: "center" },
    btnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
