interface HastaVerisi {
    id?: number;
    adSoyad: string;
    eposta: string;
    telefon?: string;
}

const BASE_URL = "http://localhost:8080/api";

// 1. Hasta Listeleme API'si
export const getHastalar = async () => {
    try {
        const response = await fetch(`${BASE_URL}/hastalar`);
        if (!response.ok) throw new Error("Veri çekilemedi");
        return await response.json();
    } catch (error) {
        console.error("Hasta getirme hatası:", error);
        return [];
    }
};

// 2. Yeni Hasta Ekleme API'si
export const hastaEkle = async (hastaVerisi: HastaVerisi) => {
    try {
        const response = await fetch(`${BASE_URL}/hastalar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hastaVerisi),
        });
        return await response.json();
    } catch (error) {
        console.error("Hasta ekleme hatası:", error);
    }
};

export const hastaSil = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/hastalar/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Hasta silme hatası:", error);
        return false;
    }
};