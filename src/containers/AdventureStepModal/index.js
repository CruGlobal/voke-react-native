import React, { useState, useEffect, useRef } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
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

function AdventureStepModal(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isLandscape, setIsLandscape] = useState(false);
  const { stepId, adventure } = props.route.params;
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

  const scroll = useRef();
  const isSolo = currentStep.kind !== 'duo' && currentStep.kind !== 'multiple';
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
    dispatch(
      getAdventureStepMessages(adventure.conversation.id, currentStep.id),
    );
  });
  useEffect(() => {
    let newMsgs = [...(messages[currentStep.id] || [])].reverse();
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
        <Video
          onOrientationChange={orientation =>
            orientation === 'portrait'
              ? setIsLandscape(false)
              : setIsLandscape(true)
          }
          item={currentStep.item.content}
        />
        {isLandscape ? null : (
          <>
            <KeyboardAwareScrollView
              style={[
                st.w(st.fullWidth),
                st.bgBlue,
                { paddingBottom: insets.bottom },
                st.f1,
              ]}
              enableAutomaticScroll={false}
              innerRef={ref => {
                this.scroll = ref;
              }}
            >
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
                  onFocus={event => {
                    this.scroll.props.scrollToFocusedInput(
                      findNodeHandle(event.target),
                    );
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
                    this.scroll.props.scrollToFocusedInput(
                      findNodeHandle(event.target),
                    );
                  }}
                />
              ))}
              <Flex style={[st.h(insets.bottom)]}></Flex>
            </KeyboardAwareScrollView>
            {isSolo ? null : (
              <Flex
                direction="row"
                style={[
                  st.bgDarkBlue,
                  st.w100,
                  st.ph4,
                  {
                    paddingBottom: isKeyboardVisible ? 0 : insets.bottom,
                    maxHeight: 140,
                  },
                ]}
                align="center"
                justify="center"
              >
                <MainMessagingInput adventure={adventure} step={currentStep} />
              </Flex>
            )}
          </>
        )}
      </Flex>
    </KeyboardAvoidingView>
  );
}

export default AdventureStepModal;
