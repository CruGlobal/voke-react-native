/* eslint-disable camelcase */
import React, { useState, useEffect, useRef, ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  View,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import useKeyboard from '@rnhooks/keyboard';

import { REDUX_ACTIONS } from '../../constants';
import { RootState } from '../../reducers';
import {
  getAdventureStepMessages,
  markMessageAsRead,
  interactionVideoPlay,
  getAdventureSteps,
} from '../../actions/requests';
import { toastAction } from '../../actions/info';
import Complain from '../../components/Complain';
import AdventureStepMessageInput from '../../components/AdventureStepMessageInput';
import AdventureStepNextAction from '../../components/AdventureStepNextAction';
import AdventureStepMessage from '../../components/AdventureStepMessage';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import MainMessagingInput from '../../components/MainMessagingInput';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';
import Video from '../../components/Video';
import VokeIcon from '../../components/VokeIcon';

import styles from './styles';

type ComponentProps = {
  adventure: object | null;
  currentStep: {
    id: string;
    'completed_by_messenger?': boolean;
    kind: string;
    unread_messages: number;
    status_message: string;
    meta_data: any;
    item: any;
  };
};
const AdventureStepScreenRender = ({
  adventure,
  currentStep,
}: ComponentProps): ReactElement => {
  const currentMessages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[currentStep?.id] || [],
  );
  const scrollRef = useRef<ScrollView>();
  const dispatch = useDispatch();
  const hasNotch = DeviceInfo.hasNotch();
  const insets = useSafeAreaInsets();
  const windowDimentions = Dimensions.get('window');
  const [isLoading, setIsLoading] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isKeyboardVisible] = useKeyboard({
    /* useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true, */
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });
  const [prevContentOffset, setPrevContentOffset] = useState(100);
  const [hasClickedPlay, setHasClickedPlay] = useState(false);
  const [answerPosY, setAnswerPosY] = useState(0);
  const [skipKeyboardColapse, setSkipKeyboardColapse] = useState(false);
  const [skipInitialScroll, setSkipInitialScroll] = useState(true);
  const conversationId = adventure?.conversation?.id;
  const currentUser = useSelector(({ auth }: RootState) => auth.user) || {};

  const completedByMessenger = currentStep
    ? currentStep['completed_by_messenger?']
    : null;

  const isSolo = adventure?.kind !== 'duo' && adventure?.kind !== 'multiple';
  // Find a reply to the main question (if already answered).
  const myMainAnswer = {
    id: null,
    content: '',
  };

  const scrollDelayTimeout = useRef();

  if (!['multi', 'binary'].includes(currentStep?.kind)) {
    // Find the first message of the current author from the start.
    const mainAnswer =
      currentMessages.slice().find(m => m?.messenger_id === currentUser.id) ||
      {};
    // .reverse()
    if (Object.keys(mainAnswer).length > 0) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.content;
    }
  } else {
    const mainAnswer =
      currentStep.metadata.answers.find((a: any) => a.selected) || {};
    if (Object.keys(mainAnswer).length > 0) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.value;
    }
  }

  // Mark messages in the current conversation as read.
  const markAsRead = () => {
    // See documentation for marking message as read:
    // https://docs.vokeapp.com/#me-conversations-messages-interactions
    // To mark as read we need converstation id and message id.
    // We mark only the latest message as read,
    // all others will be marked as read automatically according to Pablo :)

    // We can't use our own message to mark conversation as read.
    // So find the latest message that doesn't belong to the current user.
    let latestMessage = currentMessages
      ? currentMessages
          .slice()
          .reverse()
          .find(message => message?.messenger_id !== currentUser.id)
      : null;

    // In some cases there is bug in API that shows unread messages even when
    // there is only one person in the chat 🤪.
    if (!latestMessage) {
      latestMessage = currentMessages.slice().reverse()[0] || null;
    }

    if (latestMessage && latestMessage?.id) {
      dispatch(
        markMessageAsRead({
          adventureId: adventure.id,
          stepId: currentStep.id,
          conversationId: conversationId,
          messageId: latestMessage?.id,
        }),
      );
    } else {
      console.log('🛑no message ID provided');
    }
  };

  const botMessage = () => {
    const botUserId =
      adventure.conversation.messengers.find(i => i.id !== currentUser.id) ||
      null;
    if (!botUserId) return;
    const existingBotMessage =
      currentMessages.find(m => m.messenger_id === botUserId.id) || null;
    if (!existingBotMessage) {
      const newBotMessage = {
        id: new Date().toISOString(),
        messenger_id: (
          adventure.conversation.messengers.find(
            i => i.id !== currentUser.id,
          ) || {}
        ).id,
        content: (currentStep.metadata || {}).comment,
        metadata: { vokebot_action: 'journey_step_comment' },
        grouping_journey_step_id: currentStep.id,
      };

      // Send this new pseudo-message to redux.
      dispatch({
        type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
        message: newBotMessage,
        adventureId: adventure.id,
        description: 'From botMessage()',
      });
    }
  };

  const maybeScrollToBottom = (): void => {
    const newMessage = currentMessages[currentMessages.length - 1];
    // Scroll if question already answered and video isn't playing...
    if (completedByMessenger && !isVideoPlaying) {
      // ... and there are unread or new messages.
      if (
        currentStep.unread_messages ||
        (newMessage?.messenger_id === currentUser.id && !skipInitialScroll)
      ) {
        scrollDelayTimeout.current = setTimeout(() => {
          // Scroll to the end when we added new message,
          // but only when video isn't playing,
          // and current user answered the main question.
          scrollRef?.current?.scrollToEnd();
        }, 100);
      }
    }

    setSkipInitialScroll(false);
  };

  const getMessages = async () => {
    await dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id),
    );
    setIsLoading(false);
    maybeScrollToBottom();
    // Also update the current step (solves a bug with stuck blurred messages).
    dispatch(getAdventureSteps(adventure.id));
  };

  useEffect(() => {
    setIsLoading(true);
    getMessages();
  }, []);

  useEffect(() => {
    setSkipKeyboardColapse(true);
    maybeScrollToBottom();

    // Once a new message from another participant received mark it as read,
    // but only if messages unblured/unlocked.
    if (
      currentMessages.length &&
      completedByMessenger
      // && newMessage?.messenger_id !== currentUser.id
    ) {
      // If the last message from someone else, mark it as read.
      markAsRead();
    }
    // If solo adventure, render bot's messages.
    if (isSolo) {
      botMessage();
    }
  }, [currentMessages.length]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: isPortrait ? st.colors.blue : st.colors.deepBlack,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'space-between',
      }}
    >
      {isPortrait && hasNotch ? (
        <View
          style={{
            height: Platform.OS === 'ios' ? insets.top : 0,
            backgroundColor: insets.top > 0 ? '#000' : 'transparent',
          }}
        >
          <StatusBar
            animated={false}
            barStyle="light-content"
            translucent={false}
            // translucent={ isPortrait && insets.top > 0 ? false : true } // Android. The app will draw under the status bar.
            backgroundColor="#000" // Android. The background color of the status bar.
          />
        </View>
      ) : (
        <StatusBar hidden={true} />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[
          st.aic,
          st.w100,
          st.jcsb,
          {
            flex: 1,
            paddingBottom: 0,
          },
        ]}
        keyboardVerticalOffset={0}
        // https://github.com/facebook/react-native/issues/13393#issuecomment-310431054
      >
        <ScrollView
          ref={scroll => {
            if (!scrollRef?.current) {
              scrollRef.current = scroll;
            }
          }}
          enableOnAndroid={false}
          extraHeight={windowDimentions.height / 10}
          overScrollMode={'always'}
          // scrollEventThrottle={16} // Don't activate. Works bad on Android.
          onScroll={e => {
            const scrollDiff = Math.abs(
              e.nativeEvent.contentOffset.y - prevContentOffset,
            );
            // Close keyboard if scrolling toward the very top of the screen.
            if (isKeyboardVisible && scrollDiff > 50) {
              // But don't close keyboard if user just sent a message.
              // Probably he wants to send another one.
              if (!skipKeyboardColapse) {
                Keyboard.dismiss();
              } else {
                setSkipKeyboardColapse(false);
              }
            }
            setPrevContentOffset(e.nativeEvent.contentOffset.y);
          }}
          contentContainerStyle={[st.aic, st.w100, st.jcsb]}
          scrollEnabled={isPortrait ? true : false}
          keyboardShouldPersistTaps="always"
          // ☝️required to fix the bug with a need to double tap
          // on the send message icon.
          removeClippedSubviews={true}
        >
          <DismissKeyboardView
            enableAutomaticScroll
            keyboardShouldPersistTaps="always"
            // ☝️required to fix the bug with a need to double tap
            // on the send message icon.
          >
            <>
              {/* This View stays outside of the screen on top
                and covers blue area with solid black on pull. */}
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'black',
                  left: 0,
                  right: 0,
                  top: -300,
                  height: 300,
                }}
              />
              {/* Video Player */}
              <Video
                onOrientationChange={(orientation: string): void => {
                  setIsPortrait(orientation === 'portrait' ? true : false);
                }}
                item={currentStep?.item?.content}
                onPlay={(): void => {
                  setIsVideoPlaying(true);
                  dispatch(
                    interactionVideoPlay({
                      videoId: currentStep?.item?.id,
                      context: 'journey',
                    }),
                  );

                  if (!hasClickedPlay) {
                    setHasClickedPlay(true);
                  }
                }}
                onStop={(): void => {
                  setIsVideoPlaying(false);
                }}
                lockOrientation={!isVideoPlaying}
              />
              {isPortrait && (
                <>
                  {/* Special Bot message at the top */}
                  {currentStep?.status_message ? (
                    <Flex
                      align="center"
                      style={[st.bgDarkBlue, st.ph1, st.pv4, st.ovh]}
                    >
                      <Text style={[st.fs4, st.white]}>
                        {currentStep.status_message}
                      </Text>
                      <VokeIcon
                        type="image"
                        name="vokebot"
                        style={styles.vokebot}
                      />
                    </Flex>
                  ) : null}

                  {/* First card with question */}
                  <Flex
                    direction="column"
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
                    >
                      <Flex style={styles.mainQuestion}>
                        <Text style={styles.mainQuestionText}>
                          {currentStep?.question}
                        </Text>
                      </Flex>
                      <AdventureStepMessageInput
                        onFocus={(event): void => {
                          if (!hasClickedPlay) {
                            dispatch(
                              toastAction(
                                'Please watch the video first before you answer. Thanks!', //TODO: Translate it!
                              ),
                            );
                          }
                          if (Platform.OS === 'ios' && scrollRef?.current) {
                            scrollRef.current.scrollTo({
                              x: 0,
                              y: answerPosY,
                              animated: true,
                            });
                          }
                        }}
                        kind={currentStep?.kind}
                        adventure={adventure}
                        step={currentStep}
                        defaultValue={myMainAnswer.content}
                        isLoading={isLoading} // TODO: what to do about this?
                      />
                    </Flex>
                  </Flex>

                  {
                    /* !currentMessages.length ? (
                    <ActivityIndicator
                      size="large"
                      color="rgba(255,255,255,.5)"
                      style={{
                        paddingTop: 50,
                      }}
                    />
                  ) : ( */
                    currentMessages.map(item => {
                      return (
                        <>
                          {!item || myMainAnswer?.id === item?.id ? null : (
                            <AdventureStepMessage
                              key={item.id}
                              item={item}
                              adventure={adventure}
                              step={currentStep}
                              onFocus={(event, posY) => {
                                if (
                                  Platform.OS === 'ios' &&
                                  scrollRef?.current
                                ) {
                                  scrollRef.current.scrollTo({
                                    x: 0,
                                    y: posY - 40,
                                    animated: true,
                                  });
                                }
                              }}
                            />
                          )}
                        </>
                      );
                    })
                    // )
                  }
                  <AdventureStepNextAction
                    adventureId={adventure.id}
                    stepId={currentStep.id}
                  />
                </>
              )}
              {/* Extra spacing on the bottom */}
              {isPortrait && <View style={{ height: 60 }} />}
            </>
          </DismissKeyboardView>
        </ScrollView>

        {/*
            NEW MESSAGE FIELD (at the bottom of the screen).
            But only if it's portrait orientation and not solo adventure.
            It makes no sense to talk to yourself in solo mode.
          */}
        {!isSolo && isPortrait && completedByMessenger && (
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingBottom:
                isKeyboardVisible && Platform.OS === 'android'
                  ? theme.spacing.s
                  : undefined,
            }}
          >
            <MainMessagingInput
              adventure={adventure}
              step={currentStep}
              keyboardAppearance="dark"
              onFocus={() => {
                scrollRef.current.scrollToEnd();
              }}
            />
          </View>
        )}
        <Complain />
      </KeyboardAvoidingView>
    </View>
  );
};

export default AdventureStepScreenRender;
