/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import React, {
  useState,
  useEffect,
  useRef,
  ReactElement,
  useMemo,
} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  View,
  StatusBar,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { useKeyboard } from '@react-native-community/hooks';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { REDUX_ACTIONS } from 'utils/constants';
import { RootState } from 'reducers';
import Complain from 'components/Complain';
import AdventureStepMessageInput from 'components/AdventureStepMessageInput';
import AdventureStepNextAction from 'components/AdventureStepNextAction';
import AdventureStepMessage from 'components/AdventureStepMessage';
import DismissKeyboardView from 'components/DismissKeyboardHOC';
import MainMessagingInput from 'components/MainMessagingInput';
import Flex from 'components/Flex';
import Text from 'components/Text';
import st from 'utils/st';
import theme from 'utils/theme';
import Video from 'components/Video';
import VokeIcon from 'components/VokeIcon';
import {
  TAdventureSingle,
  TAnswer,
  TDataState,
  TMessage,
  TStep,
} from 'utils/types';
import {
  getAdventureStepMessages,
  markMessageAsRead,
  interactionVideoPlay,
  getAdventureSteps,
} from 'actions/requests';
import useWhyDidYouUpdate from 'hooks/useWhyDidYouUpdate';
import { toastAction } from 'actions/info';
import { bots } from 'assets';
import Image from 'components/Image';

import styles from './styles';

// Mark messages in the current conversation as read.
const markConversationAsRead = ({
  messages = [],
  userId = '',
  conversationId = '',
  adventureId = '',
  stepId = '',
  dispatch,
}: {
  messages: TMessage[];
  userId: string;
  conversationId: string;
  adventureId: string;
  stepId: string;
  dispatch: ThunkDispatch<TDataState, void, Action>; // https://d.pr/bEgcFa
}): void => {
  // See documentation for marking message as read:
  // https://docs.vokeapp.com/#me-conversations-messages-interactions
  // To mark as read we need converstation id and message id.
  // We mark only the latest message as read,
  // all others will be marked as read automatically according to Pablo :)

  // We can't use our own message to mark conversation as read.
  // So find the latest message that doesn't belong to the current user.
  let latestMessage = messages
    ? messages
        .slice()
        .reverse()
        .find(message => message?.messenger_id !== userId)
    : null;

  // In some cases there is bug in API that shows unread messages even when
  // there is only one person in the chat 🤪.
  if (!latestMessage) {
    latestMessage = messages.slice().reverse()[0] || null;
  }

  // Don't mark Bot's messages in the Solo conversation as read.
  // Bot's messages are fake and doesn't have proper ID.
  if (latestMessage?.metadata?.vokebot_action === 'journey_step_comment') {
    return;
  }

  if (latestMessage && latestMessage?.id && conversationId && adventureId) {
    dispatch(
      markMessageAsRead({
        adventureId: adventureId,
        stepId: stepId,
        conversationId: conversationId,
        messageId: latestMessage?.id,
      }),
    );
  } else {
    console.log('🛑 no message ID provided');
  }
};

const maybeScrollToBottom = ({
  messages = [],
  stepCompleted = false,
  videoIsPlaying = false,
  hasUnreads = false,
  scrollObj = null,
  userId = '',
}: {
  messages: TMessage[];
  stepCompleted: boolean;
  videoIsPlaying: boolean;
  hasUnreads: boolean;
  scrollObj: ScrollView | null;
  userId: string;
}): void => {
  // Scroll if question already answered and video isn't playing...
  if (stepCompleted && !videoIsPlaying && messages.length > 1) {
    const newMessage = messages[messages.length - 1];
    // ... and there are unread message at the end
    // ... or current user just posted a new message (less than 5 sec.)
    if (
      hasUnreads ||
      (newMessage?.messenger_id === userId &&
        Date.now() - Date.parse(newMessage.created_at) < 5000)
    ) {
      setTimeout(() => {
        // Scroll to the end when we added new message,
        // but only when video isn't playing,
        // and current user answered the main question.
        if (scrollObj) {
          scrollObj.scrollToEnd();
        }
      }, 100);
    }
  }
};

