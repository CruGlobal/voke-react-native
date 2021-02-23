import React from 'react';
import { View, Text, Pressable } from 'react-native';
import VokeIcon from 'components/VokeIcon';

import styles from './styles';

interface Props {
  selectedValue: string | null;
  onUpdate: (item: { value: string; label?: string }) => void;
  options: {
    value: string;
    label?: string;
  }[];
  isDisabled: boolean;
}

const Options = ({
  selectedValue,
  onUpdate,
  options,
  isDisabled,
}: Props): React.ReactElement => {
  return (
    <View style={styles.optionWrapper}>
      {options.map((item) => (
        <Pressable
          onPress={(): void => {
            if (!isDisabled) {
              onUpdate(item);
            }
          }}
          android_ripple={{ color: 'rgba(255,255,255,.5)' }} //TODO: Adjust this!
          style={styles.option}
        >
          <View style={styles.optionCheck}>
            <VokeIcon
              name="checkmark-outline"
              size={18}
              style={
                selectedValue === item.label
                  ? styles.optionCheckSelected
                  : styles.optionCheckDefault
              }
            />
          </View>
          <View style={styles.optionRow}>
            <Text
              style={
                selectedValue === item.label
                  ? styles.optionLabelSelected
                  : styles.optionLabelDefault
              }
            >
              {item.label}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

export default Options;
