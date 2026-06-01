// ─── Uygulama renk paleti ───────────────────────────────────────────────────

export const T = {
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

  // Yüzeyler
  bg:        "#F8FAFC",
  card:      "#FFFFFF",
  border:    "#E2E8F0",

  // Metin
  text:      "#1E293B",
  textSec:   "#64748B",
  textMuted: "#94A3B8",
};

export const TIP_COLORS: Record<string, { bg: string; text: string }> = {
  "İlk Görüşme":   { bg: T.primaryLight, text: T.primary },
  "Kontrol":        { bg: T.successLight, text: T.success },
  "Tetkik Sonucu": { bg: T.warningLight,  text: T.warning },
  "Diyet Planı":   { bg: T.pinkLight,     text: T.pink    },
  "Diğer":          { bg: "#F1F5F9",      text: T.textSec },
};

export const DURUM_COLORS: Record<string, { bg: string; text: string }> = {
  "bekliyor":   { bg: T.warningLight, text: T.warning },
  "tamamlandı": { bg: T.successLight, text: T.success },
  "iptal":      { bg: T.dangerLight,  text: T.danger  },
};
