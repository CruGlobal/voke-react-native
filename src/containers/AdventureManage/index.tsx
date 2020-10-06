import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSafeArea, SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import AdventureStepReportCard from '../../components/AdventureStepReportCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import { TDataState } from '../../types';
import Touchable from '../../components/Touchable';

import ManageMembers from './ManageMembers';
import ReportedMessages from './ReportedMessages';
import styles from './styles';

type AdventureManageProps = {
  navigation: any;
  route: {
    name: string;
    params: {
      adventureId: string;
    };
  };
};

function AdventureManage({
  navigation,
  route,
}: AdventureManageProps): React.ReactElement {
  const { t } = useTranslation('manageGroup');
  const insets = useSafeArea();
  const store = useStore();
  const me = useSelector(({ auth }) => auth.user);
  const allMessages = store.getState().data.adventureStepMessages;
  const { adventureId } = route.params;
  const adventure = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId] || {},
  );
  const steps = useSelector(
    ({ data }: { data: TDataState }) => data.adventureSteps[adventureId],
    shallowEqual,
  ) || { byId: [], allIds: [] };

  const messengers = adventure?.conversation?.messengers || [];

  const gatingStartAt = adventure?.gating_start_at;
  const gatingPeriod = adventure?.gating_period;
  const gatingType = gatingPeriod => {
    if (gatingPeriod === 7) {
      return 'weekly';
    } else if (gatingPeriod === 1) {
      return 'daily';
    } else {
      return 'manual';
    }
  };
  const gatingStart = adventure?.gating_start_at;
  const inviteCode = adventure?.journey_invite?.code;
  const inviteId = adventure?.journey_invite?.id;
  const inviteItem = useSelector(
    ({ data }) => data.adventureInvitations.byId[inviteId],
  );

  return (
    <ScrollView style={styles.screen}>
      <SafeAreaView>
        <Flex style={styles.header} align="center" justify="center">
          <Text style={styles.title}>{adventure?.journey_invite?.name}</Text>
          <Text style={styles.invite}>
            {t('inviteCode')}:{' '}
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </Text>
        </Flex>
        <View style={styles.releaseSchedule}>
          <Text style={styles.releaseScheduleText}>
            {t('share:contentUnlockSchedule') +
              ' ' +
              (gatingPeriod
                ? t(gatingPeriod === 7 ? 'share:everyWeek' : 'share:everyDayAt')
                : t('share:manually')) +
              ' '}
            {gatingPeriod && (
              <Text
                onPress={() =>
                  navigation.navigate('GroupReleaseType', {
                    groupName: adventure?.journey_invite?.name,
                    itemId: adventure.organization_journey_id,
                    releaseSchedule: gatingType(gatingPeriod),
                    releaseDate: gatingStartAt,
                    editing: true,
                    adventureId: adventure?.id,
                  })
                }
                style={styles.manageMembers}
              >
                {moment(gatingStart).format(
                  gatingPeriod === 7 ? 'dddd, LT' : 'LT',
                )}
              </Text>
            )}
          </Text>
        </View>
        <ManageMembers messengers={messengers} me={me} />
        <Flex
          direction="column"
          justify="between"
          style={styles.stepsContainer}
        >
          <Text style={styles.sectionTitle}>{t('journeyStatus')}</Text>
          <FlatList
            data={steps.allIds}
            renderItem={({ item }): React.ReactElement =>
              item && (
                <AdventureStepReportCard
                  stepId={item}
                  adventureId={adventureId}
                />
              )
            }
          />
        </Flex>
        <ReportedMessages />

        <View style={styles.footer}>
          <Touchable>
            <Text style={styles.groupDelete}>{t('deleteGroup')}</Text>
          </Touchable>
          <Text style={styles.startedDate}>
            Started on: {new Date(adventure.created_at).toDateString()}
          </Text>
        </View>

        <Flex value={1} style={{ paddingBottom: insets.bottom }} />
      </SafeAreaView>
    </ScrollView>
  );
}

export default AdventureManage;
