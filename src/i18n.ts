import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      /* translation file path */
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json"
    },
    debug: true,
    defaultNS: "translations",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      formatSeparator: ","
    },
    // keySeparator: false,
    lng: "en",

    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    ns: ["translations"],
    react: {
      wait: true
    }
  });

export default i18n;
