import Select from 'domain/Common/Select';

import React, { ReactElement, useEffect, useState } from 'react';
import i18next from 'i18next';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';
import { getAvailableAdventures } from 'actions/requests';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';

import styles from './styles';

// Can't use import for json:
// https://github.com/microsoft/TypeScript/issues/24715

type Option = {
  label: string;
  selected?: boolean;
};

const availableTranslations = [
  'EN',
  'ES',
  // 'PR',
  // 'FR'
];

const AdvLanguageSwitch = (): ReactElement => {
  const [currentLang, setCurrentLang] = useState('EN');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Some languages composed from two parts like 'EN-US'.
    // We extract only first part of this string.
    const langParts = currentLang.split('-');
    return langParts[0];
  }, [currentLang]);

  const fillLanguages = (): void => {
    const appLang = i18next.language.toUpperCase();
    availableTranslations.map((lang) => {
      const stepLang = lang.toUpperCase();
      if (appLang === stepLang || (stepLang === 'EN' && appLang === 'EN-US')) {
        setSelectOptions((current) => [
          ...current,
          { label: lang, selected: true },
        ]);
        setCurrentLang(stepLang);
      } else {
        setSelectOptions((current) => [...current, { label: lang }]);
      }
    });
  };

  useEffect(() => {
    // Prepare list of languages for selector removing 'en-US' used
    // for development purposes only.
    if (!selectOptions.length) {
      fillLanguages();
    }
  }, [selectOptions.length]);

  const newLangSelected = (option: Option): void => {
    // Change current language for app UI.
    const newSelectOptions: Option[] = selectOptions;
    selectOptions.map((value, index) => {
      if (value.label === option.label) {
        // Mark selected language as current in the options object.
        newSelectOptions[index].selected = true;
        // Pull adventures for the current language from the server.
        dispatch(getAvailableAdventures(value?.label.toLowerCase()));
        setCurrentLang(value.label);
      } else {
        delete selectOptions[index].selected;
      }
    });
    setSelectOptions(newSelectOptions);
  };

  return (
    <View style={styles.container}>
      <VokeIcon name="globe" size={14} style={styles.iconGlobe} />
      <Select
        options={selectOptions}
        // Toggle button:
        toggleText={currentLang}
        toggleTestId="languageSwitchButton"
        toggleTextStyle={styles.settingOption}
        // Selector state change:
        isOpen={modalVisible}
        onOpen={(): void => setModalVisible(true)}
        onClose={(): void => setModalVisible(false)}
        onSelect={(option): void => newLangSelected(option)}
        // Single option:
        optionEl={(option): Element => {
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
    </View>
  );
};

export default AdvLanguageSwitch;
