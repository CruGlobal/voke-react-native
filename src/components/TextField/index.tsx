import React, { forwardRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import Text from '../Text';
import Flex from '../Flex';
import st from '../../st'; // TODO: use new styles here.

// TextInputProps already have all the property definitions used here,
// so just extend it with our one custom property 'label'.
interface CustomProps extends TextInputProps {
  label: string;
}

const TextField = forwardRef(
  // TODO: try to find an appropriate type for ref: any?
  ({ label, ...restProps }: CustomProps, ref: any) => (
    <Flex direction="column" self="stretch" align="center" style={[st.mt2]}>
      <Text style={[st.offBlue, st.fs16]}>{label}</Text>
      <TextInput
        ref={ref}
        style={[
          st.w100,
          st.tac,
          {
            backgroundColor: st.colors.transparent,
            margin: 5,
            height: 50,
            color: 'white',
            fontSize: 24,
          },
          st.bbOffBlue,
          st.bbw1,
          st.fontFamilyMain,
        ]}
        underlineColorAndroid={st.colors.transparent}
        placeholderTextColor={st.colors.white}
        autoCapitalize={
          restProps.autoCapitalize ? restProps.autoCapitalize : 'words'
        }
        spellCheck={false}
        keyboardAppearance="dark"
        selectionColor={st.colors.white}
        returnKeyType={
          restProps.returnKeyType ? restProps.returnKeyType : 'done'
        }
        {...restProps}
      />
    </Flex>
  ),
);

export default TextField;
