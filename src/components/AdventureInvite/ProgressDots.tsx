import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useMount, momentUtc, useInterval } from 'utils';
import { useNavigation } from '@react-navigation/native';

import Image from '../Image';
import st from 'utils/st';
import Touchable from '../Touchable';
import Text from '../Text';
import OldButton from '../OldButton';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { getMyAdventure } from '../../actions/requests';

import styles from './styles';

const ProgressDots = React.memo(function ({ isFilled }) {
  return (
    <View
      style={[
        isFilled ? st.bgBlue : [st.bgTransparent, st.bw1, st.borderCharcoal],
        st.mr6,
        st.circle(10),
      ]}
    />
  );
});

export default ProgressDots;
