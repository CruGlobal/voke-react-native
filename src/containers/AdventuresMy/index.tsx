import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
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
import { setCurrentScreen } from '../../actions/info';

type AdventuresMyProps = {
  route: {
    name: string,
  };
};

const AdventuresMy = ({ route }: AdventuresMyProps): React.ReactElement => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false); // Pull-to-refresh.
  const me = useSelector(({ auth }: any) => auth.user);
  const adventureSteps = useSelector(({ data }: {data: TDataState}) => data.adventureSteps) || {};
  const myAdventuresIds = useSelector(({ data }: {data: TDataState}) => data.myAdventures.allIds)|| [];
  const invitationsIds = useSelector(({ data }: {data: TDataState}) => data.adventureInvitations.allIds) || [];
  const { t } = useTranslation('title' );

  const updateAdventures = async (): Promise<void> => {
    // TODO: Do some kind of time based caching for these requests
    await dispatch(getMyAdventures('AdventuresMy'));
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

/*
    useEffect(() => {
    // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();
  }, [adventureSteps ]); // Steps object have unread_messages field that we track.
 */
  // On first component loading update adventures and invites via API.
  useEffect(() => {
  // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();
  }, []);

  /* useEffect(() => {
    // Load my adventures + invites. Note: async function can't be part of hook!
    console.log('Something updated! Refresh the screen.')
  }, [myAdventuresIds, invitationsIds ]); */

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      // Save current screen and it's parammeters in store.
      dispatch(setCurrentScreen({
        screen: 'AdventuresMy'
      }));

      // Update adventures so we have up to date unreads badge.
      // dispatch( getMyAdventures('AdventuresMy - Use Focus Effect') );

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  return (
    <>
      <NotificationBanner />
      <ScrollView style={styles.AdventuresList}>
        <View style={styles.AdventureActions}>
          <AdventuresActions/>
        </View>
        { invitationsIds.length > 0 &&
          <>
            <Text style={styles.Heading}>{t('invitations')}</Text>
            { invitationsIds.map(
              (inviteID: string) => (
                <AdventureInvite inviteID={inviteID} />
              )
            )}
          </>
        }
        { myAdventuresIds.length > 0 &&
          <>
            <Text style={styles.Heading}>{t('adventures')}</Text>
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
