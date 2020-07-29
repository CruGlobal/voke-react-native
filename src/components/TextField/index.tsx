import React, { forwardRef } from 'react';
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
  ({ label, ...restProps }: CustomProps, ref: any) => (
    <Flex
      direction="column"
      self="stretch"
      align="center"
    >
      <Text style={[st.offBlue, st.fs16]}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          st.w100,
          st.tac,
          {
            backgroundColor: st.colors.transparent,
            margin: 5,
            marginBottom: 0,
            height: 50,
            color: 'white',
            fontSize: restProps.value.length < 20 ? 24 : 21,
          },
          st.bbOffBlue,
          st.bbw1,
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
        {...restProps}
      />
      <View
        style={{
          marginTop: -2,
          paddingTop: 3,
          paddingHorizontal:12,
          height: 29,
          width:'100%',
          // alignSelf: 'flex-end',
          backgroundColor: restProps?.error ? theme.colors.secondary : 'transparent',
          borderRadius: theme.radius.xxs,
          borderBottomLeftRadius: theme.radius.xs,
          borderBottomRightRadius: theme.radius.xs,

        }}
      >
        <Triangle
          width={8}
          height={8}
          flip
          slant="down"
          color={ restProps?.error ? theme.colors.secondary : 'transparent'}
          style={{position: 'absolute',
          marginTop: -7,
          marginLeft: 10,
          transform: [{ rotate: '180deg'}]
          }}
        />
        <Text
          style={{
            color: theme.colors.white,
            fontSize: 14,
            fontFamily: theme.fonts.semiBold,
          }}
        >{restProps?.error}</Text>
      </View>
    </Flex>
  ),
);

export default TextField;
