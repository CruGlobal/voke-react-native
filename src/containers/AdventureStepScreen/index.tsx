import React, { useState, useEffect, useRef } from 'react';
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
import { KeyboardAvoidingView, findNodeHandle, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount, useKeyboard } from '../../utils';
import { getAdventureStepMessages, markMessageAsRead } from '../../actions/requests';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RootState } from '../../reducers';
import { TAdventureSingle, TStep } from '../../types';
import { useFocusEffect } from '@react-navigation/native';
import { getAdventureSteps } from '../../actions/requests';

type ModalProps = {
  route: {
    params: {
      stepId: string;
      adventure: TAdventureSingle;
    }
  }
}
const AdventureStepScreen = ( { route }: ModalProps ) => {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const [isPortrait, setIsPortrait] = useState(true);
  const { stepId, adventure } = route.params;
  const steps = useSelector(({ data }: RootState) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventure.id] || []);
  const [currentStep, setCurrentStep] = useState(
    currentSteps.find( (s:TStep) => s.id === stepId),
  );

  const currentUser = useSelector(({ auth }: RootState) => auth.user);
  const messages = useSelector(
    ({ data }: RootState) => data.adventureStepMessages
  );
  const [currentMessages, setCurrentMessages] = useState(
    [...(messages[currentStep.id] || [])]//.reverse(),
  );

  useEffect(() => {
    setCurrentSteps(steps[adventure.id]);
    setCurrentStep(steps[adventure.id].find( (s:TStep) => s.id === stepId));
  }, [steps]);

  const scrollRef = useRef(null);
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';
  // Find a reply to the main question (if already answered).
  const myMainAnswer = {
    id: null,
    content: ''
  };

  console.log( "🐸 currentMessages:", currentMessages );

  if (!['multi', 'binary'].includes(currentStep.kind)) {
    // Find the first message of the current author from the start.
    const mainAnswer = (currentMessages.reverse().slice().find(m => m.messenger_id === currentUser.id));
    if ( mainAnswer ) {
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

  useMount(() => {
    dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id)
    );
  });
  useEffect(() => {
    let newMsgs = [...(messages[currentStep.id] || [])];//.reverse();
    // If solo adventure, render bot's messages.
    if (isSolo) {
      // newMsgs.push({
      newMsgs.unshift({
        id: new Date().toISOString(),
        messenger_id: (
          adventure.conversation.messengers.find(i => i.id !== currentUser.id) || {}
        ).id,
        content: (currentStep.metadata || {}).comment,
        metadata: { vokebot_action: 'journey_step_comment' },
      });
    }
    setCurrentMessages(newMsgs);
  }, [messages]);

  // Events firing when user leaves the screen or comes back.
  useFocusEffect(
    React.useCallback(() => {
      // Actions to run when the screen focused:

      // If there are unread messages in current conversation
      // mark them as read on the backend.
      if (currentStep.unread_messages) {
        // See documentation for marking message as read:
        // https://docs.vokeapp.com/#me-conversations-messages-interactions
        // To mark as read we need converstation id and message id.

        const conversationId = adventure.conversation.id;
        console.log( "🐸 conversationId:", conversationId );

        currentMessages.forEach( msg => {
          dispatch(
            markMessageAsRead( { conversationId: conversationId, messageId: msg.id})
          );
        });
      }

      return () => {
        // Actions to run when the screen unfocused:
        console.log('UNFOCUSED 💂‍♂️');
        // If we had unread messages, then we marked them as read,
        // so on leaving this screen we need to udpate current Adventure steps
        // to have right unread bages next to each step.
        if (currentStep.unread_messages) {
          dispatch(getAdventureSteps(adventure.id));
        }
      };
    }, [])
  )

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[st.aic, st.w100, st.jcsb, st.bgBlue]}
    >
      <Flex
        direction="column"
        justify="end"
        align="center"
        style={[st.w100, st.h100]}
      >
        <KeyboardAwareScrollView
          style={[
            // st.w(st.fullWidth),
            st.bgBlue,
            { paddingBottom: insets.bottom },
            st.f1,
          ]}
          enableAutomaticScroll
          keyboardShouldPersistTaps ='always'
          // ☝️required to fix the bug with a need to double tap
          // on the send message icon.

          /* innerRef={ref => {
            scrollRef = ref;
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
              <Flex direction="column" self="center" style={[st.w80, st.mt4]}>
                <Flex
                  direction="column"
                  style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
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
              {currentMessages.map(item =>  {
                  return(
                    <>
                      {
                        (myMainAnswer?.id === item?.id)
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
              <AdventureStepNextAction
                adventureId={adventure.id}
                stepId={stepId}
              />
            </>
          )}
        </KeyboardAwareScrollView>
        {/*
          NEW MESSAGE FIELD (at the bottom of the screen).
          But only if it's portrait orientation and not solo adventure.
          It makes no sense to talk to yourself in solo mode.
        */}
        {!isSolo && isPortrait && myMainAnswer.id && (
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

      {/* next Video Ready Button
        let text = t('nextVideoReady');
        if (isWaiting) {
          const isSolo = journey && journey.kind !== 'duo';
          if (isSolo) {
            return;
          }
          const otherUser = journey.conversation.messengers.find(
            i => i.id !== currentUser.id && i.first_name !== 'VokeBot',
          );
          // TODO: Pass through invite name
          // if (journey.conversation.messengers.length === 2 && inviteName) {
          //   otherUser = { first_name: inviteName };
          // }
          let userName =
            otherUser && otherUser.first_name
              ? otherUser.first_name
              : inviteName
              ? inviteName
              : '';
          text = t('waitingForAnswer', { name: userName });
        }
      */}
      </Flex>
    </KeyboardAvoidingView>
  );
}

export default AdventureStepScreen;
