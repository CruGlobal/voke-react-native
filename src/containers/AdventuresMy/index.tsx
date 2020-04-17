import React, { useState, useRef, forwardRef, useEffect } from 'react';
import Orientation from 'react-native-orientation-locker';
import { useSafeArea } from 'react-native-safe-area-context';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, ScrollView, FlatList } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import BotTalking from '../../components/BotTalking';
import StatusBar from '../../components/StatusBar';
import VokeIcon from '../../components/VokeIcon';
import { useMount } from '../../utils';

import st from '../../st';
import theme from '../../theme';
import { logoutAction, startupAction } from '../../actions/auth';

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
  const dispatch = useDispatch();
  const me = useSelector(({ auth }) => auth.user);
  const myAdventures = useSelector(({ data }) => data.myAdventures);
  const adventureInvitations = useSelector(
    ({ data }) => data.adventureInvitations,
  );
  /*   const [combinedData, setCombinedData] = useState(
    [].concat(adventureInvitations, myAdventures),
  ); */

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

    console.log('adventureInvitations:\n', adventureInvitations);
    console.log('myAdventures:\n', myAdventures);
    // }
  });

  /*   useEffect(() => {
    setCombinedData([].concat(adventureInvitations, myAdventures));
  }, [myAdventures, adventureInvitations]);
 */
  return (
    <ScrollView style={[st.f1, st.bgBlue]}>
      <AdventuresActions />
      {/* LIST: INVITATIONS */}
      <FlatList
        data={adventureInvitations}
        renderItem={(props): JSX.Element => <MyAdventureItem {...props} />}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews
        /* ListEmptyComponent={() => ()} */
      />
      <FlatList
        data={myAdventures}
        renderItem={props => <MyAdventureItem {...props} />}
        style={[st.w(st.fullWidth)]}
        removeClippedSubviews
        /* ListEmptyComponent={() => ()} */
      />
      {!adventureInvitations.length && !myAdventures.length && (
        <BotTalking>
          {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
        </BotTalking>
      )}
    </ScrollView>
  );
};

export default AdventuresMy;
