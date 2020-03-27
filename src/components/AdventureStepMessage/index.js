import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import moment from 'moment';
import { BlurView } from '@react-native-community/blur';

import Image from '../Image';
import st from '../../st';
import Touchable from '../Touchable';
import Text from '../Text';
import Button from '../Button';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import { useSelector, useDispatch } from 'react-redux';
import { useMount, momentUtc, useInterval } from '../../utils';
import { getMyAdventures } from '../../actions/requests';
import { useNavigation } from '@react-navigation/native';
import DateComponent from '../DateComponent';
import AdventureStepMessageInput from '../AdventureStepMessageInput';

function AdventureStepMessage({ item, step, adventure }) {
  const me = useSelector(({ auth }) => auth.user);
  const message = {
    content: '',
    conversation: {},
    progress: {},
    item: { content: { thumbnails: { small: '' } } },
    messenger_id: '',
    metadata: {
      vokebot_action: '',
      messenger_answer: '',
      step_kind: '',
      answers: [],
    },
    ...item,
  };
  const isAdventureStepComplete = step.status === 'completed';

  const isSolo = step.kind !== 'duo' && step.kind !== 'group';
  const isMe = message.messenger_id === me.id;
  if (isSolo && isMe) return null;
  const isSharedAnswer = message.metadata.vokebot_action === 'share_answers';
  const messenger =
    adventure.conversation.messengers.find(
      i => i.id === message.messenger_id,
    ) || {};

  const isBlured =
    !message.metadata.messenger_journey_step_id &&
    !isAdventureStepComplete &&
    !isMe;

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const msgKind = message.metadata.step_kind;
  const selectedAnswer = (
    ((message.metadata || {}).answers || []).find(i => i.selected) || {}
  ).value;

  if (['binary', 'multi', 'question', 'share'].includes(msgKind)) {
    return (
      <Flex direction="column" style={[st.mt4]}>
        {msgKind === 'multi' || msgKind === 'question' ? (
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

  return (
    <Flex align="center" style={[st.fw100]}>
      <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
        <Flex direction="row">
          {isMe ? <Flex style={[st.f1]} /> : null}
          <Flex
            direction="column"
            style={[isMe ? st.bgWhite : st.bgDarkBlue, st.br5, st.pd6, st.w100]}
          >
            {isSharedAnswer ? (
              <Flex style={[st.bgOffBlue, st.pd5, st.br6]}>
                <Text style={[st.fs4, st.white]}>{message.content}</Text>
              </Flex>
            ) : null}
            <Text style={[st.pd6, st.fs4, isMe ? st.blue : st.white]}>
              {isSharedAnswer ? message.messenger_answer : message.content}
            </Text>
          </Flex>
          {!isMe ? <Flex style={[st.f1]} /> : null}
        </Flex>
        {isBlured ? (
          <Flex style={[st.absfill, st.br5]} align="center" justify="center">
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
            <VokeIcon type="image" name="camera" style={[st.h(30), st.w(30)]} />
          </Flex>
        ) : null}
        <Image
          source={{ uri: (messenger.avatar || {}).small }}
          style={[
            st.absb,
            isMe ? st.right(-30) : st.left(-30),
            st.h(25),
            st.w(25),
            st.br1,
          ]}
        />
      </Flex>
      <Flex
        direction="row"
        align="center"
        justify={isMe ? 'end' : 'start'}
        style={[st.w80]}
      >
        {isMe ? null : (
          <Text style={[st.white]}>
            {messenger.first_name} {messenger.last_name}
            {` • `}
          </Text>
        )}
        <DateComponent
          style={[st.fs6, st.white, isMe ? st.tar : null]}
          date={message.created_at}
          format={'MMM D @ h:mm A'}
        />
      </Flex>
    </Flex>
  );
}

export default AdventureStepMessage;
