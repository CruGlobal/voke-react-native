import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Text from 'components/Text';
import Screen from 'components/Screen';
import Button from 'components/Button';
import Datepicker from 'components/Datepicker';
import Spacer from 'components/Spacer';

const KitchenSink = (props) => {
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <Screen>
      <Text>Kitchen Sknk</Text>
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <Button size="l">Button size L</Button>
        <Spacer />
        <Button size="l" radius="l">
          Button size L, radius L
        </Button>
        <Spacer />
        <Button size="l" radius="m">
          Button size L, radius M
        </Button>
        <Spacer />
        <Button size="l" radius="s">
          Button size L, radius S
        </Button>
      </View>
      <View>
        <View>
          <Button onPress={showDatepicker}>Show date picker!</Button>
        </View>
        <View>
          <Button onPress={showTimepicker}>Show time picker!</Button>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )}
      </View>
      <Datepicker
        label={'Date Picker Modal'}
        format={'h:mm A'}
        initialDate={'9:15 AM'}
        mode="time"
        minuteInterval={5}
        onChange={(newTime: string): void => {
          console.log('Datepicker=>onChange newTime', newTime);
        }}
        testID="datePickerModal"
      />
    </Screen>
  );
};

export default KitchenSink;
