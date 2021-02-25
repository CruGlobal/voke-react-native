import Select from 'domain/Common/Select';

import React, { ReactElement, useEffect, useState } from 'react';
import VokeIcon from 'components/VokeIcon';
import Text from 'components/Text';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import styles from './styles';

type Option = {
  label: string;
  value?: string | number;
  selected?: boolean;
};

interface Params {
  selected: string;
  setOption: (value: string | number) => void;
}

const ReleaseDaySwitch = ({ selected, setOption }: Params): ReactElement => {
  const { t } = useTranslation('share');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectOptions, setSelectOptions] = useState<Option[]>([]);

  useEffect(() => {
    const availableOptions = [
      { label: t('monday'), value: 'Monday' },
      { label: t('tuesday'), value: 'Tuesday' },
      { label: t('wednesday'), value: 'Wednesday' },
      { label: t('thursday'), value: 'Thursday' },
      { label: t('friday'), value: 'Friday' },
      { label: t('saturday'), value: 'Saturday' },
      { label: t('sunday'), value: 'Sunday' },
    ];

    const fillOptions = (): void => {
      availableOptions.map((option) => {
        if (selected === option.label) {
          setSelectOptions((current: string) => [
            ...current,
            { label: option.label, value: option.value, selected: true },
          ]);
        } else {
          setSelectOptions((current: string) => [
            ...current,
            { label: option.label, value: option.value },
          ]);
        }
      });
    };
    // Prepare list of languages for selector removing 'en-US' used
    // for development purposes only.
    if (!selectOptions.length) {
      fillOptions();
    }
  }, [selectOptions.length, selected, t]);

  const onOptionSelected = (selectedOption: Option): void => {
    // Change current language for app UI.
    const newSelectOptions: Option[] = selectOptions;
    selectOptions.map((option: Option, index: number) => {
      if (selectedOption.label === option.label) {
        // Mark selected language as current in the options object.
        newSelectOptions[index].selected = true;
        setOption(selectedOption?.value || '');
      } else {
        delete newSelectOptions[index].selected;
      }
    });
    setSelectOptions(newSelectOptions);
  };

  return (
    <View style={styles.dayOptionBlock}>
      <Text style={styles.dayOptionTitle}>{t('releaseDay')}</Text>
      <Select
        options={selectOptions}
        // Toggle button:
        toggleText={selected}
        toggleTestId="dayOfWeekSelect"
        toggleTextStyle={styles.dayOptionLabel}
        // Selector state change:
        isOpen={modalVisible}
        onOpen={(): void => setModalVisible(true)}
        onClose={(): void => setModalVisible(false)}
        onSelect={(option: Option): void => {
          onOptionSelected(option);
        }}
        // Single option:
        optionEl={(option): Element => {
          return (
            <>
              <Text style={styles.dayOptionText}>{option.label}</Text>
              {option?.selected && (
                <VokeIcon
                  name="checkmark-outline"
                  size={10}
                  style={styles.dayOptionCheckmark}
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

export default ReleaseDaySwitch;
