/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  getCurrentUserId,
  getNextReleaseDate,
  getDiffToDate,
  getTimeToDate,
} from 'utils/get';
import theme from 'utils/theme';
import st from 'utils/st';
import { TAdventureSingle, TDataState, TError, TStep } from 'utils/types';
import analytics from '@react-native-firebase/analytics';
import { Pressable, View } from 'react-native';
import Button from 'components/Button';
import { getAdventureSteps, unlockNextAdventureStep } from 'actions/requests';
import Communications from 'react-native-communications';
import CONSTANTS from 'utils/constants';

import { RootState, useDispatchTs } from '../../reducers';
import Image from '../Image';
import Touchable from '../Touchable';
import Flex from '../Flex';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Spacer from '../Spacer';

import styles from './styles';

type StepProps = {
  status: string;
  unread_messages: number;
  'completed_by_messenger?': boolean;
};

type AdventureStepCardProps = {
  stepId: string;
  adventureId: string;
  nextStepRef: any;
};

// Renders Cards on this screen https://d.pr/i/WsCCf2
function AdventureStepCard({
  stepId,
  adventureId,
  nextStepRef,
}: AdventureStepCardProps): React.ReactElement {
  const { t } = useTranslation('journey');
  const dispatch = useDispatchTs();
  const navigation = useNavigation();
  const userId = getCurrentUserId();
  const adventure: TAdventureSingle = useSelector(
    ({ data }: RootState) =>
      data.myAdventures?.byId[
        adventureId as keyof TDataState['myAdventures']['byId']
      ] || {},
  );
  const step: TStep = useSelector(
    ({ data }: RootState) =>
      data.adventureSteps[adventureId]?.byId[
        stepId as keyof TDataState['adventureSteps'][typeof adventureId]['byId']
      ] || {},
  );

  const [isActive, setIsActive] = useState(step?.status === 'active');
  const [isCompleted, setIsCompleted] = useState(step?.status === 'completed');
  const [isWaiting, setIsWaiting] = useState(
    isActive && step['completed_by_messenger?'],
  );
  // const [isLocked, setIsLocked] = useState(!isCompleted && !isActive);
  const [isLocked, setIsLocked] = useState(true);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const messengers = (adventure?.conversation || {}).messengers || [];
  const thumbnail = step?.item?.content?.thumbnails?.medium || '';
  // TODO: adventure can be undefined.
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';
  const isGroup = adventure.kind === 'multiple';

  const inviteName = adventure?.journey_invite?.name;
  let invitedUserName = '';

  const otherUser = messengers.find(
    i => i.id !== userId && i.first_name !== 'VokeBot',
  );

  const allMessengers = adventure?.conversation?.messengers || [];
  const isLeader =
    allMessengers.find(m => m.group_leader && m.id === userId) || false;

  if (otherUser && otherUser.first_name) {
    invitedUserName = otherUser.first_name;
  } else if (inviteName) {
    invitedUserName = inviteName;
  }

  const nextReleaseDate = adventure.gating_period
    ? getNextReleaseDate({
        startDate: adventure.gating_start_at,
        releasePeriod: adventure.gating_period,
      })
    : null;

  const nextReleaseIn = nextReleaseDate ? getDiffToDate(nextReleaseDate) : null;
  const nextReleaseTime = nextReleaseDate
    ? getTimeToDate(nextReleaseDate)
    : null;

  const printNextReleaseDate = ({
    releaseDate,
    releaseIn,
    releaseTime,
  }: {
    releaseDate: string | null;
    releaseIn: string | null;
    releaseTime: string | null;
  }): string => {
    let result = '';
    if (releaseDate) {
      result = `${t('share:nextRelease')}: ${releaseTime}`;
    } else {
      result = t('share:leaderWillRelease');
    }

    return result;
  };

  // Monitor any changes in steps and step parammeters of the component
  // to update the card elements accordingly.
  // For example we need to update unread count on the card when state changed.
  useEffect(() => {
    setIsActive(step.status === 'active');
    setIsCompleted(step.status === 'completed');
    setIsWaiting(step.status === 'active' && step['completed_by_messenger?']);

    if (isGroup) {
      setIsLocked(step.locked);
    } else {
      setIsLocked(step.status !== 'completed' && step.status !== 'active');
    }

    if (isGroup) {
      if (step?.locked && !nextStepRef.current) {
        setIsNext(true);
        nextStepRef.current = step.position;
      } else if (step?.locked && nextStepRef.current === step.position) {
        setIsNext(true);
      } else if (!step?.locked && nextStepRef.current === step.position) {
        setIsNext(false);
        nextStepRef.current = null;
      } else {
        setIsNext(false);
      }
    }
    setIsUnlocking(false);
  }, [isGroup, nextStepRef, step, isLocked, step?.locked]);

  const verifyReleaseStatus = () => {
    setIsUnlocking(false);
    if (step?.locked) {
      dispatch(getAdventureSteps(adventureId));
    }
  };

  const unlockNextStep = async (advId: string): Promise<void> => {
    setIsUnlocking(true);
    const result = await dispatch(unlockNextAdventureStep(advId));
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html
    const positiveResult = result as TAdventureSingle;
    const negativeResult = result as TError;
    setTimeout(() => {
      // If no confirmation from server received in 3 seconds:
      // hide the loader indicator and refetch the adventure steps.
      verifyReleaseStatus();
    }, 3000);
    if (positiveResult.id) {
      nextStepRef.current = null;
    } else {
      // TODO: Extract this email report into a separate universal module.
      Alert.alert(
        'Failed to unlock the next step',
        'Please, check your internet connection and try again.',
        [
          {
            text: t('settings:email'),
            onPress: (): void => {
              Communications.email(
                ['support@vokeapp.com'], // TO
                null, // CC
                null, // BCC
                'Voke App Error: Failed to unlock the next step', // SUBJECT
                `I'm getting 'Failed to unlock the next step' error when clicking 'Release Now' button.
                 My adventure ID is: ${advId}
                 API Error: ${negativeResult.error}`, // BODY
              );
            },
          },
          {
            text: t('ok'),
            onPress: (): void => {
              // No action.
            },
          },
        ],
      );
    }
  };

  return (
    <Flex style={styles.stepWrapper}>
      {isGroup &&
      isLocked &&
      isNext &&
      adventure.organization_journey_id === CONSTANTS.ADV_EASTER &&
      isLeader ? (
        <View style={styles.nextStepLocked}>
          <Text style={styles.nextStepLockedText}>
            <VokeIcon name={'lock'} size={16} style={{ paddingRight: 30 }} />
            {'  '}
            {t('manageGroup:episodeLocked')}
          </Text>
          <Button
            size="s"
            radius="m"
            color="blank"
            isLoading={isUnlocking}
            style={{ paddingVertical: theme.spacing.s }}
            onPress={(): void => {
              unlockNextStep(adventureId);
            }}
          >
            {t('manageGroup:releaseNow')}
          </Button>
        </View>
      ) : (
        <></>
      )}
      <Touchable
        highlight={false}
        disabled={isLocked && (isSolo || !isLeader)}
        activeOpacity={0.8}
        onPress={(): void => {
          // Google Analytics: Record content selection.
          // https://rnfirebase.io/reference/analytics#logSelectItem
          analytics().logSelectItem({
            content_type: 'Adventure Step',
            item_list_id: adventure.organization_journey_id,
            item_list_name: adventure.name,
            items: [
              {
                item_variant: 'Step - ' + step.position,
                item_name: step.name,
                item_category: 'Adventure',
                item_category2: adventure.kind,
                item_category3: adventure?.language?.name,
              },
            ],
          });

          navigation.navigate('AdventureStepScreen', {
            stepId: step.id,
            adventureId: adventure.id,
          });
        }}
        style={styles.stepCard}
        testID={step?.position ? 'stepPart-' + step.position : ''}
      >
        <Flex
          style={{
            backgroundColor: isActive
              ? theme.colors.white
              : theme.colors.secondaryAlt,
            opacity: !isActive && isLocked && !isNext ? 0.6 : undefined,
          }}
          align="center"
          justify="start"
        >
          {/* {isGroup && isLocked && isActive && ( */}
          {isGroup &&
            isLocked &&
            isNext &&
            adventure.organization_journey_id !== CONSTANTS.ADV_EASTER && (
              <Flex
                align="center"
                style={styles.nextReleaseBlock}
                testID="nextRelease"
              >
                <Text style={styles.nextReleaseText}>
                  {printNextReleaseDate({
                    releaseDate: nextReleaseDate,
                    releaseIn: nextReleaseIn,
                    releaseTime: nextReleaseTime,
                  })}
                </Text>
              </Flex>
            )}
          <Flex direction="row" style={styles.cardContent}>
            <Flex style={styles.thumbContainer}>
              <Image
                // source={thumbnail}
                source={{ uri: thumbnail }}
                style={styles.thumb}
                resizeMode="cover"
              />
              <VokeIcon
                name={isLocked ? 'lock' : 'play-full'}
                size={30}
                style={styles.thumbIcon}
                testID={isLocked ? 'stepLocked' : 'stepAvailable'}
              />
            </Flex>
            <Flex
              value={1}
              direction="column"
              self="start"
              style={styles.content}
            >
              <Text
                numberOfLines={2}
                style={isActive ? styles.titleActive : styles.titleInactive}
              >
                {step.name}
              </Text>
              <Text style={isActive ? styles.partActive : styles.partInactive}>
                {t('part')} {step.position}
              </Text>
              {/* {isActive || isCompleted ? ( */}
              {/* UNREAD COUNTER */}
              <Spacer size="s" />
              {step.unread_messages && !isSolo ? (
                <Flex
                  direction="row"
                  align="center"
                  // justify="left"
                  self="start"
                  style={styles.unreadBubble}
                >
                  <VokeIcon
                    name="speech-bubble-full"
                    style={styles.iconUnread}
                    size={14}
                  />
                  <Text style={[st.white, { fontWeight: 'bold' }]}>
                    {step.unread_messages > 99 ? '99' : step.unread_messages}
                  </Text>
                </Flex>
              ) : null}
              {/* <Flex direction="row" align="center" style={[st.pt6]}>
                <VokeIcon
                  name="speech-bubble-full"
                  style={[
                    step.unread_messages && !isSolo ? st.orange : isCompleted ? st.white : st.charcoal,
                  ]}
                />
                {step.unread_messages && !isSolo ? (
                  <Flex
                    align="center"
                    justify="center"
                    style={[st.circle(20), st.bgOrange, st.ml6]}
                  >
                    <Text style={[st.white]}>
                      {step.unread_messages > 99 ? '99' : step.unread_messages}
                    </Text>
                  </Flex>
                ) : null}
              </Flex> */}
            </Flex>
            <Flex style={styles.stepNumberContainer}>
              <Text
                style={[isWaiting ? st.orange : st.blue, styles.stepNumber]}
              >
                {step.position}
              </Text>
            </Flex>
          </Flex>
          {isWaiting && messengers.length > 2 ? (
            <Flex align="center" style={styles.waitingBlock}>
              {
                <Text style={styles.waitingText}>
                  {t('waitingForAnswer', { name: invitedUserName })}
                </Text>
              }
            </Flex>
          ) : null}
        </Flex>
      </Touchable>
      {isCompleted ? (
        <Flex style={styles.completedBlock}>
          <VokeIcon
            name="checkmark-outline"
            size={12}
            style={styles.iconCompleted}
          />
        </Flex>
      ) : null}
    </Flex>
  );
}

export default AdventureStepCard;
