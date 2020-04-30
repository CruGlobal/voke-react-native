/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Image from '../Image';
import st from '../../st';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import DateComponent from '../DateComponent';
import AdventureStepMessageInput from '../AdventureStepMessageInput';
import { getCurrentUserId } from '../../utils/get';
import { TAdventureSingle, TAdventureStepSingle, TMessage } from '../../types';

type MessageProps = {
  item: TMessage;
  step: TAdventureStepSingle;
  adventure: TAdventureSingle;
}

function AdventureStepMessage({
  item,
  step,
  adventure,
}: MessageProps): React.ReactElement | null {
  const isAndroid = Platform.OS === 'android';
  const userId = getCurrentUserId();
  const message = {
    content: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    messenger_id: '', // id of the user who left the message.
    metadata: {
      vokebot_action: '',
      messenger_answer: '',
      step_kind: '',
      answers: [],
    },
    ...item,
  };

  const isMyMessage = message.messenger_id === userId;
  if (isMyMessage && adventure.kind === 'solo') return null;
  const isSharedAnswer = message.metadata.vokebot_action === 'share_answers';
  // User who left the message.
  const messenger =
    adventure.conversation.messengers.find(
      i => i.id === message.messenger_id,
    ) || {};

  // Blur other answers until step completed.
  const isBlured =
    !isMyMessage && // If this is not my message.
    step.status !== 'completed' && // If current step not yet completed.
    !message.metadata.messenger_journey_step_id; // If I didn't left the message.

  const msgKind = message.metadata.step_kind;
  const selectedAnswer = (
    ((message.metadata || {}).answers || []).find(i => i.selected) || {}
  ).value;

  // SPECIAL MESSAGE: QUESTION / MULTI / BINARY / SHARE
  if (['binary', 'multi', 'question', 'share'].includes(msgKind)) {
    return (
      <Flex direction="column" style={[st.mt4]}>
        {msgKind === 'multi' || msgKind === 'question' ? (
          /* MESSAGE QUESTION AREA: */
          <Flex
            direction="column"
            style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
            align="center"
            justify="center"
          >
            <Text style={[st.tac, st.white, st.fs(20), st.lh(24)]}>
              {(message.metadata || {}).question || null}
            </Text>
          </Flex>
        ) : null}
        {/* <Image
          source={{ uri: (messenger.avatar || {}).small }}
          style={[st.absb, st.right(-30), st.h(25), st.w(25), st.br1]}
        /> */}

        {/* MESSAGE INPUT FIELD: */}
        <AdventureStepMessageInput
          kind={msgKind}
          adventure={adventure}
          step={step}
          internalMessage={message}
          defaultValue={selectedAnswer}
        />
      </Flex>
    );
  }
  // REGULAR MESSAGE: TEXT
  return (
    <Flex align="center" style={[st.fw100]}>
      <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
        <Flex direction="row">
          {isMyMessage ? <Flex style={[st.f1]} /> : null}
          <Flex
            direction="column"
            style={[isMyMessage ? st.bgWhite : st.bgDarkBlue, st.br5, st.pd6, st.w100]}
          >
            {isSharedAnswer ? (
              <Flex style={[st.bgOffBlue, st.pd5, st.br6]}>
                <Text style={[st.fs4, st.white]}>{message.content}</Text>
              </Flex>
            ) : null}
            <Text style={[st.pd6, st.fs4, isMyMessage ? st.blue : st.white]}>
              {isSharedAnswer ? message.messenger_answer : message.content}
            </Text>
          </Flex>
          {!isMyMessage ? <Flex style={[st.f1]} /> : null}
        </Flex>
        {isBlured ? (
          <Flex style={[st.absfill, st.br5]} align="center" justify="center">
            {/* Blur stuff doesn't work on android */}
            {isAndroid ? null : (
              <>
                <BlurView
                  blurType="light"
                  blurAmount={2}
                  style={[st.absfill, st.br5]}
                />
                <Flex
                  style={[
                    st.absfill,
                    st.br5,
                    { backgroundColor: 'rgba(0,0,0,0.3)' },
                  ]}
                />
                <VokeIcon
                  type="image"
                  name="lock"
                  style={[st.h(30), st.w(30)]}
                />
              </>
            )}
            {/* {<VokeIcon type="image" name="camera" style={[st.h(30), st.w(30)]} />} */}
          </Flex>
        ) : null}
        <Image
          source={{ uri: (messenger.avatar || {}).small }}
          style={[
            st.absb,
            isMyMessage ? st.right(-30) : st.left(-30),
            st.h(25),
            st.w(25),
            st.br1,
          ]}
        />
      </Flex>
      <Flex
        direction="row"
        align="center"
        justify={isMyMessage ? 'end' : 'start'}
        style={[st.w80]}
      >
        {isMyMessage ? null : (
          <Text style={[st.white]}>
            {`${messenger.first_name} ${messenger.last_name} • `}
          </Text>
        )}
        <DateComponent
          style={[st.fs6, st.white, isMyMessage ? st.tar : null]}
          date={message.created_at}
          format="MMM D @ h:mm A"
        />
      </Flex>
    </Flex>
  );
}

export default AdventureStepMessage;
