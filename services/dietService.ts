import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL = Platform.select({
    ios: "http://localhost:8080/api",
    android: "http://10.0.2.2:8080/api",
    default: "http://localhost:8080/api",
})!;

export interface DiyetPlani {
    id?: number;
    baslik: string;
    aciklama?: string;
    baslangicTarihi: string;
    bitisTarihi: string;
    kaloriHedefi?: number;
    kahvalti?: string;
    ogleYemegi?: string;
    aksamYemegi?: string;
    araOgun?: string;
    notlar?: string;
    durum?: "aktif" | "tamamlandı" | "taslak";
    hastaId?: number;
    hastaAdSoyad?: string;
    diyetisyenId?: number;
    diyetisyenAdSoyad?: string;
}

const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getDiyetPlanlari = async (): Promise<DiyetPlani[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari`, { headers });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return [];
    }
};

export const getHastaDiyetPlanlari = async (hastaId: number): Promise<DiyetPlani[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari/hasta/${hastaId}`, { headers });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return [];
    }
};

export const getDiyetPlaniById = async (id: number): Promise<DiyetPlani | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari/${id}`, { headers });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return null;
    }
};

export const diyetPlaniOlustur = async (plan: Omit<DiyetPlani, "id">): Promise<DiyetPlani | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari`, {
            method: "POST",
            headers,
            body: JSON.stringify(plan),
        });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return null;
    }
};

export const diyetPlaniGuncelle = async (id: number, plan: Partial<DiyetPlani>): Promise<DiyetPlani | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(plan),
        });
        if (!response.ok) throw new Error();
        return await response.json();
    } catch {
        return null;
    }
};

export const diyetPlaniSil = async (id: number): Promise<boolean> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/diyet-planlari/${id}`, {
            method: "DELETE",
            headers,
        });
        return response.ok;
    } catch {
        return false;
    }
};
