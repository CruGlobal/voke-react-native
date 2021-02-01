import ContextMode from 'domain/Chat/ContextMode';
import MessageFooter from 'domain/Chat/MessageFooter';
import BluredBlock from 'domain/Chat/BluredBlock';

import React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Image as ReactNativeImage, Text, View, Pressable } from 'react-native';
import { TMessage, TMessenger, TUser } from 'utils/types';
import { isAndroid } from 'utils/constants';
import { avatars } from 'assets';
import theme from 'utils/theme';
import { useTranslation } from 'react-i18next';

import styles from './styles';

interface Props {
  message: TMessage;
  user: TUser;
  messenger: TMessenger;
  contextActive: boolean;
  setContextActive: (value: boolean) => void;
  canReport: boolean;
  onReport: () => void;
  onCopy: () => void;
  isSharedAnswer: boolean;
  isBlured: boolean;
  onReaction: (value: string) => void;
}

const TextMessage = (props: Props): React.ReactElement => {
  const {
    message,
    user,
    messenger,
    contextActive,
    setContextActive,
    canReport,
    onReport,
    onCopy,
    isSharedAnswer,
    isBlured,
    onReaction,
  } = props;

  const { t } = useTranslation('journey');
  const messengerId = message?.messenger_id; // User who left this message.
  const isCurrUsrMessage = messengerId === user.id; // Is it my message?

  const getContent = (): string => {
    if (isSharedAnswer) {
      return message?.metadata?.messenger_answer || '';
    } else {
      return message?.content ? message?.content : t('skipped');
    }
  };

  const getContentColor = (): string => {
    if (isBlured && isAndroid) {
      return 'rgba(0,0,0,0)';
    } else {
      return isCurrUsrMessage ? '#44c8e8' : '#fff';
    }
  };

  // Shared by VokeBot message block.
  const SharedAnswer = (): React.ReactElement => (
    <View
      style={[
        styles.sharedContent,
        {
          backgroundColor: isBlured ? 'transparent' : 'rgba(0,0,0,.2)',
        },
      ]}
    >
      <Text
        style={[
          styles.sharedText,
          {
            color: isBlured && isAndroid ? 'rgba(0,0,0,0)' : theme.colors.white,
          },
        ]}
      >
        {message?.content}
      </Text>
    </View>
  );

  return !message?.content && isCurrUsrMessage ? (
    // In case user submits an empty message, don't render it.
    <></>
  ) : (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Wrapper to show/hide context mode modal. */}
        <ContextMode
          active={contextActive}
          canReport={canReport}
          onReport={onReport}
          onCopy={onCopy}
          onClose={(): void => {
            setContextActive(false);
          }}
          onReaction={(reaction: string): void => {
            onReaction(reaction);
          }}
        >
          <>
            <View>
              {isCurrUsrMessage ? <View style={{ flex: 1 }} /> : null}
              {/* Long press block to activate context menu. */}
              <Pressable
                testID="messagePressArea"
                onLongPress={(): void => {
                  setContextActive(!contextActive);
                  ReactNativeHapticFeedback.trigger('selection');
                }}
                style={
                  isCurrUsrMessage
                    ? styles.messageBubbleMine
                    : styles.messageBubbleOthers
                }
              >
                <View>
                  {/* User's Name */}
                  {isCurrUsrMessage || !messenger.first_name ? null : (
                    <Text style={styles.author}>
                      {messenger.first_name ? messenger.first_name + ' ' : ''}
                      {messenger.last_name ? messenger.last_name + ' ' : ''}
                    </Text>
                  )}
                  {/* Shared Answer Decoration */}
                  {isSharedAnswer ? <SharedAnswer /> : null}
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color: getContentColor(),
                        opacity: message?.content ? 1 : 0.5,
                      },
                    ]}
                  >
                    {getContent()}
                  </Text>
                </View>
                {!isCurrUsrMessage ? <View style={{ flex: 1 }} /> : null}
                {/* Blured message decoration */}
                {isBlured ? <BluredBlock /> : null}
              </Pressable>
              {/* User Avatar */}
              <ReactNativeImage
                style={isCurrUsrMessage ? styles.myAvatar : styles.userAvatar}
                source={
                  messenger?.avatar?.small
                    ? { uri: messenger?.avatar?.small }
                    : avatars.default
                }
              />
            </View>
            <MessageFooter
              date={message.created_at}
              isMyMessage={isCurrUsrMessage}
              reactions={message?.reactions || {}}
              onReaction={(reaction: string): void => {
                onReaction(reaction);
              }}
            />
          </>
        </ContextMode>
      </View>
    </View>
  );
};

export default TextMessage;
