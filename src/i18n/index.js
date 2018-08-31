import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import * as moment from 'moment';
// Pull in all the moment locales
import 'moment/min/locales.min';

import { locale } from '../utils/common';

import translations from './locales/translations';

const languageDetector = {
  type: 'languageDetector',
  async: false,
  detect: () => locale,
  init: () => {},
  cacheUserLanguage: () => {},
};

// Set the date locale
moment.locale(locale);

export default i18n
  .use(languageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',

    // Use downloaded translations if available but use en-US from source to make development easier
    resources: translations,

    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },

    react: {
      wait: true,
      nsMode: 'fallback',
    },
  });
