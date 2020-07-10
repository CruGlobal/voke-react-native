import React from 'react';
// import moment from 'moment';
import { RootState } from '../../reducers';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from "react-i18next";
import { TAdventureStepSingle } from '../../types';
import styles from './styles';
import Text from '../Text';
import Button from '../Button';
import st from '../../st';
import VokeIcon from '../../components/VokeIcon';
import Flex from '../Flex';
import {
  getStepsByAdventureId,
  getAdventureById,
  getCurrentUserId,
} from '../../utils/get';

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
  const steps = useSelector(({ data }: RootState) => data.adventureSteps[adventureId].byId);
  const stepsIds = useSelector(({ data }: RootState) => data.adventureSteps[adventureId].allIds);
  const step = steps[stepId];
  if (!step) return null;
  const isComplete = step.status === 'completed';
  const isWaiting = step.status === 'active' && step['completed_by_messenger?'];

  // Too early to show something.
  // Current user didn't touch this step and no one commented.
  if (!isComplete && !isWaiting) {
    return null;
  }

  // If this is the last step and it's complete, don't show this.
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
        <Text style={[st.aic, st.fs2, st.mb4, st.ph1, st.tac, st.white]}>
          {t('finishedJourney')}
        </Text>
        <Button
          onPress={ () =>
            navigation.navigate('AdventureName', {
              item: {
                id: adventure.organization_journey_id
              },
              withGroup: false,
            })}
            style={[
              st.pd4,
              st.br1,
              st.bgWhite,
              st.mb3,
              st.w(st.fullWidth - 50),
            {shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 2,
            shadowRadius: 3 ,
            shadowOffset : { width: 1, height: 5}}] }
        >
          <Flex direction="row" align="center" justify="center">
            <VokeIcon
                name='couple'
                size={26}
                style={[st.darkBlue, {paddingRight:10}]} />
            <Text style={[st.darkBlue, st.fs20]}>{t('withFriend')}</Text>
          </Flex>
        </Button>
        <Button
          onPress={ () =>
            navigation.navigate('AdventureName', {
              item: {
                id: adventure.organization_journey_id
              },
              withGroup: true,
            })}
            style={[
              st.pd4,
              st.br1,
              st.bgWhite,
              st.mb3,
              st.w(st.fullWidth - 50),
            {shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 2,
            shadowRadius: 3 ,
            shadowOffset : { width: 1, height: 5}}] }
        >
           <Flex direction="row" align="center" justify="center">
            <VokeIcon
                name='group'
                size={32}
                style={[st.darkBlue, {paddingRight:10}]} />
            <Text style={[st.darkBlue, st.fs20]}>{t('withGroup')}</Text>
          </Flex>
        </Button>
      </Flex>
    );
  }

  let text = t('nextVideoReady');
  let buttonActive = true;
  if (isWaiting) {
    const isSolo = adventure && adventure.kind !== 'duo';
    if (isSolo) {
      return null;
    }
    const otherUser = adventure.conversation.messengers.find(
      i => i.id !== userId && i.first_name !== 'VokeBot'
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

    text =  t('waitingForAnswer', {name: userName});
    buttonActive = false;
  }

  // this.props.scrollToEnd();

  return (
    <Flex style={styles.NextActionContainer}>
      <Button
        onPress={(): void => {
          // Get the index of the route to see if we can go back.
          let index = navigation.dangerouslyGetState().index;
          if (index > 0) {
            navigation.goBack()
          } else {
            navigation.navigate('AdventureActive', {
              adventureId: adventure.id,
            });
          }
        }}
        style={[
          styles.NextActionButton,
          buttonActive ? styles.ButtonActive : null,
        ]}
      >
        <Text style={styles.NextActionButtonLabel}>{text}</Text>
      </Button>
    </Flex>
  );
};

export default AdventureStepNextAction;
