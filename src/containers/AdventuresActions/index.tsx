
import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import VokeIcon from '../../components/VokeIcon';
import lodash from 'lodash';


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
    <Flex direction="row" align="flex-start" justify="flex-start">
      <Touchable
        style={[
          st.p4,
          st.mt6,
        ]}
        onPress={() => navigation.navigate('AdventureCode')}
      >
        <Flex direction="column" align="center" justify="center">
          <Text style={[st.white, st.fs18, {textDecorationLine:'underline'}]}>Have an Adventure Code?</Text>
        </Flex>
      </Touchable>
    </Flex>
  );
}

export default AdventuresActions;
