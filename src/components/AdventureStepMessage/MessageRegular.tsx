import React, { useState, useRef, RefObject } from 'react';
import {
  Image as ReactNativeImage,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
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

type Props = {
  message: TMessage;
  step: TStep;
  adventure: TAdventureSingle;
  previous: TMessage | null;
  next: TMessage | null;

  kind: TMessage['metadata']['step_kind']; // 'question' | 'regular' | 'binary' | 'multi' | 'share' | 'text',
  setAnswerPosY: (answerPosY: number) => void;
  selectedAnswer: string;
  inputField: React.ReactElement;
};

function MessageSpecial({
  message,
  step,
  adventure,
  previous,
  next,

  kind,
  setAnswerPosY,
  selectedAnswer,
  inputField,
}: Props): React.ReactElement {
  // SPECIAL MESSAGE: QUESTION / MULTI / BINARY / SHARE
  return (
    <View
      style={styles.mainQuestionCard}
      onLayout={({ nativeEvent }) => {
        // Calculate vertical offset to be used on answer field focus.
        const layout = nativeEvent?.layout;
        if (layout && layout?.y && layout?.height) {
          setAnswerPosY(layout.y);
        }
      }}
    >
      <Flex direction="column" style={styles.mainQuestionContainer}>
        {kind === 'multi' || kind === 'question' ? (
          /* MESSAGE QUESTION AREA: */
          <Flex
            direction="column"
            style={styles.mainQuestion}
            align="center"
            justify="center"
          >
            <Text style={[st.tac, st.white, st.fs(20), st.lh(24)]}>
              {(message?.metadata || {}).question || null}
            </Text>
          </Flex>
        ) : null}
        {/* <Image
            source={{ uri: (messenger.avatar || {}).small }}
            style={[st.absb, st.right(-30), st.h(25), st.w(25), st.br1]}
          /> */}
        {/* MESSAGE INPUT FIELD: */}
        {inputField}
      </Flex>
    </View>
  );

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
                  {isMyMessage || !messenger.first_name ? null : (
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
                          style={[StyleSheet.absoluteFill]}
                        />
                      )}
                      <Flex
                        style={[
                          StyleSheet.absoluteFill,
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
                source={
                  messenger?.avatar?.small
                    ? { uri: messenger?.avatar?.small }
                    : avatars.default
                }
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

export default MessageSpecial;
