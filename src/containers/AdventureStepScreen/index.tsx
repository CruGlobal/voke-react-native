import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';
import MainMessagingInput from '../../components/MainMessagingInput';
import AdventureStepMessage from '../../components/AdventureStepMessage';
import AdventureStepMessageInput from '../../components/AdventureStepMessageInput';
import AdventureStepNextAction from '../../components/AdventureStepNextAction';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';
import { KeyboardAvoidingView, View, ScrollView, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useMount, useKeyboard } from '../../utils';
import { getAdventureStepMessages, markMessageAsRead, interactionVideoPlay } from '../../actions/requests';
import { RootState } from '../../reducers';
import { TAdventureSingle, TStep } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { getAdventureSteps } from '../../actions/requests';
import styles from './styles';
import { REDUX_ACTIONS } from '../../constants';
import { setCurrentScreen } from '../../actions/info';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import { toastAction } from '../../actions/info';


type ModalProps = {
  route: {
    name: string,
    params: {
      stepId: string;
      adventureId: string;
    }
  }
}
const AdventureStepScreen = ( { route }: ModalProps ) => {
  const scrollRef = useRef();
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [isPortrait, setIsPortrait] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [hasClickedPlay, setHasClickedPlay] = useState(false);
  const { stepId, adventureId } = route.params;
  const adventure = useSelector(({ data }: RootState) => data.myAdventures.byId[adventureId]) || {};
  const conversationId = adventure.conversation?.id;
  const currentStep = useSelector(({ data }: RootState) =>
    data.adventureSteps[adventureId].byId[stepId]
  );
  const currentUser = useSelector(({ auth }: RootState) => auth.user) || {};
  const currentMessages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages[currentStep?.id] || []
  );
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';
  // Find a reply to the main question (if already answered).
  const myMainAnswer = {
    id: null,
    content: ''
  };

  useKeyboard( (bool: boolean) => setKeyboardVisible(bool));

  if (!['multi', 'binary'].includes(currentStep.kind)) {
    // Find the first message of the current author from the start.
    const mainAnswer = (currentMessages.slice().find( m => m?.messenger_id === currentUser.id))||{};
    // .reverse()
    if ( Object.keys(mainAnswer).length > 0 ) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.content;
    }
  } else {
    const mainAnswer = (currentStep.metadata.answers.find( (a: any) => a.selected)||{});
    if (  Object.keys(mainAnswer).length > 0 ) {
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
    let latestMessage = currentMessages.slice().reverse().find(message => message?.messenger_id !== currentUser.id) || null;

    // I some cases there is bug in API that shows unread messages even when
    // there is only one person in the chat 🤪.
    if (!latestMessage) {
      latestMessage = currentMessages.slice().reverse()[0] || null;
    }

    if ( latestMessage && latestMessage?.id ) {
      dispatch(
        markMessageAsRead({
          adventureId: adventure.id,
          stepId: currentStep.id,
          conversationId: conversationId,
          messageId: latestMessage?.id
        })
      );
    } else {
      console.log('🛑no message ID provided')
    }
  }

  const botMessage = () => {
    const botUserId = adventure.conversation.messengers.find(i => i.id !== currentUser.id) || null;
    if (!botUserId) return;
    const existingBotMessage = currentMessages.find(m=>m.messenger_id === botUserId.id) || null;
    if (!existingBotMessage ) {

      let newBotMessage ={
        id: new Date().toISOString(),
        messenger_id: (
          adventure.conversation.messengers.find(i => i.id !== currentUser.id) || {}
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
        description: 'From botMessage()'
      });
    }
  }

  const getMessages = async () =>{
    await dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id)
    );
    setIsLoading (false);
    // Also update the current step (solves a bug with stuck blurred messages).
    dispatch(getAdventureSteps(adventure.id));
  }

  // Load messages for current conversation on initial screen reader.
  useEffect(() => {
    setIsLoading (true);
    getMessages();
  }, []);

  useEffect(() => {
    const latestMessage = currentMessages[currentMessages.length - 1];
    // If new message posted by the current user
    if(currentMessages[currentMessages.length - 1]?.messenger_id === currentUser.id){
      // Scroll to the end when we added new message.
      scrollRef?.current?.scrollToEnd();
    }

    // Once a new message from another participant received mark it as read,
    // but only if messages unblured/unlocked.
    if(currentMessages.length && (
      currentStep['completed_by_messenger?'] || latestMessage?.messenger_id !== currentUser.id )){
      // If the last message from someone else, mark it as read.
      markAsRead();
    }

    // this.scroll.props.scrollToFocusedInput(reactNode)
    // scrollRef.current.props.scrollToPosition(0, 999999)
    // let newMsgs = [...(messages[currentStep.id] || [])];//.reverse();

    // If solo adventure, render bot's messages.
    if (isSolo) {
      botMessage();
    }
  }, [currentMessages.length]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Actions to run when the screen focused:
      // Save current screen and it's parammeters in store.
      dispatch(setCurrentScreen({
        screen: route?.name,
        data: {
          conversationId: conversationId,
          adventureStepId: currentStep.id,
          adventureId: adventure.id,
        },
      }));

      // If there are unread messages in current conversation
      // mark them as read on the backend but only if they were unlocked/unblured.
      // Not sure if wee need it as it will mark as read anyway from code in useEffect.
      /* if (currentStep.unread_messages && currentStep['completed_by_messenger?']) {
        markAsRead();
      } */
      return () => {
        // Actions to run when the screen unfocused:
        // If we had unread messages, then we marked them as read,
        // so on leaving this screen we need to update the current Adventure steps
        // to have right unread badges next to each step.
        // TODO: Most likely it's not needed anymore. Test it!
        /* if (currentStep.unread_messages) {
          dispatch(getAdventureSteps(adventure.id));
        } */
      };
    }, [])
  )

  console.log( "🐸 insets.top:", insets.top );

  return (
    <>
      <View style={{
          // flex:1,
          height: insets.top,
          backgroundColor: isPortrait && insets.top > 0 ? '#000' : 'transparent',
      }}>
        <StatusBar
          animated={true}
          barStyle="dark-content"
          translucent={false}
          // translucent={ isPortrait && insets.top > 0 ? false : true } // Android. The app will draw under the status bar.
          backgroundColor='#000' // Android. The background color of the status bar.
        />
      </View>
      <View
        style={[
          st.w100,
          st.h100,
          // st.bgBlue,
          {
            backgroundColor: isPortrait ? st.colors.blue : st.colors.deepBlack,
            flexDirection: 'column',
            alignContent: 'center',
            justifyContent: 'flex-end',
          }
        ]}
      >
        <KeyboardAvoidingView
          behavior="position"
          style={[st.aic, st.w100, st.jcsb]}
        >
          <ScrollView
            ref={(scroll) => {
              if ( ! scrollRef?.current ) {
                scrollRef.current = scroll;
              }
            }}
            // Close keyboard if scrolling.
            onScroll={
              Keyboard.dismiss
            }
            scrollEventThrottle={0}
            contentContainerStyle={[st.aic, st.w100, st.jcsb]}
            scrollEnabled={isPortrait? true: false}
            keyboardShouldPersistTaps ='always'
              // ☝️required to fix the bug with a need to double tap
              // on the send message icon.
          >
            <View
              style={[
                {
                  paddingBottom: isPortrait? insets.bottom : 0,
                },
                st.f1,
              ]}
              enableAutomaticScroll
              keyboardShouldPersistTaps ='always'
              // ☝️required to fix the bug with a need to double tap
              // on the send message icon.
            >
              {/* This View stays outside of the screen on top
              and covers blue area with solid black on pull. */}
              <View
                style={{
                  position:'absolute',
                  backgroundColor: 'black',
                  left: 0,
                  right: 0,
                  top: -300,
                  height: 300,
                }}
              ></View>
              {/* Video Player */}
              <Video
                onOrientationChange={(orientation: string): void => {
                  setIsPortrait( orientation === 'portrait' ? true : false);
                }}
                item={currentStep.item.content}
                onPlay={
                  () => {
                    dispatch( interactionVideoPlay({
                      videoId: adventure.id,
                      context: 'journey'
                    }))

                    if (!hasClickedPlay) {
                      setHasClickedPlay(true);
                    }
                  }
                }
              />
              {isPortrait && (
              <>
                {/* Special Bot message at the top */}
                {currentStep.status_message ? (
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
                      style={[
                        st.abs,
                        st.left(-25),
                        st.bottom(-20),
                        st.h(70),
                        st.w(70),
                      ]}
                    />
                  </Flex>
                ) : null}

                {/* First card with question */}
                <Flex direction="column" self="center" style={[st.w80, st.mt2]}>
                  <Flex
                    direction="column"
                    style={[st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
                    align="center"
                    justify="center"
                  >
                    <Text style={[st.tac, st.white, st.fs20, st.lh(24)]}>
                      {currentStep.question}
                    </Text>
                  </Flex>
                  <Image
                    source={{ uri: currentUser.avatar.small }}
                    style={[st.absb, st.right(-30), st.h(25), st.w(25), st.br1]}
                  />
                  <AdventureStepMessageInput
                    onFocus={(event) => {
                      if (hasClickedPlay) {
                        return;
                      } else {
                        dispatch(
                          toastAction(
                            'Please watch the video first before you answer. Thanks!',
                          ),
                        );
                      }
                      /* scrollRef.current.props.scrollToFocusedInput(
                        findNodeHandle(event.target),
                      ); */
                    }}
                    kind={currentStep.kind}
                    adventure={adventure}
                    step={currentStep}
                    defaultValue={myMainAnswer.content}
                    isLoading={isLoading}
                  />
                </Flex>

                {isLoading && !!! currentMessages.length ?
                  <ActivityIndicator size="large" color="rgba(255,255,255,.5)" style={{
                    paddingTop: 50
                  }} />:
                  currentMessages.map(item =>  {
                      return(
                        <>
                          {
                            ( !item || myMainAnswer?.id === item?.id)
                              ? null
                            : <AdventureStepMessage
                                key={item.id}
                                item={item}
                                adventure={adventure}
                                step={currentStep}
                                onFocus={event => {
                                  /* scrollRef.current.props.scrollToFocusedInput(
                                    findNodeHandle(event.target),
                                  ); */
                                }}
                              />
                          }
                        </>
                      )
                    }
                  )
                }
                {!isKeyboardVisible && <AdventureStepNextAction
                  adventureId={adventure.id}
                  stepId={stepId}
                />}
              </>
              )}
              {/* Extra spacing on the bottom */}
              { isPortrait && <View style={{height:60}}></View> }
            </View>
          </ScrollView>
          {/*
            NEW MESSAGE FIELD (at the bottom of the screen).
            But only if it's portrait orientation and not solo adventure.
            It makes no sense to talk to yourself in solo mode.
          */}
          {!isSolo && isPortrait && currentStep['completed_by_messenger?'] && (
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={[
                st.w100,
                st.ph4,
                {
                  backgroundColor: theme.colors.primary,
                  paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
                  maxHeight: 140,
                },
              ]}
            >
              <MainMessagingInput
                adventure={adventure}
                step={currentStep}
                keyboardAppearance="dark"
              />
            </Flex>
          )}
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

export default AdventureStepScreen;
