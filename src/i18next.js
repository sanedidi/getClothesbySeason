import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import langRu from './locales/ru.json';
import langUz from './locales/uz.json';
import langEn from "./locales/en.json";

const resources = {
  ru: {
    translation: langRu
  },
  uz: {
    translation: langUz
  },
  en: {
    translation: langEn
  }
};

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ru",
    whiteList: ["en", "ru", "uz"],
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false // Отключить экранирование для безопасности
    }
  });

export default i18next;
