// ─── Renk sabitleri (tema bağımsız) ─────────────────────────────────────────

const palette = {
  primary:      "#5B5FEF",
  primaryDark:  "#4338CA",
  primaryLight: "#EEF2FF",

  accent:       "#06B6D4",
  accentLight:  "#ECFEFF",

  success:      "#10B981",
  successLight: "#D1FAE5",

  warning:      "#F59E0B",
  warningLight: "#FEF3C7",

  danger:       "#EF4444",
  dangerLight:  "#FEE2E2",

  purple:       "#8B5CF6",
  purpleLight:  "#EDE9FE",

  pink:         "#EC4899",
  pinkLight:    "#FCE7F3",
};

// ─── Açık Tema ───────────────────────────────────────────────────────────────

export const lightTheme = {
  ...palette,
  bg:        "#F8FAFC",
  card:      "#FFFFFF",
  border:    "#E2E8F0",
  text:      "#1E293B",
  textSec:   "#64748B",
  textMuted: "#94A3B8",
};

// ─── Koyu Tema ───────────────────────────────────────────────────────────────

export const darkTheme = {
  ...palette,
  // Vurgu renkleri hafif parlaklaştırıldı
  primaryLight: "#1E1B4B",
  successLight: "#052E16",
  warningLight: "#1C1400",
  dangerLight:  "#2D0A0A",
  purpleLight:  "#1A0533",
  pinkLight:    "#2D0A1A",
  accentLight:  "#042F2E",

  bg:        "#0F172A",
  card:      "#1E293B",
  border:    "#334155",
  text:      "#F1F5F9",
  textSec:   "#94A3B8",
  textMuted: "#64748B",
};

// ─── Varsayılan tema (geriye dönük uyumluluk) ────────────────────────────────
export const T = lightTheme;

export type Theme = typeof lightTheme;

// ─── Tip renkleri (tema'ya göre) ─────────────────────────────────────────────

export const makeTipColors = (theme: Theme): Record<string, { bg: string; text: string }> => ({
  "İlk Görüşme":   { bg: theme.primaryLight, text: theme.primary },
  "Kontrol":        { bg: theme.successLight, text: theme.success },
  "Tetkik Sonucu": { bg: theme.warningLight,  text: theme.warning },
  "Diyet Planı":   { bg: theme.pinkLight,     text: theme.pink    },
  "Diğer":          { bg: theme.border,        text: theme.textSec },
});

export const makeDurumColors = (theme: Theme): Record<string, { bg: string; text: string }> => ({
  "bekliyor":   { bg: theme.warningLight, text: theme.warning },
  "tamamlandı": { bg: theme.successLight, text: theme.success },
  "iptal":      { bg: theme.dangerLight,  text: theme.danger  },
});

// Geriye dönük uyumluluk için statik export'lar (ThemeContext olmayan yerlerde)
export const TIP_COLORS  = makeTipColors(lightTheme);
export const DURUM_COLORS = makeDurumColors(lightTheme);


// Expo template uyumluluğu için
export const Colors = {
  light: { text: lightTheme.text, background: lightTheme.bg, tint: lightTheme.primary, icon: lightTheme.textSec },
  dark:  { text: darkTheme.text,  background: darkTheme.bg,  tint: darkTheme.primary, icon: darkTheme.textSec },
};
