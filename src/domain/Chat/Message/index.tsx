import SpecialMessage from 'domain/Chat/SpecialMessage';
import TextMessage from 'domain/Chat/TextMessage';

import React, { useState } from 'react';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Alert } from 'react-native';
import { createReaction } from 'actions/requests';
import { setComplain, toastAction } from 'actions/info';
import { TMessage, TStep, TAdventureSingle, TMessenger } from 'utils/types';
import useCurrentUser from 'hooks/useCurrentUser';

interface Props {
  item: TMessage;
  step: TStep;
  adventure: TAdventureSingle;
  previous: TMessage | null;
  next: TMessage | null;
  onFocus: (answerPosY: number) => void;
}

const Message = (props: Props): React.ReactElement => {
  const { item, step, adventure, previous, next, onFocus } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isSharedAnswer = item?.metadata?.vokebot_action === 'share_answers';
  // Current User:
  const user = useCurrentUser();
  // Group Leader:
  const grLeader = adventure.conversation.messengers.find(i => i.group_leader);
  // Message author (user who left this message):
  const messengerId = item?.messenger_id;
  const messenger: TMessenger = adventure.conversation.messengers.find(
    msngr => msngr.id === messengerId,
  ) || {
    status: 'blocked',
    id: messengerId || '',
    first_name: '',
    last_name: '',
    avatar: {
      small: '',
      medium: '',
      large: '',
    },
  };

  // Message kind ('binary', 'multi', 'question', 'share', 'regular')
  const msgKind: TStep['kind'] = item?.metadata?.step_kind || 'regular';
  /* Blurred message. Other messages are hidden until the step is completed.
  1. Not current user's message.
  2. Current step not yet completed.
  3. I didn't left this message (shared). */
  const isBlured =
    messengerId !== user.id && // 1
    step.status !== 'completed' && // 2
    !item?.metadata?.messenger_journey_step_id; // 3
  /* Should we show 'Report' option for this message?
  1. Can't report themselves.
  2. Can't report the leader.
  3. Can't report blured messages.
  4. Group leader can't report anyone.
  5. Can't report in the Duo adventure. */
  const showMessageReporting =
    messengerId !== user.id && // 1
    messengerId !== grLeader?.id && // 2
    !isBlured && // 3
    user.id !== grLeader?.id && // 4
    adventure.kind !== 'duo'; // 5

  if (messengerId === user.id && adventure.kind === 'solo') {
    // If message is from the user in solo adventure.
    return <></>;
  } else if (
    // If the previous message is a question box type.
    (previous?.metadata?.step_kind === 'question' ||
      // ... or if the previous message is a share message box
      // with the current message shared.
      previous?.metadata?.messenger_answer === item?.content) &&
    item?.content &&
    item?.direct_message
  ) {
    // ... Don't render message box as it was already rendered above.
    return <></>;
  } else if (['binary', 'multi', 'question', 'share'].includes(msgKind)) {
    // Render special type message (question / multi / binary / share)
    return (
      <SpecialMessage
        message={item}
        nextMessage={next}
        kind={msgKind}
        adventure={adventure}
        step={step}
        onFocus={(answerPosY: number): void => {
          onFocus(answerPosY);
        }}
      />
    );
  } else {
    // Render regular text message.
    return (
      <TextMessage
        user={user}
        message={item}
        isBlured={isBlured}
        messenger={messenger}
        isSharedAnswer={isSharedAnswer}
        canReport={showMessageReporting}
        onReport={(): void => {
          // Prevent reporting the group leader.
          if (showMessageReporting) {
            dispatch(
              setComplain({
                messageId: item?.id,
                adventureId: adventure.id,
              }),
            );
          } else {
            Alert.alert(
              t('reportModal:reportingLeaderTitle'),
              t('reportModal:reportingLeaderBody'),
            );
          }
        }}
        onCopy={(): void => {
          Clipboard.setString(item?.content);
          dispatch(toastAction(t('copied'), 'short'));
        }}
        onReaction={(newReaction: string): void => {
          dispatch(
            createReaction({
              reaction: newReaction,
              messageId: item.id,
              conversationId: item.conversation_id,
            }),
          );
        }}
      />
    );
  }
};

export default Message;
