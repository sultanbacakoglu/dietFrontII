import AsyncStorage from "@react-native-async-storage/async-storage";

import { Platform } from "react-native";

export const API_URL = Platform.select({
    ios: "http://localhost:8080/api",
    android: "http://10.0.2.2:8080/api",
    default: "http://localhost:8080/api",
})!;

const KEYS = {
    TOKEN: "auth_token",
    USER_ID: "user_id",
    USER_NAME: "user_name",
};

export interface LoginResponse {
    token: string;
    id: number;
    adSoyad: string;
    eposta?: string;
}

export const login = async (eposta: string, sifre: string): Promise<LoginResponse | null> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        console.log("Login URL:", API_URL);

        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eposta, sifre }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        console.log("Response status:", response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "Giriş başarısız");
        }

        const data: LoginResponse = await response.json();

        await AsyncStorage.setItem(KEYS.TOKEN, data.token);
        await AsyncStorage.setItem(KEYS.USER_ID, String(data.id));
        await AsyncStorage.setItem(KEYS.USER_NAME, data.adSoyad);

        return data;
    } catch (error: any) {
        clearTimeout(timeoutId);
        console.error("Login hatası:", error);
        if (error.name === "AbortError") {
            throw new Error("Sunucuya bağlanılamadı. Backend'in çalıştığından emin olun.");
        }
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    await AsyncStorage.multiRemove([KEYS.TOKEN, KEYS.USER_ID, KEYS.USER_NAME]);
};

export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(KEYS.TOKEN);
};

export const getUserId = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(KEYS.USER_ID);
};

export const getUserName = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(KEYS.USER_NAME);
};

export interface Profil {
    id: number;
    adSoyad: string;
    eposta: string;
}

const authHeaders = async () => {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getMe = async (): Promise<Profil | null> => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, { headers: await authHeaders() });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return null;
    }
};

export const updateProfile = async (data: {
    adSoyad?: string;
    mevcutSifre?: string;
    yeniSifre?: string;
}): Promise<{ ok: boolean; mesaj?: string }> => {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: "PUT",
            headers: await authHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const text = await response.text();
            return { ok: false, mesaj: text || "Güncelleme başarısız" };
        }
        const profil: Profil = await response.json();
        await AsyncStorage.setItem(KEYS.USER_NAME, profil.adSoyad);
        return { ok: true };
    } catch {
        return { ok: false, mesaj: "Sunucuya bağlanılamadı" };
    }
};
