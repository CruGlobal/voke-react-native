import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: ['en', 'es', 'fr', 'pt'],

  // have a common namespace used around the full app
  ns: ['common'],
  defaultNS: 'common',
  fallbackNS: 'common',

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: {
    es: {
      welcome: {
        botMessageTitle: 'Bienvenido a Voke!',
      },
    },
    fr: {
      welcome: {
        botMessageTitle: 'Bienvenue à Voke!',
      },
    },
    'pt-BR': {
      welcome: {
        botMessageTitle: 'Bem-vindo ao Voke!',
      },
    },
    pt: {
      welcome: {
        botMessageTitle: 'Bem-vindo ao Voke!',
      },
    },
    'en-US': {
      welcome: {
        botMessageTitle: 'Welcome to Voke!',
      },
    },
    en: {
      welcome: {
        botMessageTitle: 'Welcome to Voke!',
      },
    },
  },
});

export default i18n;
