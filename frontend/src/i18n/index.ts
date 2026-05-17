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

export default i18n;

