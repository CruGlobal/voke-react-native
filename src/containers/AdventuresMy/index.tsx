import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, FlatList, View, Text } from 'react-native';
import { TDataState } from '../../types'

import BotTalking from '../../components/BotTalking';
import styles from './styles';

import {
  getMyAdventures,
  getAdventuresInvitations
} from '../../actions/requests';
import AdventureInvite from '../../components/AdventureInvite';
import AdventureCard from '../../components/AdventureCard';
import NotificationBanner from '../../components/NotificationBanner';
import AdventuresActions from '../AdventuresActions';
import Flex from 'src/components/Flex';

const AdventuresMy = (): React.ReactElement => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh.

  const me = useSelector(({ auth }: any) => auth.user);
  const adventureSteps = useSelector(({ data }: {data: TDataState}) => data.adventureSteps) || {};
  const myAdventuresIds = useSelector(({ data }: {data: TDataState}) => data.myAdventures.allIds)|| [];
  const invitationsIds = useSelector(({ data }: {data: TDataState}) => data.adventureInvitations.allIds) || [];

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
  }, [adventureSteps ]); // Steps object have unread_messages field that we track.

  // On first component loading update adventures and invites via API.
  useEffect(() => {
  // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();
  }, []);

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
      {/* <FlatList
        ListHeaderComponent={<AdventuresActions />}
        data={[].concat(invitations, myAdventuresIds)}
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
      /> */}
      <ScrollView style={styles.AdventuresList}>
        <AdventuresActions />
        { invitationsIds.length > 0 &&
          <>
            <Text style={styles.Heading}>Invitations</Text>
            { invitationsIds.map(
              (inviteID: string) => (
                <AdventureInvite inviteID={inviteID} />
              )
            )}
          </>
        }
        { myAdventuresIds.length > 0 &&
          <>
            <Text style={styles.Heading}>Adventures</Text>
            { myAdventuresIds.map(
              (advId: string) => (
                <AdventureCard adventureId={advId} />
              )
            )}
          </>
        }
        {/* Extra spacing for bottom navigation tabs */}
        <View style={{height:120}}></View>
      </ScrollView>
    </>
  );
};

export default AdventuresMy;
