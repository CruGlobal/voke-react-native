import i18n, {
  LanguageDetectorModule,
  ResourceLanguage,
  Resource,
} from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findBestAvailableLanguage } from 'react-native-localize';

import oneSkyTranslations from './locales/translations.json';
import en_US from './locales/en-US.json';

// Tip: use \u00A0 instead of npsp for i18n in translation strings.

// Flatten OneSky translations to remove extra `translations` key
const mapOneSkyToResourceLanguages = (oneSkyTranslations: OneSkyTranslations) =>
  Object.entries(oneSkyTranslations).reduce(
    (resources, [localeTag, oneskyTranslation]) => ({
      ...resources,
      [localeTag]: oneskyTranslation.translation,
    }),
    {},
  );

const resourceLanguages = {
  // Use downloaded translations if available but use en-US from source to make development easier
  ...mapOneSkyToResourceLanguages(oneSkyTranslations),
  ...{ 'en-US': en_US as ResourceLanguage },
};

export const aliasLanguages = (
  aliases: { [alias: string]: string },
  translations: Resource,
) => ({
  ...translations,
  // Clone language translations to aliases if alias doesn't yet exist
  ...Object.entries(aliases).reduce(
    (aliasedTranslations, [alias, real]) => ({
      ...aliasedTranslations,
      // Keep existing translations if language exists or copy aliased language translations
      [alias]: translations[alias] || translations[real],
    }),
    {},
  ),
});

// Create alias mappings for base translations (key: alias languageTag, value: real languageTag)
export const createBaseLocaleAliases = (
  oneSkyTranslations: OneSkyTranslations,
) =>
  Object.keys(oneSkyTranslations).reduce(
    (baseAliases, languageTag) => ({
      ...baseAliases,
      [languageTag.split('-')[0]]: languageTag,
    }),
    {},
  );

const aliasedResourceLanguages: Resource = aliasLanguages(
  createBaseLocaleAliases(oneSkyTranslations),
  resourceLanguages,
);

const languageDetector: LanguageDetectorModule = {
  type: 'languageDetector',
  detect: () => {
    return (
      findBestAvailableLanguage(Object.keys(aliasedResourceLanguages)) || {}
    ).languageTag;
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

// Set the date locale

export default i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  // .use(reactI18nextModule)
  .init({
    fallbackLng: ['en', 'es', 'fr', 'pt'],
    // Use downloaded translations if available but use en-US from source to make development easier
    resources: aliasedResourceLanguages,
    keySeparator: false, // we do not use keys in form messages.welcome
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    fallbackNS: 'common',

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });
