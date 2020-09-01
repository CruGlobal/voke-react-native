/* eslint-disable @typescript-eslint/camelcase */
import React, { useMemo, useState, useRef } from 'react';
import { Image as ReactNativeImage, Platform, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import Image from '../Image';
import theme from '../../theme';
import st from '../../st';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import bluredText from '../../assets/bluredText.png';
import DateComponent from '../DateComponent';
import AdventureStepMessageInput from '../AdventureStepMessageInput';
import { getCurrentUserId } from '../../utils/get';
import { TAdventureSingle, TAdventureStepSingle, TMessage } from '../../types';

import styles from './styles';

type MessageProps = {
  item: TMessage;
  step: TAdventureStepSingle;
  adventure: TAdventureSingle;
  previous: TMessage;
  next: TMessage;
};

function AdventureStepMessage({
  item,
  step,
  adventure,
  previous,
  next,
  onFocus
}: MessageProps): React.ReactElement | null {
  const [answerPosY, setAnswerPosY] = useState(0);
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
  // const myFirstMessage = reversed.find(m => m.messenger_id === me.id);
  if (isMyMessage && adventure.kind === 'solo') return null;
  const isSharedAnswer = message.metadata.vokebot_action === 'share_answers';
  // User who left the message.
  const messenger =
    adventure.conversation.messengers.find(
      i => i.id === message.messenger_id,
    ) || {};

  const messengerAvatar = useMemo(() => messenger?.avatar?.small, [
    messenger?.avatar?.small,
  ]);

  // Blur other answers until step completed.
  const isBlured =
    !isMyMessage && // If this is not my message.
    step.status !== 'completed' && // If current step not yet completed.
    !message.metadata.messenger_journey_step_id; // If I didn't left the message.

  const msgKind = message.metadata.step_kind;
  let selectedAnswer = (
    ((message.metadata || {}).answers || []).find(i => i.selected) || {}
  ).value;

  // If current message is a question box and next message is answer,
  // render next message here (https://d.pr/i/YHrv4N).
  if (
    msgKind === 'question' &&
    !selectedAnswer &&
    message?.metadata?.vokebot_action === 'journey_step' &&
    next?.content &&
    next?.direct_message
  ) {
    selectedAnswer = next?.content;
  }

  // Do not output answer to the previous question box
  // as it was already rendered above.
  if (
    // If the previous message is a question box type.
    (previous?.metadata?.step_kind === 'question' ||
      // ... or if the previous message is a share message box
      // with the current message shared.
      previous?.metadata?.messenger_answer === message?.content) &&
    message?.content &&
    message?.direct_message
  ) {
    return null;
  }

  // SPECIAL MESSAGE: QUESTION / MULTI / BINARY / SHARE
  if (['binary', 'multi', 'question', 'share'].includes(msgKind)) {
    return (
      <Flex
        style={styles.mainQuestionCard}
        onLayout={({ nativeEvent }) => {
          // Calculate vertical offset to be usef on answer field focus.
          const layout = nativeEvent?.layout;
          if (layout && layout?.y && layout?.height) {
            setAnswerPosY(layout.y);
          }
        }}
      >
        <Flex
          direction="column"
          style={styles.mainQuestionContainer}
          // style={[st.w80, st.mh1, st.mt4]}
        >
          {msgKind === 'multi' || msgKind === 'question' ? (
            /* MESSAGE QUESTION AREA: */
            <Flex
              direction="column"
              // style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
              style={styles.mainQuestion}
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
            onFocus={event => {
              onFocus(event);
            }}
          />
        </Flex>
      </Flex>
    );
  }
  // REGULAR MESSAGE: TEXT
  return (
    <>
      {!message.content && isMyMessage ? null : (
        <Flex align="between" style={styles.messageContainer}>
          <Flex direction="column" style={styles.messageContent}>
            <Flex direction="row">
              {isMyMessage ? <Flex style={[st.f1]} /> : null}
              <Flex
                style={{
                  width: isSharedAnswer ? '100%' : 'auto',
                  backgroundColor: isMyMessage
                    ? theme.colors.white
                    : theme.colors.secondary,
                  borderRadius: 8,
                  overflow: 'hidden', // Need this to hide overflow blur effect.
                }}
              >
                <Flex direction="column">
                  {isSharedAnswer ? (
                    <Flex style={styles.messageSharedContent}>
                      <Text style={[st.fs4, st.white]}>{message.content}</Text>
                    </Flex>
                  ) : null}
                  <Text
                    style={{
                      color:
                        isBlured && isAndroid
                          ? 'rgba(0,0,0,0)'
                          : isMyMessage
                          ? '#44c8e8'
                          : '#fff',
                      opacity: message.content ? 1 : 0.5,
                      paddingHorizontal: theme.spacing.m,
                      paddingVertical: theme.spacing.s,
                      fontSize: theme.fontSizes.l,
                    }}
                  >
                    {isSharedAnswer
                      ? message.metadata.messenger_answer
                      : message.content
                      ? message.content
                      : 'Skipped'}
                  </Text>
                </Flex>
                {!isMyMessage ? <Flex style={[st.f1]} /> : null}

                {isBlured ? (
                  <Flex align="center" justify="center" style={[st.absfill]}>
                    <>
                      {isAndroid && (
                        <ReactNativeImage
                          source={bluredText}
                          resizeMode={'cover'}
                          resizeMethod={'resize'}
                          style={{
                            width: 300,
                            height: 140,
                            position: 'absolute',
                            left: 5,
                            top: 6,
                          }}
                        />
                      )}
                      {!isAndroid && (
                        <BlurView
                          blurType="light"
                          blurAmount={2}
                          style={[st.absfill]}
                        />
                      )}
                      <Flex
                        style={[
                          st.absfill,
                          { backgroundColor: 'rgba(0,0,0,.2)' },
                        ]}
                      />
                      <VokeIcon name="lock" size={16} style={styles.icon} />
                    </>
                  </Flex>
                ) : null}
              </Flex>
              {/* User Avatar */}
              <Image
                uri={messengerAvatar}
                style={isMyMessage ? styles.myAvatar : styles.userAvatar}
              />
            </Flex>
            {/* Message Footer: Name + Date */}
            <Flex
              direction="row"
              align="center"
              justify={isMyMessage ? 'end' : 'start'}
              style={styles.messageMeta}
            >
              {isMyMessage ? null : (
                <Text style={[st.white]}>
                  {messenger.first_name ? messenger.first_name + ' ' : ''}
                  {messenger.last_name ? messenger.last_name + ' ' : ''}
                  {`• `}
                </Text>
              )}
              <DateComponent
                style={[st.fs6, st.white, isMyMessage ? st.tar : null]}
                date={message.created_at}
                format="MMM D @ h:mm A"
              />
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default AdventureStepMessage;
