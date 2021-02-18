/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import ContextMode from 'domain/Chat/ContextMode';
import InteractiveElement from 'domain/Chat/InteractiveElement';

import React, { useState, useRef, RefObject } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  Alert,
  Image as ReactNativeImage,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Clipboard from '@react-native-community/clipboard';
import Menu from 'react-native-material-menu';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { avatars, ui } from 'assets';
import theme from 'utils/theme';
import st from 'utils/st';
import { TAdventureSingle, TStep, TMessage, TMessenger } from 'utils/types';
import { setComplain, toastAction } from 'actions/info';
import { createReaction } from 'actions/requests';
import useCurrentUser from 'hooks/useCurrentUser';
import Flex from 'components/Flex';
import VokeIcon from 'components/VokeIcon';
import Image from 'components/Image';
import Text from 'components/Text';
import Touchable from 'components/Touchable';

import DateComponent from '../DateComponent';

import styles from './styles';

type MessageProps = {
  item: TMessage;
  step: TStep;
  adventure: TAdventureSingle;
  previous: TMessage | null;
  next: TMessage | null;
  onFocus?: (event: unknown, answerPosY: number) => void;
};

function AdventureStepMessage({
  item,
  step,
  adventure,
  previous,
  next,
  onFocus,
}: MessageProps): React.ReactElement | null {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const [answerPosY, setAnswerPosY] = useState(0);
  const isAndroid = Platform.OS === 'android';

  const isMyMessage = item?.messenger_id === user.id;
  const adminUser = adventure.conversation.messengers.find(i => i.group_leader);

  const isAdminMessage = item?.messenger_id === adminUser?.id;
  const isAdmin = user.id === adminUser?.id;
  // const myFirstMessage = reversed.find(m => m.messenger_id === me.id);
  if (isMyMessage && adventure.kind === 'solo') return null;
  const isSharedAnswer = item?.metadata?.vokebot_action === 'share_answers';
  // User who left the message.
  const messenger: TMessenger = adventure.conversation.messengers.find(
    i => i.id === item?.messenger_id,
  ) || {
    id: item?.messenger_id || '',
    first_name: '',
    last_name: '',
    avatar: {
      small: '',
      medium: '',
      large: '',
    },
    status: 'blocked',
  };

  const messengerAvatar = messenger?.avatar?.small || avatars.default;
  // Blur other answers until step completed.
  const isBlured =
    !isMyMessage && // If this is not my message.
    step.status !== 'completed' && // If current step not yet completed.
    !item?.metadata?.messenger_journey_step_id; // If I didn't left the message.

  const msgKind = item?.metadata?.step_kind;
  let selectedAnswer =
    (((item?.metadata || {}).answers || []).find(i => i?.selected) || {}).key ||
    '';

  const showMessageReporting =
    item?.messenger_id !== user.id && // Can't report themselves.
    !isAdminMessage && // Can't report admin.
    !isBlured && // Can't report blured messages.
    !isAdmin && // Admin can't report anyone.
    adventure.kind !== 'duo'; // Can't report in Duo adventure.

  // If current message is a question box and next message is answer,
  // render next message here (https://d.pr/i/YHrv4N).
  if (
    msgKind === 'question' &&
    !selectedAnswer &&
    item?.metadata?.vokebot_action === 'journey_step' &&
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
      previous?.metadata?.messenger_answer === item?.content) &&
    item?.content &&
    item?.direct_message
  ) {
    return null;
  }

  // SPECIAL MESSAGE: QUESTION / MULTI / BINARY / SHARE
  if (['binary', 'multi', 'question', 'share'].includes(msgKind)) {
  }

  // REGULAR MESSAGE: TEXT
}

export default AdventureStepMessage;
