import React from 'react';

// import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import {
  getAdventureById,
  getCurrentUserId,
  getNextReleaseDate,
  getDiffToDate,
  getTimeToDate,
} from 'utils/get';
import st from 'utils/st';

import { RootState } from '../../reducers';
import Text from '../Text';
import OldButton from '../OldButton';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';

import styles from './styles';

type NextActionProps = {
  stepId: string;
  adventureId: string;
};

const AdventureStepNextAction = ({
  stepId,
  adventureId,
}: NextActionProps): React.ReactElement | null => {
  const navigation = useNavigation();
  const { t } = useTranslation('journey');
  const userId = getCurrentUserId();
  const adventure = getAdventureById(adventureId);
  const steps = useSelector(
    ({ data }: RootState) => data.adventureSteps[adventureId]?.byId,
  );
  const stepsIds = useSelector(
    ({ data }: RootState) => data.adventureSteps[adventureId]?.allIds,
  );

  const step = steps ? steps[stepId] : null;
  if (!step) return null;
  const nextStep = steps
    ? steps[stepsIds[stepsIds.findIndex(el => el === stepId) + 1]]
    : null;
  const nextStepLocked = nextStep?.locked;
  const isComplete = step?.status === 'completed';
  const isWaiting =
    step?.status === 'active' && step['completed_by_messenger?'];
  const isGroup = adventure.kind === 'multiple';

  const scheduledRelease = !(
    adventure?.gating_period === null && adventure?.gating_start_at === null
  );
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
    nextReleaseDate,
    nextReleaseIn,
    nextReleaseTime,
  }) => {
    let result = '';
    if (nextReleaseDate) {
      result = `${t('share:nextRelease')} ${nextReleaseIn} ${t(
        'at',
      )}\u00A0${nextReleaseTime}`;
    } else {
      result = t('share:leaderWillRelease');
    }

    return result;
  };

  // Too early to show something.
  // Current user didn't touch this step and no one commented.
  if (!isComplete && !isWaiting) {
    return null;
  }

  // If this is the last step and it's complete.
  if ((stepsIds[stepsIds.length - 1] || {}) === step.id) {
    // return null;
    /* TODO: Return this COMPLETE message; */
    // this.props.scrollToEnd();

    return (
      <Flex
        direction="column"
        justify="end"
        align="center"
        style={[st.bgBlue, st.ph5, st.pt2]}
      >
        <Text
          style={[st.aic, st.fs2, st.mb4, st.ph1, st.tac, st.white]}
          testID="finishedAdventure"
        >
          {t('finishedJourney')}
        </Text>
        <OldButton
          onPress={() =>
            navigation.navigate('AdventureName', {
              item: {
                id: adventure.organization_journey_id,
              },
              withGroup: false,
            })
          }
          style={[
            st.pd4,
            st.br1,
            st.bgWhite,
            st.mb3,
            st.w(st.fullWidth - 50),
            {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOpacity: 0.5,
              elevation: 2,
              shadowRadius: 3,
              shadowOffset: { width: 1, height: 5 },
            },
          ]}
        >
          <Flex direction="row" align="center" justify="center">
            <VokeIcon name="couple" size={26} style={styles.iconAction} />
            <Text style={[st.darkBlue, st.fs20]}>{t('withFriend')}</Text>
          </Flex>
        </OldButton>
        <OldButton
          onPress={() =>
            navigation.navigate('AdventureName', {
              item: {
                id: adventure.organization_journey_id,
              },
              withGroup: true,
            })
          }
          style={[
            st.pd4,
            st.br1,
            st.bgWhite,
            st.mb3,
            st.w(st.fullWidth - 50),
            {
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              shadowOpacity: 0.5,
              elevation: 2,
              shadowRadius: 3,
              shadowOffset: { width: 1, height: 5 },
            },
          ]}
        >
          <Flex direction="row" align="center" justify="center">
            <VokeIcon name="group" size={32} style={styles.iconAction} />
            <Text style={[st.darkBlue, st.fs20]}>{t('withGroup')}</Text>
          </Flex>
        </OldButton>
      </Flex>
    );
  }

  let text = t('nextVideoReady');
  if (isWaiting) {
    const isSolo = adventure && adventure.kind !== 'duo';
    if (isSolo) {
      return null;
    }
    const otherUser = adventure.conversation.messengers.find(
      i => i.id !== userId && i.first_name !== 'VokeBot',
    );
    // TODO: Pass through invite name
    // if (journey.conversation.messengers.length === 2 && inviteName) {
    //   otherUser = { first_name: inviteName };
    // }
    const inviteName = adventure.journey_invite.name;
    let userName = '';
    if (otherUser && otherUser.first_name) {
      userName = otherUser.first_name;
    } else if (inviteName) {
      userName = inviteName;
    }

    text = t('waitingForAnswer', { name: userName });
  }

  if (isGroup && scheduledRelease && nextStepLocked) {
    // text = t('share:nextVideoRelease') + "\n " + nextReleaseIn;
    text = printNextReleaseDate({
      nextReleaseDate,
      nextReleaseIn,
      nextReleaseTime,
    });
  }

  return (
    <Flex style={styles.nextActionContainer}>
      <OldButton
        onPress={(): void => {
          // Get the index of the route to see if we can go back.
          const { index } = navigation.dangerouslyGetState();
          if (index > 0) {
            navigation.goBack();
          } else {
            navigation.navigate('AdventureActive', {
              adventureId: adventure.id,
            });
          }
        }}
        style={styles.nextActionButton}
        testID="ctaNextAction"
      >
        <Text style={styles.nextActionButtonLabel} testID="ctaNextActionText">
          {text}
        </Text>
      </OldButton>
    </Flex>
  );
};

export default AdventureStepNextAction;
