import React from 'react';
import { Flex, Text } from '../common';
import st from '../../st';

export default function JourneyUnreadCount({ count }) {
  if (!count) return null;
  return (
    <Flex
      align="center"
      justify="center"
      style={[st.circle(20), st.bgOrange, st.ml6]}
    >
      <Text style={[st.white]}>{count > 99 ? '99' : count}</Text>
    </Flex>
  );
}
