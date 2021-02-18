import React, { ReactElement, useEffect, useState } from 'react';
import i18next from 'i18next';
import Select from 'domain/Common/Select';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';

import styles from './styles';

// Can't use import for json:
// https://github.com/microsoft/TypeScript/issues/24715
const languageCodes = require('i18n/langaugeCodes.json');
type Option = {
  label: string;
  selected?: boolean;
};

const LanguageSwitch = (): ReactElement => {
  const lang = languageCodes[i18next.language.substr(0, 2).toLowerCase()];
  const availableTranslations = i18next.languages;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);

  useEffect(() => {
    // Prepare list of languages for selector removing 'en-US' used
    // for development purposes only.
    const appLang = i18next.language.toUpperCase();

    availableTranslations.map(lang => {
      const stepLang = lang.toUpperCase();
      if (stepLang !== 'EN-US') {
        if (
          appLang === stepLang ||
          (stepLang === 'EN' && appLang === 'EN-US')
        ) {
          setSelectOptions(current => [
            ...current,
            { label: lang, selected: true },
          ]);
        } else {
          setSelectOptions(current => [...current, { label: lang }]);
        }
      }
    });
  }, []);

  const newLangSelected = (option: Option): void => {
    // Change current language for app UI.
    const appLang = i18next.language.toUpperCase();
    const newSelectOptions: Option[] = selectOptions;
    selectOptions.map((value, index) => {
      if (
        value.label === option.label ||
        (appLang === 'EN-US' && option.label.toUpperCase() === 'EN')
      ) {
        // Mark selected language as current in the options object.
        newSelectOptions[index].selected = true;
        // Change current language in i18next instance:
        i18next.changeLanguage(value?.label);
      } else {
        delete selectOptions[index].selected;
      }
    });
    setSelectOptions(newSelectOptions);
  };

  return (
    <Select
      options={selectOptions}
      // Toggle button:
      toggleText={lang.name}
      toggleTestId="languageSwitchButton"
      toggleTextStyle={styles.settingOption}
      // Selector state change:
      isOpen={modalVisible}
      onOpen={() => setModalVisible(true)}
      onClose={() => setModalVisible(false)}
      onSelect={option => newLangSelected(option)}
      // Single option:
      optionEl={option => {
        return (
          <>
            {/* Item Label */}
            <Text style={styles.langOptionText}>
              {option.label.toUpperCase()}
            </Text>
            {/* Checkmark icon */}
            {option?.selected && (
              <VokeIcon
                name="checkmark-outline"
                size={10}
                style={styles.langOptionCheckmark}
                testID={'selected-' + option.label}
              />
            )}
          </>
        );
      }}
    />
  );
};

export default LanguageSwitch;
