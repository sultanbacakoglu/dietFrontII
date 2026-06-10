import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import { darkTheme, lightTheme, makeDurumColors, makeTipColors, Theme } from "../constants/theme";

const STORAGE_KEY = "theme_mode";

interface ThemeContextValue {
    T: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    TIP_COLORS: ReturnType<typeof makeTipColors>;
    DURUM_COLORS: ReturnType<typeof makeDurumColors>;
}

const ThemeContext = createContext<ThemeContextValue>({
    T: lightTheme,
    isDark: false,
    toggleTheme: () => {},
    TIP_COLORS: makeTipColors(lightTheme),
    DURUM_COLORS: makeDurumColors(lightTheme),
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
            if (saved !== null) {
                setIsDark(saved === "dark");
            } else {
                // Kaydedilmiş tercih yoksa sistem temasını kullan
                setIsDark(Appearance.getColorScheme() === "dark");
            }
        });
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => {
            const next = !prev;
            AsyncStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
            return next;
        });
    }, []);

    const T = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider
            value={{
                T,
                isDark,
                toggleTheme,
                TIP_COLORS: makeTipColors(T),
                DURUM_COLORS: makeDurumColors(T),
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