const createBotMessage = ({
  adventureId = '', //adventure?.id
  message = '', // currentStep?.metadata?.comment,
  stepId = '',
  dispatch, // currentStep.id
  botId = '',
}: {
  adventureId: string;
  message: string;
  stepId: string;
  dispatch: ThunkDispatch<TDataState, void, Action>; // https://d.pr/bEgcFa
  botId: string;
}): void => {
  const newBotMessage = {
    id: new Date().toISOString(),
    messenger_id: botId,
    content: message,
    metadata: { vokebot_action: 'journey_step_comment' },
    grouping_journey_step_id: stepId,
  };
  // Send this new pseudo-message to redux.
  dispatch({
    type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
    message: newBotMessage,
    adventureId: adventureId,
    description: 'From createBotMessage()',
  });
};

type ComponentProps = {
  adventure: TAdventureSingle;
  currentStep: TStep;
};
const AdventureStepScreenRender = ({
  adventure,
  currentStep,
}: ComponentProps): ReactElement => {
  const currentMessages: TMessage[] = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[currentStep?.id] || [],
    // Custom equalityFn comparing length of the array only.
    (item, previousItem) => {
      if (item.length === previousItem.length) {
        return true;
      } else {
        return false;
      }
    },
  );

  const videoIsPlaying = useSelector(
    ({ info }: RootState) => info.videoIsPlaying || false,
  );
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
  const scrollRef = useRef<ScrollView | null>(null);
  const dispatch = useDispatch();
  const hasNotch = DeviceInfo.hasNotch();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);
  const keyboard = useKeyboard();
  const [prevContentOffset, setPrevContentOffset] = useState(100);
  const [hasClickedPlay, setHasClickedPlay] = useState(false);
  const [answerPosY, setAnswerPosY] = useState(0);
  const [skipKeyboardColapse, setSkipKeyboardColapse] = useState(false);
  const adventureId = adventure?.id || '';
  const stepId = currentStep?.id || '';
  const conversationId = adventure?.conversation?.id || '';
  const currentUser = useSelector(({ auth }: RootState) => auth.user) || {};
  const userId = currentUser?.id || '';
  const messengers = adventure?.conversation?.messengers || [];
  const completedByMessenger = currentStep
    ? currentStep['completed_by_messenger?']
    : false;

  const isSolo = adventure?.kind !== 'duo' && adventure?.kind !== 'multiple';
  const botId = useMemo(() => {
    return messengers.find(i => i.first_name === 'VokeBot')?.id || '';
  }, [messengers]);

  // Find a reply to the main question (if already answered).
  const myMainAnswer: TMessage = {
    id: '',
    content: '',
    created_at: '',
  };

  if (!['multi', 'binary'].includes(currentStep?.kind)) {
    // Find the first message of the current author from the start.
    const mainAnswer: TMessage | undefined = currentMessages
      .slice()
      .find(m => m?.messenger_id === currentUser.id);
    if (mainAnswer) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.content;
    }
  } else {
    // If multichoise.
    let mainAnswer: TAnswer | undefined;
    if (currentStep?.metadata?.answers?.length) {
      mainAnswer = currentStep?.metadata?.answers.find(
        (a: TAnswer) => a.selected,
      );
    }
    if (mainAnswer) {
      // RELEASE Check this case!
      myMainAnswer.id = mainAnswer.value || '';
      myMainAnswer.content = mainAnswer.key || '';
    }
  }

  // Load adventure messages on the first screen render.
  useEffect(() => {
    const getAdventureMessages = async (): Promise<void> => {
      if (conversationId) {
        setIsLoading(true);
        await dispatch(
          getAdventureStepMessages(conversationId, currentStep.id),
        );
        setIsLoading(false);
      }
      // Also update the current step (solves a bug with stuck blurred messages).
      dispatch(getAdventureSteps(adventureId));
    };

    if (!isSolo) {
      getAdventureMessages();
    }
  }, [adventureId, conversationId, currentStep.id, dispatch, isSolo]);

  useEffect(() => {
    // If solo adventure, render pseudo message from VokeBot.
    if (isSolo) {
      const existingBotMessage =
        currentMessages.find(m => m.messenger_id === botId) || null;
      if (!existingBotMessage) {
        createBotMessage({
          adventureId,
          message: currentStep?.metadata?.comment || '',
          stepId,
          dispatch,
          botId,
        });
      }
    }
  }, [
    adventureId,
    botId,
    currentMessages,
    currentStep,
    dispatch,
    isSolo,
    stepId,
  ]);

  useEffect(() => {
    // Once a new message from another participant received mark it as read,
    // but only if messages unblured/unlocked.
    if (
      currentMessages.length &&
      completedByMessenger
      // && newMessage?.messenger_id !== currentUser.id
    ) {
      // If the last message from someone else, mark it as read.
      markConversationAsRead({
        messages: currentMessages,
        userId,
        conversationId,
        adventureId,
        stepId,
        dispatch,
      });
    }
  }, [
    adventureId,
    completedByMessenger,
    conversationId,
    currentMessages, // top-level array comparison works fine here.
    dispatch,
    stepId,
    userId,
  ]);

  useEffect(() => {
    // Effect mostly run when:
    // - new messages posted in the current chat.
    setSkipKeyboardColapse(true);
    maybeScrollToBottom({
      messages: currentMessages,
      stepCompleted: completedByMessenger,
      hasUnreads: !!currentStep.unread_messages,
      scrollObj: scrollRef.current,
      userId: userId,
      videoIsPlaying,
    });
    // We don't want to have autoscroll when you have new messages and click
    // on video pause. This is why 'videoIsPlaying' is ommited from dependencies
    // list bellow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    completedByMessenger,
    currentMessages,
    currentStep.unread_messages,
    userId,
  ]);

  /* useWhyDidYouUpdate('🧚‍♀️', {
    adventureId,
    conversationId,
    currentStep,
    dispatch,
    isSolo,
  }); */

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
        style={styles.wrapper}
        keyboardVerticalOffset={0}
        // https://github.com/facebook/react-native/issues/13393#issuecomment-310431054
      >
        <ScrollView
          ref={(scroll): void => {
            if (!scrollRef?.current) {
              scrollRef.current = scroll;
            }
          }}
          // enableOnAndroid={false}
          // extraHeight={windowDimentions.height / 10}
          overScrollMode={'always'}
          // scrollEventThrottle={16} // Don't activate. Works bad on Android.
          onScroll={(e): void => {
            const scrollDiff = Math.abs(
              e.nativeEvent.contentOffset.y - prevContentOffset,
            );
            // Close keyboard if scrolling toward the very top of the screen.
            if (keyboard.keyboardShown && scrollDiff > 50) {
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
          contentContainerStyle={styles.scrollContainer}
          scrollEnabled={isPortrait ? true : false}
          keyboardShouldPersistTaps="always"
          // ☝️required to fix the bug with a need to double tap
          // on the send message icon.
          removeClippedSubviews={true}
          scrollIndicatorInsets={{ right: 1 }}
          testID="AdventureStepScreen"
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
                  // nothing here.
                }}
                lockOrientation={!videoIsPlaying}
              />
              {isPortrait && (
                <>
                  {/* Special Bot message at the top */}
                  {currentStep?.status_message ? (
                    <Flex align="center" style={styles.botIntroBanner}>
                      <Text style={styles.botIntroBannerText}>
                        {currentStep.status_message}
                      </Text>
                      <Image source={bots.bot} style={styles.vokebot} />
                    </Flex>
                  ) : null}

                  {/* First card with question */}
                  <View
                    style={styles.mainQuestionCard}
                    onLayout={({ nativeEvent }): void => {
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
                        onFocus={(): void => {
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
                  </View>

                  {
                    currentMessages.map((item, index) => {
                      return (
                        <>
                          {!item || myMainAnswer?.id === item?.id ? null : (
                            <AdventureStepMessage
                              key={item.id}
                              adventure={adventure}
                              step={currentStep}
                              item={item}
                              next={
                                currentMessages[index + 1]
                                  ? currentMessages[index + 1]
                                  : null
                              }
                              previous={
                                currentMessages[index - 1]
                                  ? currentMessages[index - 1]
                                  : null
                              }
                              onFocus={(event, posY): void => {
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
                  }
                  <AdventureStepNextAction
                    adventureId={adventureId}
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
                keyboard.keyboardShown && Platform.OS === 'android'
                  ? theme.spacing.s
                  : undefined,
            }}
          >
            <MainMessagingInput
              adventure={adventure}
              step={currentStep}
              keyboardAppearance="dark"
              onFocus={(): void => {
                if (scrollRef.current) {
                  scrollRef.current.scrollToEnd();
                }
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
