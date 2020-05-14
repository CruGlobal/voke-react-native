import React, {useState} from 'react';
import st from '../../st';
// import MultiSelect from 'react-native-multiple-select';
import { isArray } from '../../utils';
import {View, Text, TouchableOpacity} from 'react-native'
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';

const Select = ({
  isMulti,
  selectedValue,
  onChange,
  onUpdate,
  options,
  placeholder,
  containerColor,
  isDisabled,
  label,
  ...rest
}) => {

  return (
    <View>
      {
        options.map( item => (
          <TouchableOpacity
            onPress={ isDisabled ? ()=>{} : ()=> { onUpdate(item) } }
            activeOpacity={0.6}
            accessibilityTraits="button"
            style={{
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderBottomWidth: .5,
              borderBottomColor: 'rgba(0,0,0,.15)',
              flex: 1,
              flexDirection: "row",
            }}>
            <Flex style={{
              paddingVertical: 6,
              paddingLeft: 10,
              paddingRight:10,
            }}>
              <VokeIcon
                name="checkmark-outline"
                size={18}
                style={{
                  color: selectedValue === item.value ? st.colors.orange : st.colors.grey,
                  opacity: selectedValue === item.value ? 1 : 0,
                }} />
            </Flex>
            <Flex value={1} style={{
              paddingVertical: 6,
              paddingLeft: 10,
            }}>
              <Text style={
                {
                  color: selectedValue === item.value ? st.colors.orange : st.colors.darkBlue,
                  fontSize: 16,
                }}>{item.label}</Text>
            </Flex>
          </TouchableOpacity>
        ))
      }
    </View>
  );
};

export default Select;
