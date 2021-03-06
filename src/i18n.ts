import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

import { key as IPGeolocationApiKey } from './components/SubscriptionBlock/apikey.private.json';

const language: string =
  Cookies.get("language") ||
  (window.navigator as any).userLanguage ||
  window.navigator.language;

(async () => {
  const locationData = await (
    await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${IPGeolocationApiKey}`
    )
  ).json();
  const { country_name } = locationData;
  console.log({ country_name });
  if (country_name === "Germany") i18n.changeLanguage("de");
})();

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      /* translation file path */
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json"
    },
    debug: false,
    defaultNS: "translations",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      formatSeparator: ","
    },
    // keySeparator: false,
    lng: language.includes("de") ? "de" : "en",

    /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
    ns: ["translations"],
    react: {
      wait: true
    }
  });

export default i18n;
