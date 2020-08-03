import React, { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import Text from '../Text';
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Triangle from '../Triangle';
import theme from '../../theme';
import st from '../../st'; // TODO: use new styles here.

// TextInputProps already have all the property definitions used here,
// so just extend it with our one custom property 'label'.
interface CustomProps extends TextInputProps {
  label: string;
}

const TextField = forwardRef(
  // TODO: try to find an appropriate type for ref: any?
  ({ label, ...restProps }: CustomProps, ref: any) => {

  const [focused, setFocused] = useState(false);

  return (
    <Flex
      direction="column"
      self="stretch"
      align="center"
    >
      <Text style={[st.fs16, {
        fontSize: theme.fontSizes.l,
        color: theme.colors.secondary,
        minHeight: 26,
      }]}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          st.w100,
          st.tac,
          {
            backgroundColor: theme.colors.transparent,
            borderBottomWidth: 1,
            borderBottomColor: focused ? theme.colors.white : theme.colors.secondaryAlt,
            margin: 5,
            marginBottom: 0,
            height: 50,
            color: theme.colors.white,
            fontSize: restProps.value.length < 20 ? theme.fontSizes.xxl : theme.fontSizes.xl,
          },
          // st.bbOffBlue,
          // st.bbw1,
          st.fontFamilyMain,
        ]}
        underlineColorAndroid={theme.colors.transparent}
        placeholderTextColor={theme.colors.white}
        autoCapitalize={
          restProps.autoCapitalize ? restProps.autoCapitalize : 'words'
        }
        spellCheck={false}
        keyboardAppearance="dark"
        selectionColor={theme.colors.white}
        returnKeyType={
          restProps.returnKeyType ? restProps.returnKeyType : 'done'
        }
        onFocus={()=>{
          setFocused(true)}
        }
        onEndEditing={()=>{
          setFocused(false);
        }}
        {...restProps}
      />
      <View
        style={{
          width:'100%',
          minHeight: 26,
        }}
      >
        <Text
          style={{
            color: theme.colors.red,
            paddingTop: 2,
            fontSize: theme.fontSizes.s,
            alignSelf: 'center',
          }}
        >{restProps?.error}</Text>
      </View>
    </Flex>
  )}
);

export default TextField;
