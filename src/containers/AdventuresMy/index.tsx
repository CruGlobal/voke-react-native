import React, { useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../reducers';
import { startupAction } from '../../actions/auth';
import { FlatList, View } from 'react-native';
import { useMount } from '../../utils';

import BotTalking from '../../components/BotTalking';
import styles from './styles';

import {
  getAvailableAdventures,
  getMyAdventures,
  getAdventuresInvitations,
} from '../../actions/requests';
import AvailableAdventureItem from '../../components/AvailableAdventureItem';
import MyAdventureItem from '../../components/MyAdventureItem';
import Triangle from '../../components/Triangle';
import AdventuresActions from '../AdventuresActions';

const AdventuresMy: React.FC = (): React.ReactElement => {
  const dispatch = useDispatch();
  const me = useSelector(({ auth }: RootState) => auth.user);
  const myAdventures = useSelector(({ data }: RootState) => data.myAdventures);
  const adventureInvitations = useSelector(
    ({ data }: RootState) => data.adventureInvitations,
  );
  const [isLoading, setIsLoading] = useState(false); // Initial loading.
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh.

  const updateAdventures = async (): Promise<void> => {
    console.log( "updateAdventures:🔁🔁🔁🔁🔁" );
    setIsLoading(true);
    // if (myAdventures.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getMyAdventures());
    // }
    // if (adventureInvitations.length === 0) {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getAdventuresInvitations());
    setIsLoading(false);
  }

  const refreshData = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      setIsRefreshing(true);
      await dispatch(updateAdventures());
    } finally {
      setIsRefreshing(false);
    }
  }

  // Actions to run once component mounted.
  useMount(() => {
    console.log( 'AdventuresMy: useMount >>>>>>>>>>>>>' );
    // Check notifications permission and setup sockets.
    dispatch(startupAction());
    // Load my adventures and invites. Note: async function can be part of hook!
    updateAdventures();
  });

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    React.useCallback(() => {
      //TODO: refresh data if users comes back here from new code generating screen.
      // Do something when the screen is focused
      console.log( '>>>>>>> Screen focused <<<<<<<<' );
      return () => {
        console.log( 'xxxxxxxx Screen UNfocused xxxxxxxx' );
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <FlatList
      ListHeaderComponent={ <AdventuresActions />}
      data={[].concat(adventureInvitations, myAdventures)}
      renderItem={(props): JSX.Element => <MyAdventureItem {...props} />}
      style={styles.AdventuresList}
      onRefresh={() => refreshData()}
      refreshing={isRefreshing}
      ListEmptyComponent={<BotTalking>
        {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
      </BotTalking>}
      // renderScrollComponent={(props) => (<ScrollView {...props} />)}
      // removeClippedSubviews <- DON'T ENABLE IT! CAUSING https://d.pr/pecCiO
    />
  );
};

export default AdventuresMy;
