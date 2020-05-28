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
  return (
    <Flex value={1} justify="center">

    </Flex>
  );
}

export default HeaderRight;
