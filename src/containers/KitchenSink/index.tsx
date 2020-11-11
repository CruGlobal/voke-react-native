import React, { useState } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { ScrollView, Share, Linking, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Communications from 'react-native-communications';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

import Flex from '../../components/Flex';
import st from '../../st';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import CONSTANTS from '../../constants';
import CRU from '../../assets/cru.png';
import SU from '../../assets/scriptureUnion.png';
import JF from '../../assets/jesusFilm.png';
import IAS from '../../assets/iAmSecond.png';
import OH from '../../assets/oneHope.png';
import YS from '../../assets/youthSpecialties.png';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Datepicker from '../../components/Datepicker';

const KitchenSink = props => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
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
      <View>
          <Button size="l" >Button size L</Button>
          <Spacer />
          <Button size="l" radius="l" >Button size L, radius L</Button>
          <Spacer />
          <Button size="l" radius="m" >Button size L, radius M</Button>
          <Spacer />
          <Button size="l" radius="s" >Button size L, radius S</Button>
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
