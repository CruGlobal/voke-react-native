import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import OldButton from '../OldButton';

import styles from './styles';

type Props = {
  initialDate?: string;
  mode: 'date' | 'time' | 'datetime' | undefined;
  format?: string;
  label?: string;
  description?: string;
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30 | undefined;
  onChange?: (text: string) => void;
  [x: string]: any; // ..rest
};

function Datepicker({
  initialDate = '',
  mode = 'date',
  format = '',
  label = '',
  description = '',
  minuteInterval,
  onChange = (e): void => {
    e;
  },
  ...rest
}: Props): React.ReactElement {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(initialDate);

  const showDatePicker = (): void => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = (): void => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (newDate: Date): void => {
    setDate(moment(newDate).format(format));
    hideDatePicker();
  };

  useEffect(() => {
    onChange(date);
  }, [date]);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <OldButton
        onPress={showDatePicker}
        touchableStyle={styles.button}
        testID={'ctaDatePicker'}
      >
        <Text style={styles.buttonLabel}>{date}</Text>
      </OldButton>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minuteInterval={minuteInterval}
        headerTextIOS={label}
        {...rest}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </>
  );
}

export default Datepicker;
