import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import theme from '../../theme';
import Button from '../Button';

import styles from './styles';

type Props = {
  initialDate?: string;
  mode: 'date' | 'time' | 'datetime' | undefined;
  format?: string;
  label?: string;
  description?: string;
  minuteInterval?: number;
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

  const handleConfirm = (newDate: string): void => {
    setDate(moment(newDate).format(format));
    hideDatePicker();
  };

  useEffect(() => {
    onChange(date);
  }, [date]);

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <Button
        onPress={showDatePicker}
        touchableStyle={styles.button}
        testID={'ctaDatePicker'}
      >
        <Text style={styles.buttonLabel}>{date}</Text>
      </Button>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minuteInterval={minuteInterval}
        headerTextIOS={label}
        {...rest}
      />
      <View
        style={{
          width: '100%',
          minHeight: theme.spacing.xl,
        }}
      >
        <Text
          style={{
            color: theme.colors.secondary,
            paddingTop: 10,
            fontSize: theme.fontSizes.s,
            alignSelf: 'center',
          }}
        >
          {description}
        </Text>
      </View>
    </>
  );
}

export default Datepicker;
