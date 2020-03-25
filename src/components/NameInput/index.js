import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import Text from '../Text';
import Flex from '../Flex';
import st from '../../st';

const NameInput = forwardRef(({ ...rest }, ref) => {
  return (
    <Flex direction="column" self="stretch" align="center" style={[st.mt2]}>
      <Text style={[st.offBlue, st.fs14]}>{rest.label}</Text>
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
        underlineColorAndroid={st.colors.offBlue}
        placeholderTextColor={st.colors.white}
        contextMenuHidden={true}
        returnKeyType={'done'}
        autoCapitalize={'words'}
        spellCheck={false}
        keyboardAppearance={'dark'}
        selectionColor={st.colors.white}
        colo
        {...rest}
      />
    </Flex>
  );
});

export default NameInput;
