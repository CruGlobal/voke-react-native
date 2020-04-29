import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import StatusBar from '../../components/StatusBar';
import VokeIcon from '../../components/VokeIcon';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useMount } from '../../utils';

import st from '../../st';
import theme from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, ScrollView, FlatList } from 'react-native';

import Touchable from '../../components/Touchable';
import {
  getAvailableAdventures,
  getMyAdventures,
  getAdventuresInvitations,
} from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import Triangle from '../../components/Triangle';
import AdventuresActions from '../AdventuresActions';


const AdventuresFind = () => {
  const availableAdventures = useSelector(
    ({ data }) => data.availableAdventures,
  );
  const [adventures, setAdventures] = useState(availableAdventures);
  const dispatch = useDispatch();
  useMount(() => {
    if (availableAdventures.length === 0) {
      dispatch(getAvailableAdventures());
    }
  });
  useEffect(() => {
    setAdventures(availableAdventures);
  }, [availableAdventures]);
  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <AdventuresActions />
      <FlatList
        renderItem={props => <AvailableAdventureItem {...props} />}
        data={adventures}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews={true}
      />
    </ScrollView>
  );
}

export default AdventuresFind;
