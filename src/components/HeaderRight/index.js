import React from 'react';
import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import { useSelector } from 'react-redux';

import { useNavigation } from '@react-navigation/native';

function HeaderRight() {
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  const myAvatar = me?.avatar?.medium;
  return (
    <Flex value={1} justify="center">
      <Touchable
        style={[
          {
            // Extra padding to make taps more responsive.
            paddingTop: 6,
            paddingLeft: 16,
            paddingRight: 20,
            paddingBottom: 8,
          },
        ]}
        onPress={() => navigation.navigate('AccountProfile')}
      >
        <Image
          source={{
            uri: myAvatar || undefined,
          }}
          style={{
            width: 32,
            height: 32,
            // borderColor: '#fff',
            // borderWidth: 1,
            borderRadius: 99,
          }}
        />
      </Touchable>
    </Flex>
  );
}

export default HeaderRight;
