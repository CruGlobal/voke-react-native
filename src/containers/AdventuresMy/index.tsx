import React, { useState, useRef, forwardRef, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
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
import { logoutAction, startupAction } from '../../actions/auth';
import { ActivityIndicator, ScrollView, FlatList } from 'react-native';

import Touchable from '../../components/Touchable';
import {
  getAvailableAdventures,
  getMyAdventures,
  getAdventuresInvitations,
} from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import MyAdventureItem from '../../components/MyAdventureItem';
import Triangle from '../../components/Triangle';
import AdventuresActions from '../AdventuresActions';


const AdventuresMy = () => {
  const myAdventures = useSelector(({ data }) => data.myAdventures);
  const me = useSelector(({ auth }) => auth.user);
  const adventureInvitations = useSelector(
    ({ data }) => data.adventureInvitations,
  );
  const [combinedData, setCombinedData] = useState(
    [].concat(adventureInvitations, myAdventures),
  );
  const dispatch = useDispatch();

  // Actions to run when component mounted.
  useMount(() => {
    dispatch(startupAction());
    // dispatch({ type: REDUX_ACTIONS.RESET });
    // if (myAdventures.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    dispatch(getMyAdventures());
    // }
    // if (adventureInvitations.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    dispatch(getAdventuresInvitations());
    // }
  });

  useEffect(() => {
    setCombinedData([].concat(adventureInvitations, myAdventures));
  }, [myAdventures, adventureInvitations]);

  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <AdventuresActions />
      <FlatList
        renderItem={props => <MyAdventureItem {...props} />}
        data={combinedData}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.mh4, st.mt1, st.h(230)]}
          >
            <Flex justify="end" self="stretch" style={[]}>
              <VokeIcon
                type="image"
                name="vokebot"
                style={[
                  st.asc,
                  st.w(st.fullWidth * 0.2),
                  { marginBottom: -35, marginRight: -20 },
                ]}
              />
            </Flex>
            <Flex direction="column" value={1} justify="start" style={[st.pr3]}>
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                <Text style={[st.white, st.fs18, st.tac]}>
                  {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
                </Text>
              </Flex>
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                slant="down"
                flip={true}
                style={[st.rotate(90), st.mt(-6)]}
              />
            </Flex>
          </Flex>
        )}
      />
    </ScrollView>
  );
}

export default AdventuresMy;
