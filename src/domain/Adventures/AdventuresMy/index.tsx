import React, { useEffect, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import AdventureInvite from 'components/AdventureInvite';
import AdventureCard from 'components/AdventureCard';
import NotificationBanner from 'components/NotificationBanner';
import { TDataState } from 'utils/types';
import { setCurrentScreen } from 'actions/info';
import { getMyAdventures, getAdventuresInvitations } from 'actions/requests';

import styles from './styles';

const AdventuresMy = (): React.ReactElement => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const myAdventuresIds =
    useSelector(
      ({ data }: { data: TDataState }) => data.myAdventures?.allIds,
    ) || [];
  const invitationsIds =
    useSelector(
      ({ data }: { data: TDataState }) => data.adventureInvitations?.allIds,
    ) || [];
  const { t } = useTranslation('title');

  // On first render update adventures and invites via API.
  useEffect(() => {
    const updateAdventures = (): void => {
      dispatch(getMyAdventures('AdventuresMy'));
      dispatch(getAdventuresInvitations());
    };
    // Load my adventures + invites. Note: async function can't be part of hook!
    updateAdventures();
  }, [dispatch]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      // Save current screen and it's parammeters in store.
      dispatch(
        setCurrentScreen({
          screen: 'AdventuresMy',
        }),
      );
    }, [dispatch]),
  );

  return (
    <View style={styles.AdventuresScreen}>
      <NotificationBanner />
      <ScrollView
        style={styles.AdventuresList}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <View style={styles.AdventureActions}>
          <Touchable
            style={styles.haveCode}
            onPress={(): void => navigation.navigate('AdventureCode')}
            testID="ctaHaveCode"
          >
            <Text style={styles.haveCodeLabel}>
              {t('adventureCode:adventureCodeHaveCode')}
            </Text>
          </Touchable>
        </View>
        {invitationsIds.length > 0 && (
          <>
            <Text style={styles.Heading}>{t('invitations')}</Text>
            {invitationsIds.map(value =>
              value ? <AdventureInvite inviteID={value} key={value} /> : <></>,
            )}
          </>
        )}
        {myAdventuresIds.length > 0 && (
          <>
            <Text style={styles.Heading}>{t('adventures')}</Text>
            {myAdventuresIds.map((advId: string | null) =>
              advId ? <AdventureCard adventureId={advId} /> : null,
            )}
          </>
        )}
        <View style={{ height: 180 }} />
      </ScrollView>
    </View>
  );
};

export default AdventuresMy;
