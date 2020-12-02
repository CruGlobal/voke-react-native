/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useRef, RefObject } from 'react';
import { Image as ReactNativeImage, Platform, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Menu from 'react-native-material-menu';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { avatars, ui } from 'assets';
import theme from 'utils/theme';
import { getCurrentUserId } from 'utils/get';
import st from 'utils/st';
import { TAdventureSingle, TStep, TMessage, TMessenger } from 'utils/types';

import { setComplain } from '../../actions/info';
import Image from '../Image';
import Text from '../Text';
import VokeIcon from '../VokeIcon';
import Flex from '../Flex';
import DateComponent from '../DateComponent';
import AdventureStepMessageInput from '../AdventureStepMessageInput';
import Touchable from '../Touchable';

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
  const reportMenuRef: RefObject<Menu> = useRef(null);
  const [answerPosY, setAnswerPosY] = useState(0);
  const isAndroid = Platform.OS === 'android';
  const userId = getCurrentUserId();

  const isMyMessage = item?.messenger_id === userId;
  const adminUser = adventure.conversation.messengers.find(i => i.group_leader);

  const isAdminMessage = item?.messenger_id === adminUser?.id;
  const isAdmin = userId === adminUser?.id;
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
      small: avatars.default,
      medium: avatars.default,
      large: avatars.default,
    },
    status: 'blocked',
  };

  const messengerAvatar = messenger?.avatar?.small;

  // Blur other answers until step completed.
  const isBlured =
    !isMyMessage && // If this is not my message.
    step.status !== 'completed' && // If current step not yet completed.
    !item?.metadata?.messenger_journey_step_id; // If I didn't left the message.

  const msgKind = item?.metadata?.step_kind;
  let selectedAnswer = (
    ((item?.metadata || {}).answers || []).find(i => i?.selected) || {}
  ).value;

  const showMessageReporting =
    item?.messenger_id !== userId && !isAdminMessage && !isBlured && !isAdmin;

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
    return (
      <View
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
                {(item?.metadata || {}).question || null}
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
            internalMessage={item}
            defaultValue={selectedAnswer}
            onFocus={event => {
              onFocus(event, answerPosY);
            }}
          />
        </Flex>
      </View>
    );
  }

  // REGULAR MESSAGE: TEXT
  return (
    <>
      {!item?.content && isMyMessage ? null : (
        <Flex align="between" style={styles.messageContainer}>
          <Flex direction="column" style={styles.messageContent}>
            <Flex direction="row">
              {isMyMessage ? <Flex style={[st.f1]} /> : null}
              <Flex
                style={{
                  width: '100%',
                  // width: isSharedAnswer ? '100%' : 'auto',
                  // minWidth: 170,
                  backgroundColor: isMyMessage
                    ? theme.colors.white
                    : theme.colors.secondary,
                  borderRadius: 8,
                  overflow: 'hidden', // Need this to hide overflow blur effect.
                }}
              >
                <Flex direction="column">
                  {isMyMessage ? null : (
                    <Text style={styles.messageAuthor}>
                      {messenger.first_name ? messenger.first_name + ' ' : ''}
                      {messenger.last_name ? messenger.last_name + ' ' : ''}
                    </Text>
                  )}
                  {isSharedAnswer ? (
                    <Flex style={styles.messageSharedContent}>
                      <Text
                        style={[
                          st.fs4,
                          {
                            color:
                              isBlured && isAndroid
                                ? 'rgba(0,0,0,0)'
                                : theme.colors.white,
                          },
                        ]}
                      >
                        {item?.content}
                      </Text>
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
                      opacity: item?.content ? 1 : 0.5,
                      paddingHorizontal: theme.spacing.l,
                      paddingVertical: theme.spacing.l,
                      fontSize: theme.fontSizes.l,
                    }}
                  >
                    {isSharedAnswer
                      ? item?.metadata?.messenger_answer
                      : item?.content
                      ? item?.content
                      : 'Skipped'}
                  </Text>
                </Flex>
                {!isMyMessage ? <Flex style={[st.f1]} /> : null}

                {isBlured ? (
                  <Flex align="center" justify="center" style={[st.absfill]}>
                    <>
                      {isAndroid && (
                        <ReactNativeImage
                          source={ui.bluredText}
                          resizeMode={'repeat'}
                          resizeMethod={'resize'}
                          style={{
                            width: '92%',
                            height: 800,
                            position: 'absolute',
                            left: '4%',
                            top: 10,
                            // Background needed to cover name of the messenger.
                            backgroundColor: theme.colors.secondary,
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
              <DateComponent
                style={[
                  st.white,
                  isMyMessage ? st.tar : null,
                  { fontSize: theme.fontSizes.xs },
                ]}
                date={item?.created_at}
                format="MMM D @ h:mm A"
              />
              {/* <Text style={styles.messageMetaActions}>・</Text> */}
              {
                // Prevent reporting it's own messages 🤪.
                // Remove this condition if more actions added later.
                showMessageReporting && (
                  <Menu
                    ref={reportMenuRef}
                    // onHidden={()=>{}}
                    button={
                      <Text
                        style={styles.messageMetaActions}
                        onPress={reportMenuRef.current?.show}
                      >
                        {t('more')}
                      </Text>
                    }
                  >
                    <Touchable
                      onPress={(): void => {
                        // Prevent reporting it's own messages 🤪.
                        if (showMessageReporting) {
                          dispatch(
                            setComplain({
                              messageId: item?.id,
                              adventureId: adventure.id,
                            }),
                          );
                        }
                        reportMenuRef.current?.hide();
                      }}
                      style={styles.actionReport}
                    >
                      <VokeIcon
                        name="warning"
                        size={20}
                        style={styles.actionReportIcon}
                      />
                      <Text style={styles.actionReportLabel}>
                        {' '}
                        {t('conversations:report')}
                      </Text>
                    </Touchable>
                  </Menu>
                )
              }
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
}

export default AdventureStepMessage;
