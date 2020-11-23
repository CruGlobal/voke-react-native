import React from 'react';
import st from 'utils/st';

import Touchable from '../Touchable';
import Text from '../Text';
import Flex from '../Flex';

function RoundButton({ onPress, text, textStyle, style }) {
  return (
    <Touchable
      onPress={onPress}
      style={[st.br1, st.bw1, st.borderPink, st.pv6, st.ph4, { ...style }]}
    >
      <Flex align="center" justify="center" style={[st.pt6]}>
        <Text style={[st.white, st.fs5, st.fontTitle, { ...textStyle }]}>
          {text.toUpperCase()}
        </Text>
      </Flex>
    </Touchable>
  );
}

export default RoundButton;
