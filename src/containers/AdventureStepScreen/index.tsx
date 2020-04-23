import React, { useState, useEffect, useRef } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';
import MainMessagingInput from '../../components/MainMessagingInput';
import AdventureStepMessage from '../../components/AdventureStepMessage';
import AdventureStepMessageInput from '../../components/AdventureStepMessageInput';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';
import { KeyboardAvoidingView, findNodeHandle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount, useKeyboard } from '../../utils';
import { getAdventureStepMessages } from '../../actions/requests';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ModalProps = {
  route: {
    params: {
      stepId: string,
      adventure: object,
    }
  }
}
const AdventureStepScreen = ( { route }: ModalProps ) => {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isPortrait, setIsPortrait] = useState(true);
  const { stepId, adventure } = route.params;
  console.log( "🤢adventure:" , adventure );
  console.log( "🤢stepId:" , stepId );
  const steps = useSelector(({ data }) => data.adventureSteps);
  const [currentSteps, setCurrentSteps] = useState(steps[adventure.id] || []);
  const [currentStep, setCurrentStep] = useState(
    currentSteps.find(s => s.id === stepId),
  );

  const me = useSelector(({ auth }) => auth.user);
  const messages = useSelector(({ data }) => data.adventureStepMessages);
  const [currentMessages, setCurrentMessages] = useState(
    [...(messages[currentStep.id] || [])].reverse(),
  );

  useEffect(() => {
    setCurrentSteps(steps[adventure.id]);
    setCurrentStep(steps[adventure.id].find(s => s.id === stepId));
  }, [steps]);

  const scrollRef = useRef(null);
  const isSolo = adventure.kind !== 'duo' && adventure.kind !== 'multiple';
  let mainAnswer = '';

  if (!['multi', 'binary'].includes(currentStep.kind)) {
    mainAnswer = (currentMessages.find(m => m.messenger_id === me.id) || {})
      .content;
  } else {
    mainAnswer = (currentStep.metadata.answers.find(a => a.selected) || {})
      .value;
  }
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useKeyboard(bool => setKeyboardVisible(bool));

  useMount(() => {
    console.log( "currentStep.kind:" ); console.log( currentStep.kind );
    dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id),
    );
  });
  useEffect(() => {
    let newMsgs = [...(messages[currentStep.id] || [])].reverse();
    // If solo adventure, render bot's messages.
    if (isSolo) {
      newMsgs.unshift({
        id: new Date().toISOString(),
        messenger_id: (
          adventure.conversation.messengers.find(i => i.id !== me.id) || {}
        ).id,
        content: (currentStep.metadata || {}).comment,
        metadata: { vokebot_action: 'journey_step_comment' },
      });
    }
    setCurrentMessages(newMsgs);
  }, [messages]);

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
          /* innerRef={ref => {
            scrollRef = ref;
          }} */
        >
          <Video
            onOrientationChange={orientation =>
              orientation === 'portrait'
                ? setIsPortrait(true)
                : setIsPortrait(false)
            }
            item={currentStep.item.content}
          />
          {isPortrait && (
            <>
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
                  source={{ uri: me.avatar.small }}
                  style={[st.absb, st.right(-30), st.h(25), st.w(25), st.br1]}
                />
                <AdventureStepMessageInput
                  onFocus={() => {
                    /* scrollRef.current.props.scrollToFocusedInput(
                      findNodeHandle(event.target),
                    ); */
                  }}
                  kind={currentStep.kind}
                  adventure={adventure}
                  step={currentStep}
                  defaultValue={mainAnswer}
                />
              </Flex>
              {currentMessages.map(item => (
                <AdventureStepMessage
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
              ))}
            </>
          )}
        </KeyboardAwareScrollView>
        {/*
          NEW MESSAGE FIELD (at the bottom of the screen).
          But only if it's portrait orientation and not solo adventure.
          It makes no sense to talk to yourself in solo mode.
        */}
        {!isSolo && isPortrait && (
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
            i => i.id !== me.id && i.first_name !== 'VokeBot',
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
