import React from 'react';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';
import st from '../../st';
import { useNavigation } from '@react-navigation/native';

function HeaderLeft({ hasBack = false }) {
  const navigation = useNavigation();
  return (
    <Flex value={1} style={[st.pl4]} justify="center">
      {hasBack ? (
        <Touchable
          style={[st.p5, st.pl4, st.mb3]}
          onPress={() => navigation.goBack()}
        >
          <VokeIcon
            type="image"
            name="buttonArrow"
            style={[st.rotate('180deg'), st.h(22), st.w(22)]}
          />
        </Touchable>
      ) : (
        <Touchable style={[st.p5, st.pl4]} onPress={() => {}}>
          <VokeIcon name="menu" size={25} style={[st.h(25)]} />
        </Touchable>
      )}
    </Flex>
  );
}

export default HeaderLeft;
