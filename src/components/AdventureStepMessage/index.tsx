import React, { useState, useEffect } from 'react';
import { Platform, View } from 'react-native';
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
/* 
  Item (Message):
    id: "40755071-d24a-4885-a0b7-8aea4a6ef61d"
    content: "Regret"
    position: 2
    messenger_id: "6895d320-01d6-4490-970e-d455ff67d37b"
    conversation_id: "a5187ef4-0dc0-4397-8830-b76db48d8c9f"
    messenger_journey_step_id: "70d244f7-0603-49bc-af58-10fb586dc27a"
    kind: "text"
    direct_message: true
    item: null
    adventure_message?: true
    metadata: {}
    created_at: "2020-04-21T03:24:08.329Z"

  Step (Episode):
    id: "70d244f7-0603-49bc-af58-10fb586dc27a"
    status: "active"
    name: "How did we get here? Part 2"
    question: "What is one thing that impacted you?"
    position: 2
    kind: "question"
    internal_step: false
    status_message: null
    unread_messages: 1
    completed_by_messenger?: true
    image: {small: "https://assets-stage.vokeapp.com/images/small/missing.png", medium: "https://assets-stage.vokeapp.com/images/medium/missing.png", large: "https://assets-stage.vokeapp.com/images/large/missing.png"}
    item: {id: "3c815dcc-2601-4e73-b4d8-13d6ddb10727", name: "Welcome to Voke!", media_start: null, media_end: null, content: {…}}
    journey: {id: "b1076e62-6a2f-4817-a893-301567187566", name: "The Faith Adventure", slogan: "How did we get here?", conversation: {…}}
    metadata: {messenger_journey_step_id: "70d244f7-0603-49bc-af58-10fb586dc27a", name: "How did we get here? Part 2", item_id: "3c815dcc-2601-4e73-b4d8-13d6ddb10727", question: "What is one thing that impacted you?", comment: "Great! I really liked how he said the question HOW always leads to the question of WHO. Answer 2.", …}
    created_at: "2020-04-21T02:40:09.684Z"
    updated_at: "2020-04-21T03:23:02.505Z"

  Adventure:
    code: ""
    conversation: {id: "a5187ef4-0dc0-4397-8830-b76db48d8c9f", messengers: Array(3), unread_messages: 3}
    progress: {total: 5, completed: 1, pending: 4}
    item: {id: "3c815dcc-2601-4e73-b4d8-13d6ddb10727", name: "Welcome to Voke!", media_start: null, media_end: null, content: {…}}
    name: "The Faith Adventure"
    id: "b1076e62-6a2f-4817-a893-301567187566"
    status: "active"
    kind: "duo"
    slogan: "How did we get here?"
    description: "Welcome to the Faith Challenge!"
    journey_invite: {id: "5a91afc7-bcf4-4ba1-b9a2-fe9adfbf30c0", name: "Bff", code: "469351"}
    organization_journey_id: "6c18c2fd-f918-4f6d-a936-ce40a0d7495c"
    organization: {id: "f8a3a688-3a6c-4f9b-a798-2c94e0fe375f", name: "Cru"}
    language: {id: "aceb3cb1-23c2-476c-a6df-f4d2ef4c948e", name: "English"}
    image: {small: "https://cru-vokeapi-stage.s3.amazonaws.com/platfor…neys/images/6c1/8c2/fd-/small/data.jpg?1555343010", medium: "https://cru-vokeapi-stage.s3.amazonaws.com/platfor…eys/images/6c1/8c2/fd-/medium/data.jpg?1555343010", large: "https://cru-vokeapi-stage.s3.amazonaws.com/platfor…neys/images/6c1/8c2/fd-/large/data.jpg?1555343010"}
    icon: {small: "https://assets-stage.vokeapp.com/images/platform/organization/journey/small/icon_default.png", medium: "https://assets-stage.vokeapp.com/images/platform/organization/journey/medium/icon_default.png", large: "https://assets-stage.vokeapp.com/images/platform/organization/journey/large/icon_default.png"}
    created_at: "2020-04-21T02:40:09.531Z"
    updated_at: "2020-04-21T03:24:08.376Z"

 */
  console.log( "📫 AdventureStepMessage:", item, step, adventure  );

  const isAndroid = Platform.OS === 'android';
  const me = useSelector(({ auth }) => auth.user);
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

  const isMe = message.messenger_id === me.id;
  if (isMe && adventure.kind === 'solo') return null;
  const isSharedAnswer = message.metadata.vokebot_action === 'share_answers';
  // User who left the message.
  const messenger =
    adventure.conversation.messengers.find(
      i => i.id === message.messenger_id,
    ) || {};
  // Blur other answers until step completed.
  const isBlured =
    !message.metadata.messenger_journey_step_id &&
    step.status !== 'completed' &&
    !isMe;

  const dispatch = useDispatch();
  const navigation = useNavigation();
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
              {(message.metadata || {}).question || null}!!!!
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
                <VokeIcon type="image" name="lock" style={[st.h(30), st.w(30)]} />
              </>
            )}
            {/* {<VokeIcon type="image" name="camera" style={[st.h(30), st.w(30)]} />} */}
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
