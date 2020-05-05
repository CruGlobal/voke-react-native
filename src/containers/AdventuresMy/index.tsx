import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { RootState } from '../../reducers';

import BotTalking from '../../components/BotTalking';
import styles from './styles';

import {
  getMyAdventures,
  getAdventuresInvitations
} from '../../actions/requests';
import MyAdventureItem from '../../components/MyAdventureItem';
import NotificationBanner from '../../components/NotificationBanner';
import AdventuresActions from '../AdventuresActions';

const AdventuresMy = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh.

  const me = useSelector(({ auth }: RootState) => auth.user);
  const myAdventures = useSelector(({ data }: RootState) => data.myAdventures);
  const invitations = useSelector(
    ({ data }: RootState) => data.adventureInvitations
  );

  const trackAdventures = useSelector(
    ({ data }: RootState) => data.dataChangeTracker.myAdventures
  );
  const trackInvitations = useSelector(
    ({ data }: RootState) => data.dataChangeTracker.adventureInvitations
  );
  const trackSteps = useSelector(
    ({ data }: RootState) => data.dataChangeTracker.adventureStepMessages
  );

  const updateAdventures = async (): Promise<void> => {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getMyAdventures());
    await dispatch(getAdventuresInvitations());
  };
  const refreshData = async (): Promise<void> => {
    setIsRefreshing(true);
    try {
      setIsRefreshing(true);
      await dispatch(updateAdventures());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();
  }, [trackAdventures, trackInvitations, trackSteps ]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <>
      <NotificationBanner />
      <FlatList
        ListHeaderComponent={<AdventuresActions />}
        data={[].concat(invitations, myAdventures)}
        renderItem={(props): JSX.Element => <MyAdventureItem {...props} />}
        style={styles.AdventuresList}
        contentContainerStyle={{paddingBottom:80}}
        // Extra padding to comensave last item covered with TabBar.
        onRefresh={() => refreshData()}
        refreshing={isRefreshing}
        ListEmptyComponent={(
          <BotTalking>
            {`Welcome ${me.firstName}! This is where you will find all of your adventures with your friends.`}
          </BotTalking>
        )}
      />
    </>
  );
};

export default AdventuresMy;
