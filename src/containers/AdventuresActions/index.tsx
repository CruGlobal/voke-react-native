
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import VokeIcon from '../../components/VokeIcon';

import st from '../../st';
import theme from '../../theme';

import Touchable from '../../components/Touchable';

function AdventuresActions() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const availableAdventures = useSelector(
    ({ data }) => data.availableAdventures
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);
  return (
    <Flex direction="column" align="center" justify="center" self="stretch">
      <Touchable
        style={[
          st.bgWhite,
          st.p4,
          st.br5,
          st.mv6,
          st.mt5,
          { width: st.fullWidth - 30 },
        ]}
        onPress={() => navigation.navigate('AdventureCode')}
      >
        <Flex direction="column" align="center" justify="center">
          <Text style={[st.darkBlue, st.fs18]}>Enter an Adventure Code</Text>
          <Text style={[st.fs14, st.grey]}>Did someone send you a code?</Text>
        </Flex>
      </Touchable>
      <Touchable
        style={[
          st.bgWhite,
          st.p4,
          st.br5,
          st.mv6,
          { width: st.fullWidth - 30 },
        ]}
        onPress={() => navigation.navigate('AdventureName', {
            item: adventures.find(a => a.name === 'The Faith Adventure'),
            withGroup: true,
          })}
      >
        <Flex direction="row" align="center" justify="between" style={[st.ph4]}>
          <VokeIcon
            type="image"
            name="groupDark"
            style={[st.w(40), st.h(40)]}
          />
          <Flex direction="column" align="center" justify="center">
            <Text style={[st.darkBlue, st.fs18]}>Start a Group</Text>
            <Text style={[st.fs14, st.grey]}>
              Do The Faith Adventure together!
            </Text>
          </Flex>
          <VokeIcon
            type="image"
            name="buttonArrowDark"
            style={[st.w(20), st.h(20)]}
          />
        </Flex>
      </Touchable>
    </Flex>
  );
}

export default AdventuresActions;
