import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { API_URL } from "../services/authService";

export default function RootIndex() {
    const [loading, setLoading] = useState(true);
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem("auth_token");
            if (!token) {
                setHasToken(false);
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/hastalar`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setHasToken(true);
                } else {
                    await AsyncStorage.multiRemove(["auth_token", "user_id", "user_name"]);
                    setHasToken(false);
                }
            } catch {
                setHasToken(true);
            }

            setLoading(false);
        };
        checkToken();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    if (hasToken) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/(auth)/login" />;
}
