import i18n from 'i18next';
import { NativeModules, Platform } from 'react-native';
import { initReactI18next, reactI18nextModule } from 'react-i18next';

const deviceLanguage =
          Platform.OS === 'ios'
            ? NativeModules.SettingsManager.settings.AppleLocale ||
              NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
            : NativeModules.I18nManager.localeIdentifier;
// import * as moment from 'moment';
// Pull in all the moment locales
// import 'moment/min/locales.min';

/* export const locale = DeviceInfo.getDeviceLocale()
  .substr(0, 2)
  .toLowerCase();
 */
import translations from './locales/translations';

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => deviceLanguage.substr(0, 2).toLowerCase(),
  init: () => {},
  cacheUserLanguage: () => {},
};

// Set the date locale
// moment.locale(locale);

export default i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  // .use(reactI18nextModule)
  .init({
    // lng: 'es',
    // whitelist: ['en', 'es', 'fr', 'pt' ],
    fallbackLng:  ['en', 'es', 'fr', 'pt' ],
    debug: true,

    // Use downloaded translations if available but use en-US from source to make development easier
    resources: translations,

    keySeparator: false, // we do not use keys in form messages.welcome

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },

    /* react: {
      wait: true,
      nsMode: 'fallback',
    }, */
  });
