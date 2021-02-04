import React, { useState } from 'react';
import { Text, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import VokeIcon from 'components/VokeIcon';

import styles from './styles';

type Props = {
  initialValue?: string;
  label?: string;
  description?: string;
  items: [any];
  onChange?: (text: string) => void;
  [x: string]: any; // ..rest
};

function Dropdown({
  initialValue = '',
  label = '',
  description = '',
  items,
  onChange = (e): void => {
    e;
  },
  ...rest
}: Props): React.ReactElement {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={(newValue: string): void => {
          setValue(newValue);
          onChange(newValue);
        }}
        items={items}
        placeholder={{}}
        value={value}
        style={styles}
        useNativeAndroidPickerStyle={false}
        Icon={(): React.ReactElement => (
          <VokeIcon name="down-arrow" style={styles.dropDownIcon} size={10} />
        )}
        {...rest}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </>
  );
}

export default Dropdown;
