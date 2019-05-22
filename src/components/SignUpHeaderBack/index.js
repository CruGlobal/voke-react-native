import React from 'react';

import { Flex, Button, Icon, VokeIcon } from '../common';
import theme from '../../theme';
import st from '../../st';

export default function SignUpHeaderBack({ onPress, style }) {
  return (
    <Flex
      self="start"
      style={[
        {
          paddingTop: theme.isAndroid ? 10 : 25,
          paddingLeft: 10,
        },
        style,
      ]}
    >
      <Button onPress={onPress} type="transparent" style={{ padding: 10 }}>
        {theme.isAndroid ? (
          <Icon name="arrow-back" size={30} style={[st.white]} />
        ) : (
          <VokeIcon name="back_arrow" style={[st.white]} />
        )}
      </Button>
    </Flex>
  );
}
