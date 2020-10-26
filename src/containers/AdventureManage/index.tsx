import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useSafeArea, SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector, shallowEqual, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import {
  getMyAdventure,
  getAdventureSummary,
  getAdventureSteps,
} from '../../actions/requests';
import AdventureStepReportCard from '../../components/AdventureStepReportCard';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import { TDataState } from '../../types';
import Touchable from '../../components/Touchable';
import HeaderSpacer from '../../components/HeaderSpacer';

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
  const activeStepRef = useRef(0);
  const { t } = useTranslation('manageGroup');
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const store = useStore();
  const me = useSelector(({ auth }) => auth.user);
  const allMessages = store.getState().data.adventureStepMessages;
  const { adventureId } = route.params;

  const adventure = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[adventureId] || {},
  );

  console.log('🐸 adventure:', adventure);

  const stepsListIds =
    useSelector(
      ({ data }: { data: TDataState }) =>
        data.adventureSteps[adventureId]?.allIds,
    ) || {};

  console.log('🙊 adventure:', adventure);
  console.log('⛑ stepsListIds:', stepsListIds);

  useEffect(() => {
    if (adventureId && !stepsListIds.length) {
      dispatch(getAdventureSteps(adventureId));
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  }, [adventureId, stepsListIds.length, dispatch]);

  // const [steps, setSteps] = useState([]);

  // const updateSteps = async () => {
  //   const result = await dispatch(getAdventureSteps(adventureId));
  //   if (result?.steps.length) {
  //     // Pseudo-step for graduated users.
  //     result?.steps.push({
  //       id: 'graduated',
  //       active_messengers: [],
  //     });
  //     setSteps(result?.steps);
  //   }
  // };

  // useEffect(() => {
  //   if (adventureId) {
  //     updateSteps();
  //   }
  // }, [adventureId]);

  const messengers = adventure?.conversation?.messengers || [];

  const gatingStartAt = adventure?.gating_start_at;
  const gatingPeriod = adventure?.gating_period;

  const gatingType = gatingPeriod => {
    if (gatingPeriod === 7) {
      return 'weekly';
    } else if (gatingPeriod === 1) {
      return 'daily';
    } else if (gatingPeriod === 0) {
      return 'manual';
    }

    return '';
  };
  const gatingStart = adventure?.gating_start_at;
  const inviteCode = adventure?.journey_invite?.code;

  // Request steps from server if nothing stored locally.
  // useEffect(() => {
  //   if (!steps.allIds.length) {
  //     dispatch(getAdventureSteps(adventureId));
  //   }
  // }, [steps.allIds]);

  useEffect(() => {
    // Set title dynamically.
    navigation.setOptions({
      title: adventure?.journey_invite?.name || '',
    });
    // Pull latest udpates for this adventure from the server
    // on the first render.
    dispatch(getMyAdventure(adventureId));
  }, []);

  return (
    <ScrollView style={styles.screen}>
      <SafeAreaView>
        <HeaderSpacer />
        <Flex style={styles.header} align="center" justify="center">
          <Text style={styles.invite} testID="inviteCodeHeader">
            {t('inviteCode')}:{' '}
            <Text style={styles.inviteCode}>{inviteCode}</Text>
          </Text>
        </Flex>
        {gatingPeriod !== null && (
          <View style={styles.releaseSchedule}>
            <Text style={styles.releaseScheduleText}>
              {t('share:contentUnlockSchedule') +
                ' ' +
                (gatingPeriod
                  ? t(
                      gatingPeriod === 7
                        ? 'share:everyWeek'
                        : 'share:everyDayAt',
                    ) + ' '
                  : '')}
              {
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
                  {gatingPeriod === 0
                    ? t('share:manually')
                    : moment(gatingStart).format(
                        gatingPeriod === 7 ? 'dddd, LT' : 'LT',
                      )}
                </Text>
              }
            </Text>
          </View>
        )}
        <ManageMembers messengers={messengers} me={me} adventure={adventure} />
        <Flex
          direction="column"
          justify="between"
          style={styles.stepsContainer}
        >
          <Text style={styles.sectionTitle}>{t('journeyStatus')}</Text>
          <FlatList
            data={stepsListIds}
            renderItem={({ item }): React.ReactElement => {
              return (
                item && (
                  <AdventureStepReportCard
                    stepId={item}
                    adventureId={adventureId}
                    activeStepRef={activeStepRef}
                  />
                )
              );
            }}
          />
          <AdventureStepReportCard
            stepId="graduated"
            adventureId={adventureId}
            activeStepRef={activeStepRef}
          />
        </Flex>
        <ReportedMessages adventureId={adventureId} />
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
