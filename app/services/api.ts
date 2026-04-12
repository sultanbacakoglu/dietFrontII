import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL = Platform.select({
    ios: "http://localhost:8080/api",
    android: "http://10.0.2.2:8080/api",
    default: "http://localhost:8080/api",
});

export interface Hasta {
    id?: number;
    adSoyad: string;
    eposta: string;
    telefon?: string;
    dogumTarihi?: string;
    cinsiyet?: string;
    boy?: number;
    kilo?: number;
    sikayet?: string;
    notlar?: string;
    olusturmaTarihi?: string;
}

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getHastalar = async (): Promise<Hasta[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/hastalar`, { headers });
        if (!response.ok) throw new Error("Veri çekilemedi");
        return await response.json();
    } catch (error) {
        console.error("Hasta getirme hatası:", error);
        return [];
    }
};

export const getHastaById = async (id: number): Promise<Hasta | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/hastalar/${id}`, { headers });
        if (!response.ok) throw new Error("Hasta bulunamadı");
        return await response.json();
    } catch (error) {
        console.error("Hasta detay hatası:", error);
        return null;
    }
};

export const hastaEkle = async (hastaVerisi: Omit<Hasta, 'id' | 'olusturmaTarihi'>): Promise<Hasta | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/hastalar`, {
            method: "POST",
            headers,
            body: JSON.stringify(hastaVerisi),
        });
        if (!response.ok) throw new Error("Hasta eklenemedi");
        return await response.json();
    } catch (error) {
        console.error("Hasta ekleme hatası:", error);
        return null;
    }
};

export const hastaGuncelle = async (id: number, hastaVerisi: Partial<Hasta>): Promise<Hasta | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/hastalar/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(hastaVerisi),
        });
        if (!response.ok) throw new Error("Hasta güncellenemedi");
        return await response.json();
    } catch (error) {
        console.error("Hasta güncelleme hatası:", error);
        return null;
    }
};

export const hastaSil = async (id: number): Promise<boolean> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/hastalar/${id}`, {
            method: "DELETE",
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Hasta silme hatası:", error);
        return false;
    }
};
