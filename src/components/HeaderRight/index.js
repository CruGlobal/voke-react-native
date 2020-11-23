import React from 'react';
import st from 'utils/st';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Flex from '../Flex';
import VokeIcon from '../VokeIcon';
import Image from '../Image';
import Touchable from '../Touchable';

function HeaderRight() {
  const navigation = useNavigation();
  const me = useSelector(({ auth }) => auth.user);
  return <Flex value={1} justify="center" />;
}

export default HeaderRight;
