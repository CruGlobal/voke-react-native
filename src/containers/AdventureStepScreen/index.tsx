import React, { useState, useEffect, useRef, createRef, useCallback } from 'react';
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
import { KeyboardAvoidingView, findNodeHandle, View, ScrollView, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount, useKeyboard } from '../../utils';
import { getAdventureStepMessages, markMessageAsRead, markReadStepAction } from '../../actions/requests';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootState } from '../../reducers';
import { TAdventureSingle, TStep } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { getAdventureSteps } from '../../actions/requests';
import styles from './styles';
import { REDUX_ACTIONS } from '../../constants';
import { setCurrentScreen } from '../../actions/info';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';

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
  const { stepId, adventureId } = route.params;
  const adventure = useSelector(({ data }: RootState) => data.myAdventures.byId[adventureId]);
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

  if (!['multi', 'binary'].includes(currentStep.kind)) {
    // Find the first message of the current author from the start.
    const mainAnswer = (currentMessages.slice().find( m => {
        m?.messenger_id === currentUser.id
      })) || {};
    // .reverse()
    if ( Object.keys(mainAnswer).length > 0 ) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.content;
    }
  } else {
    const mainAnswer = (currentStep.metadata.answers.find( (a: any) => a.selected) || {});
    if ( mainAnswer ) {
      myMainAnswer.id = mainAnswer.id;
      myMainAnswer.content = mainAnswer.value;
    }
  }
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useKeyboard( (bool: boolean) => setKeyboardVisible(bool));

  // Load messages for current conversation on initial screen reader.
  useEffect(() => {
    dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id)
    );
  }, []);


  useEffect(() => {
    console.log( "🐷 currentMessages:", currentMessages );
    // If new message posted by the current user
    if(currentMessages[currentMessages.length - 1]?.messenger_id === currentUser.id){
      // Scroll to the end when we added new message.
      scrollRef?.current?.scrollToEnd();
    }
    // this.scroll.props.scrollToFocusedInput(reactNode)
    // scrollRef.current.props.scrollToPosition(0, 999999)
    // let newMsgs = [...(messages[currentStep.id] || [])];//.reverse();
    // If solo adventure, render bot's messages.
    if (isSolo) {
      // newMsgs.push({
      let botMessage ={
        id: new Date().toISOString(),
        messenger_id: (
          adventure.conversation.messengers.find(i => i.id !== currentUser.id) || {}
        ).id,
        content: (currentStep.metadata || {}).comment,
        metadata: { vokebot_action: 'journey_step_comment' },
      };

      // Send this new pseudo-message to redux.
      dispatch({
        type: REDUX_ACTIONS.CREATE_ADVENTURE_STEP_MESSAGE,
        result: {
          adventureStepId: currentStep.id,
          newMessage: botMessage
        },
      });
    }
  }, [currentMessages]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    useCallback(() => {
      // Actions to run when the screen focused:
      const conversationId = adventure.conversation.id;

      // Save current screen and it's parammeters in store.
      dispatch(setCurrentScreen({
        screen: route?.name,
        data: {
          conversationId: conversationId,
          adventureStepId: currentStep.id,
        },
      }));

      // If there are unread messages in current conversation
      // mark them as read on the backend.
      if (currentStep.unread_messages) {
        // See documentation for marking message as read:
        // https://docs.vokeapp.com/#me-conversations-messages-interactions
        // To mark as read we need converstation id and message id.
        dispatch(markReadStepAction({
          adventureId: adventure.id,
          stepId: currentStep.id,
        }));
        // We mark only the latest message as read,
        // all others will be marked as read automatically according to Pablo :)
        dispatch(
          markMessageAsRead({
            conversationId: conversationId,
            messageId: currentMessages.slice(-1)[0]?.id
          })
        );
      }
      return () => {
        // Actions to run when the screen unfocused:
        // If we had unread messages, then we marked them as read,
        // so on leaving this screen we need to update the current Adventure steps
        // to have right unread badges next to each step.
        // TODO: Most likely it's not needed anymore. Test it!
        if (currentStep.unread_messages) {
          dispatch(getAdventureSteps(adventure.id));
        }
      };
    }, [])
  )

  return (
    <View
      style={[st.w100, st.h100, st.bgBlue,
      {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-end',
      }]}
    >
      <KeyboardAvoidingView
        behavior="position"
        style={[st.aic, st.w100, st.jcsb, st.bgBlue]}
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
          keyboardShouldPersistTaps ='always'
            // ☝️required to fix the bug with a need to double tap
            // on the send message icon.
        >
          <View
            style={[
              // st.w(st.fullWidth),
              st.bgBlue,
              { paddingBottom: insets.bottom },
              st.f1,
            ]}
            enableAutomaticScroll
            // extraScrollHeight={-200}
            keyboardShouldPersistTaps ='always'
            // ☝️required to fix the bug with a need to double tap
            // on the send message icon.

            /* innerRef={ref => {
              console.log('Want to set scrollRef to ', ref);
              if ( ! scrollRef?.current ) {
                console.log('Setting scrollRef to ', ref);
                scrollRef.current = ref;
              }
            }} */
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
              onOrientationChange={ (orientation: string) =>
                orientation === 'portrait'
                  ? setIsPortrait(true)
                  : setIsPortrait(false)
              }
              item={currentStep.item.content}
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
                        st.rotate('40deg'),
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
                  {/* <Text>{myMainAnswer.content}</Text> */}
                  <AdventureStepMessageInput
                    onFocus={() => {
                      /* scrollRef.current.props.scrollToFocusedInput(
                        findNodeHandle(event.target),
                      ); */
                    }}
                    kind={currentStep.kind}
                    adventure={adventure}
                    step={currentStep}
                    defaultValue={myMainAnswer.content}
                  />
                </Flex>

                { currentMessages.map(item =>  {
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
                )}
                {!isKeyboardVisible && <AdventureStepNextAction
                  adventureId={adventure.id}
                  stepId={stepId}
                />}
              </>
            )}
            {/* Extra spacing on the bottom */}
            <View style={{height:60}}></View>
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
                backgroundColor: theme.colors.secondary,
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
  );
}

export default AdventureStepScreen;
