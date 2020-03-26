import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { useSelector, useDispatch } from 'react-redux';
import { useMount, momentUtc, useInterval } from '../../utils';
import { getMyAdventures } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';

function AdventureStepMessage({ item, step, adventure }) {
  const me = useSelector(({ auth }) => auth.user);
  const message = {
    code: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    name: '',
    ...item,
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();

  return (
    <Flex
      style={[
        st.mt6,
        st.w(st.fullWidth - 30),
        st.bgWhite,
        st.br6,
        st.ovh,
        st.asc,
        st.shadow,
      ]}
      direction="row"
      align="center"
      justify="center"
    >
      <Text>HJEREHRE</Text>
    </Flex>
  );
}

export default AdventureStepMessage;
