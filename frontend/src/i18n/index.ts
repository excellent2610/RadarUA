import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { ua } from "./ua";

// Telegram Mini App: основна мова UI — українська.
i18n.use(initReactI18next).init({
  lng: "ua",
  fallbackLng: "ua",
  supportedLngs: ["ua"],
  resources: { ua: { translation: ua } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function translate(key: string, options?: Record<string, unknown>) {
  return i18n.t(key, options as any) as unknown as string;
}

export { useTranslation } from "react-i18next";

export default i18n;
