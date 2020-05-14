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
// import VokeIcon from '../VokeIcon';
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
        style={[st.bgBlue, st.ph2, st.pt2]}
      >
        <Text style={[st.aic, st.fs4, st.mb4, st.ph1, st.tac]}>
          Congrats! You finished the adventure. Now start it with someone else!
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
            st.bgOrange,
            st.ph6,
            st.pv5,
            st.bw0,
            st.br3,
            st.aic,
            { width: st.fullWidth - 60 },
          ]}
        >
          <Flex direction="row" align="center">
            <VokeIcon
              type="image"
              style={[{ height: 20 }, st.mr5]}
              name={'withFriend'}
            />
            <Text>With a Friend</Text>
            <VokeIcon
              type="image"
              style={[{ height: 15 }, st.ml5]}
              name={'buttonArrow'}
            />
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
            st.bgOrange,
            st.ph6,
            st.pv5,
            st.bw0,
            st.br3,
            st.mv4,
            st.aic,
            { width: st.fullWidth - 60 },
          ]}
        >
          <Flex direction="row" align="center">
            <VokeIcon
              type="image"
              style={[{ height: 20 }, st.mr5]}
              name={'withGroup'}
            />
            <Text>With a Group</Text>
            <VokeIcon
              type="image"
              style={[{ height: 15 }, st.ml5]}
              name={'buttonArrow'}
            />
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

    text = `Waiting for ${userName} to answer`;
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
