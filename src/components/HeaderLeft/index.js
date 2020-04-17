import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Touchable from '../Touchable';
import st from '../../st';

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
            name="leftArrow"
            style={[st.h(22), st.w(22), st.mt3]}
          />
        </Touchable>
      ) : (
        <Touchable
          style={[st.p5, st.pl4]}
          onPress={() => navigation.navigate('Menu')}
        >
          <VokeIcon type="image" name="menuIcon" style={[st.h(22), st.w(22)]} />
        </Touchable>
      )}
    </Flex>
  );
}

export default HeaderLeft;
