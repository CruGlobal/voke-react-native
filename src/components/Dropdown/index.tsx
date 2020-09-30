import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import useKeyboard from '@rnhooks/keyboard';
import RNPickerSelect from 'react-native-picker-select';
import moment from 'moment';
import theme from '../../theme';
import VokeIcon from '../VokeIcon';

import styles from './styles';

function Dropdown({ initialValue='', label = '', description='', items, onFocus, onChange = ()=>{}, ...rest }) {
  const [value, setValue] = useState(initialValue)

  return (
    <>
      <Text style={{
          fontSize: theme.fontSizes.l,
          color: theme.colors.secondary,
          minHeight: 26,
        }}>{label}</Text>
      <RNPickerSelect
        onValueChange={(newValue) => {
          setValue(newValue);
          onChange(newValue);
        }}
        items={items}
        placeholder={{}}
        value={value}
        style={pickerSelectStyles}
        Icon={()=><VokeIcon name="down-arrow" style={{color: theme.colors.white}} size={10} />}
      />
      <View
        style={{
          width: '100%',
          // paddingBottom: theme.spacing.xl,
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
        >{description}</Text>
      </View>
    </>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    textAlign: 'center',
    paddingLeft: 25,
    paddingVertical: 10,

    // lineHeight: 27,
    height: 50,
            color: 'white',
            fontSize: 24,

    // paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.secondaryAlt,

    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconContainer: {
    top: '40%',
    right: 10,
  },
});


export default Dropdown;
