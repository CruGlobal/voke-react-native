import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, FlatList, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { StackNavigationProp } from '@react-navigation/stack';
import AdventureStepReportCard from 'components/AdventureStepReportCard';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import HeaderSpacer from 'components/HeaderSpacer';
import { RootState } from 'reducers';
import {
  AdventureStackParamList,
  TAdventureSingle,
  TDataState,
  TUser,
} from 'utils/types';

import {
  getMyAdventure,
  getAdventureSteps,
  deleteAdventure,
  getMyAdventures,
} from '../../../actions/requests';

import ManageMembers from './ManageMembers';
import ReportedMessages from './ReportedMessages';
import styles from './styles';

type RootStackParamList = {
  AdventureMange: { adventureId: string };
  GroupReleaseType: {
    groupName: string;
    itemId: string;
    releaseSchedule: string;
    releaseDate: string;
    editing: boolean;
    adventureId: string;
  };
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

type AdventureManageProps = {
  navigation: StackNavigationProp<RootStackParamList, 'AdventureMange'>;
  route: {
    name: string;
    params: {
      adventureId: string;
    };
  };
};

const gatingType = (
  gatingPeriod: number,
): 'weekly' | 'daily' | 'manual' | '' => {
  if (gatingPeriod === 7) {
    return 'weekly';
  } else if (gatingPeriod === 1) {
    return 'daily';
  } else if (gatingPeriod === 0) {
    return 'manual';
  }

  return '';
};

type NavigationPropType = StackNavigationProp<
  AdventureStackParamList,
  'AdventureManage'
>;

type RoutePropType = RouteProp<AdventureStackParamList, 'AdventureManage'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

function AdventureManage({ navigation, route }: Props): React.ReactElement {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation('manageGroup');
  const dispatch = useDispatch();
  const me: TUser = useSelector(({ auth }: RootState) => auth.user);
  const { adventureId } = route.params;

  const adventure: TAdventureSingle = useSelector(
    ({ data }: { data: TDataState }) =>
      data.myAdventures?.byId[
        adventureId as keyof TDataState['myAdventures']['byId']
      ] || {},
  );

  const stepsListIds =
    useSelector(
      ({ data }: { data: TDataState }) =>
        data.adventureSteps[adventureId]?.allIds,
    ) || [];

  useEffect(() => {
    if (adventureId && !stepsListIds.length) {
      dispatch(getAdventureSteps(adventureId));
    }
    // -- ☝️call to update steps from the server.
    // Without it new Adventures won't show any steps.
  }, [adventureId, stepsListIds.length, dispatch]);

  const messengers = adventure?.conversation?.messengers || [];

  // Exist screen if user is not a group admin.
  useEffect(() => {
    messengers.some((user) => {
      if (user.id === me.id) {
        if (!user.group_leader) {
          navigation.navigate('AdventureActive', { adventureId });
        }
        return true; // Exit early.
      }
    });
  }, [adventureId, me, messengers, navigation]);

  const gatingStartAt = adventure?.gating_start_at;
  const gatingPeriod = adventure?.gating_period;
  const gatingStart = adventure?.gating_start_at;
  const inviteCode = adventure?.journey_invite?.code;

  // Request steps from server if nothing stored locally.
  // useEffect(() => {
  //   if (!steps.allIds.length) {
  //     dispatch(getAdventureSteps(adventureId));
  //   }
  // }, [steps.allIds]);

  const replacePrevScreen = useCallback((): void => {
    const { routes } = navigation.dangerouslyGetState();
    /**
     * When openning current screen from new group creation,
     * we replace history, so users "go back" > AdventureActive > Adventures.
     */
    if (routes[routes.length - 2]?.name !== 'AdventureActive') {
      // Replace history and set again to the current screen.
      return navigation.reset({
        routes: [
          { name: 'Adventures' },
          {
            name: 'AdventureActive',
            params: {
              adventureId: adventureId,
            },
          },
          routes[routes.length - 1], // The current screen.
        ],
        index: 2,
      });
    }
  }, [adventureId, navigation]);

  useEffect(() => {
    // Set title dynamically.
    navigation.setOptions({
      title: adventure?.journey_invite?.name || '',
    });
  }, [adventure, navigation]);

  useEffect(() => {
    // Check the navigator history.
    replacePrevScreen();
  }, [replacePrevScreen]);

  useFocusEffect(
    React.useCallback(() => {
      // When the screen is focused:
      // Pull latest udpates for this adventure from the server.
      dispatch(getMyAdventure(adventureId));
    }, [dispatch, adventureId]),
  );

  const onDeleteAdventure = (advId: string): void => {
    Alert.alert(t('journey:deleteTitle'), t('journey:unsubscribeBody'), [
      {
        text: t('cancel'),
        onPress: (): void => {
          // empty return.
        },
        style: 'cancel',
      },
      {
        text: t('delete'),
        onPress: async (): Promise<void> => {
          await dispatch(deleteAdventure(advId));
          dispatch(getMyAdventures());
          return navigation.reset({
            index: 0,
            type: 'stack', // Required to make dynamic nav bar to work properly.
            routes: [{ name: 'LoggedInApp' }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} scrollIndicatorInsets={{ right: 1 }}>
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
                  onPress={(): void =>
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
              return item ? (
                <AdventureStepReportCard
                  stepId={item}
                  adventureId={adventureId}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />
              ) : (
                <></>
              );
            }}
          />
          <AdventureStepReportCard
            stepId="graduated"
            adventureId={adventureId}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </Flex>
        <ReportedMessages adventureId={adventureId} />
        <View style={styles.footer}>
          <Touchable onPress={(): void => onDeleteAdventure(adventureId)}>
            <Text style={styles.groupDelete}>{t('deleteGroup')}</Text>
          </Touchable>
          <Text style={styles.startedDate}>
            Started on: {new Date(adventure.created_at).toDateString()}
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default AdventureManage;
