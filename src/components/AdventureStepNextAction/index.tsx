import React from 'react';
// import moment from 'moment';
import { RootState } from '../../reducers';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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
        <Text style={[st.aic, st.mb4, st.ph3, st.tac, st.white, {fontSize:20}]}>
          Congrats! You finished the Adventure. Now start it with someone else!
        </Text>
        <Button
    isAndroidOpacity={true}
    style={[
      st.pd4,
      st.br1,
      st.bgWhite,
      st.mb4,
      st.w(st.fullWidth - 80),
    {shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 2,
    shadowRadius: 3 ,
    shadowOffset : { width: 1, height: 5}}] }
    onPress={ () =>
      navigation.navigate('AdventureName', {
        item: {
          id: adventure.organization_journey_id
        },
        withGroup: false,
      })}
  >
    <Flex direction="row" align="center" justify="center">
    <VokeIcon
                name='couple'
                size={26}
                style={[st.darkBlue,{paddingRight:10}]} />
  <Text style={[st.darkBlue, st.fs20]}>With a Friend</Text>
    </Flex>
  </Button>
  <Button
    isAndroidOpacity={true}
    style={[
      st.pd4,
      st.br1,
      st.bgWhite,
      st.mb3,
      st.w(st.fullWidth - 80),
    {shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 0.5,
    elevation: 2,
    shadowRadius: 3 ,
    shadowOffset : { width: 1, height: 5}}] }
    onPress={ () =>
      navigation.navigate('AdventureName', {
        item: {
          id: adventure.organization_journey_id
        },
        withGroup: true,
      })}
  >
    <Flex direction="row" align="center" justify="center">
    <VokeIcon
                name='group'
                size={36}
                style={[st.darkBlue,{paddingRight:10}]} />
  <Text style={[st.darkBlue, st.fs20]}>With a Group</Text>
    </Flex>
  </Button>
      </Flex>
    );
  }

  let text = 'Next Video is Ready';
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

    text = `Waiting for ${userName} to answer...`;
    buttonActive = false;
  }

  // this.props.scrollToEnd();

  return (
    <Flex style={styles.NextActionContainer}>
      <Button
        onPress={(): void => navigation.goBack()}
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
