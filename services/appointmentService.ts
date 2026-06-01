import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const BASE_URL = Platform.select({
    ios: "http://localhost:8080/api",
    android: "http://10.0.2.2:8080/api",
    default: "http://localhost:8080/api",
})!;

export type RandevuTipi = "İlk Görüşme" | "Kontrol" | "Tetkik Sonucu" | "Diyet Planı" | "Diğer";
export type RandevuDurumu = "bekliyor" | "tamamlandı" | "iptal";

export interface Randevu {
    id?: number;
    hastaId: number;
    hastaAdSoyad?: string;
    tarih: string;
    saat: string;
    tip: RandevuTipi;
    durum?: RandevuDurumu;
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

export const getRandevular = async (): Promise<Randevu[]> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/randevular`, { headers });
        if (!response.ok) throw new Error("Randevular çekilemedi");
        return await response.json();
    } catch (error) {
        console.error("Randevu listeleme hatası:", error);
        return [];
    }
};

export const getRandevuById = async (id: number): Promise<Randevu | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/randevular/${id}`, { headers });
        if (!response.ok) throw new Error("Randevu bulunamadı");
        return await response.json();
    } catch (error) {
        console.error("Randevu detay hatası:", error);
        return null;
    }
};

export const randevuOlustur = async (
    randevu: Omit<Randevu, "id" | "olusturmaTarihi">
): Promise<Randevu | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/randevular`, {
            method: "POST",
            headers,
            body: JSON.stringify(randevu),
        });
        if (!response.ok) throw new Error("Randevu oluşturulamadı");
        return await response.json();
    } catch (error) {
        console.error("Randevu oluşturma hatası:", error);
        return null;
    }
};

export const randevuGuncelle = async (
    id: number,
    randevu: Partial<Randevu>
): Promise<Randevu | null> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/randevular/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(randevu),
        });
        if (!response.ok) throw new Error("Randevu güncellenemedi");
        return await response.json();
    } catch (error) {
        console.error("Randevu güncelleme hatası:", error);
        return null;
    }
};

export const randevuSil = async (id: number): Promise<boolean> => {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${BASE_URL}/randevular/${id}`, {
            method: "DELETE",
            headers,
        });
        return response.ok;
    } catch (error) {
        console.error("Randevu silme hatası:", error);
        return false;
    }
};
