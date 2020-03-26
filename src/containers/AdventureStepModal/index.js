import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import Button from '../../components/Button';
import AdventureStepMessage from '../../components/AdventureStepMessage';
import AdventureStepMessageInput from '../../components/AdventureStepMessageInput';
import Image from '../../components/Image';
import VokeIcon from '../../components/VokeIcon';
import {
  ScrollView,
  Linking,
  FlatList,
  KeyboardAvoidingView,
  Keyboard,
  TextInput,
} from 'react-native';
import { MONTHLY_PRICE, VIDEO_HEIGHT, REDUX_ACTIONS } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAction } from '../../actions/auth';
import ModalBackButton from '../../components/ModalBackButton';
import Video from '../../components/Video';
import { useNavigation } from '@react-navigation/native';
import { useMount } from '../../utils';
import {
  getAdventureSteps,
  getAdventureStepMessages,
} from '../../actions/requests';
import AdventureStepCard from '../../components/AdventureStepCard';

function AdventureStepModal(props) {
  const dispatch = useDispatch();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [isLandscape, setIsLandscape] = useState(false);
  const { step, adventure } = props.route.params;
  const [inputHeight, setInputHeight] = useState(0);
  const [text, setText] = useState('');
  const me = useSelector(({ auth }) => auth.user);
  const messages = useSelector(({ data }) => data.adventureStepMessages);
  const [currentMessages, setCurrentMessages] = useState(
    messages[step.id] || [],
  );

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  let bottomInputHeight = {
    height: inputHeight < 45 ? 45 : inputHeight > 140 ? 140 : inputHeight,
  };

  let newWrap = {
    height: inputHeight.height,
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useMount(() => {
    dispatch(getAdventureStepMessages(adventure.conversation.id, step.id));
  });
  useEffect(() => {
    setCurrentMessages(messages[step.id]);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[st.aic, st.w100, st.jcsb, st.bgBlue]}
    >
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        <Video
          onOrientationChange={orientation =>
            orientation === 'portrait'
              ? setIsLandscape(false)
              : setIsLandscape(true)
          }
        />
        {isLandscape ? null : (
          <>
            {step.status_message ? (
              <Flex
                align="center"
                style={[st.bgDarkBlue, st.ph1, st.pv4, st.ovh]}
              >
                <Text style={[st.fs4, st.white]}>{step.status_message}</Text>
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
            <Flex direction="column" style={[st.w80, st.mh1, st.mt4]}>
              <Flex
                direction="column"
                style={[st.w100, st.bgOrange, st.brtl5, st.brtr5, st.pd1]}
                align="center"
                justify="center"
              >
                <Text style={[st.tac, st.white, st.fs20, st.lh(24)]}>
                  {step.question}
                </Text>
              </Flex>
              <Image
                source={{ uri: me.avatar.small }}
                size={25}
                style={[st.absb, st.right(-30)]}
              />
              <AdventureStepMessageInput
                kind={step.kind}
                adventure={adventure}
                stepp={step}
              />
            </Flex>
            <FlatList
              renderItem={props => (
                <AdventureStepMessage
                  {...props}
                  adventure={adventure}
                  step={step}
                />
              )}
              data={currentMessages}
              style={[
                st.w(st.fullWidth),
                st.pt4,
                st.bgBlue,
                { paddingBottom: insets.bottom },
              ]}
              removeClippedSubviews={true}
            />

            <Flex
              direction="row"
              style={[
                newWrap,
                st.bgDarkBlue,
                st.w100,
                st.ph4,
                { paddingBottom: isKeyboardVisible ? 50 : insets.bottom },
              ]}
              align="center"
              justify="center"
            >
              <Flex
                direction="row"
                style={[st.pl5, st.bgDarkBlue, inputHeight]}
                align="center"
                value={1}
              >
                <TextInput
                  ref={c => (this.chatInput = c)}
                  autoCapitalize="sentences"
                  returnKeyType="send"
                  blurOnSubmit={true}
                  onSubmitEditing={() => {}}
                  placeholder={'New Message'}
                  onChangeText={t => setText(t)}
                  placeholderTextColor={st.colors.blue}
                  underlineColorAndroid={st.colors.transparent}
                  onContentSizeChange={event =>
                    setInputHeight(event.nativeEvent.contentSize.height + 10)
                  }
                  style={[
                    st.f1,
                    st.white,
                    st.pv6,
                    st.mv6,
                    st.fs4,
                    inputHeight,
                    st.pt4,
                  ]}
                  selectionColor={st.colors.yellow}
                  autoCorrect={true}
                  multiline={true}
                />
                <Button style={[st.w(55), st.aie, st.pv6]} onPress={() => {}}>
                  <VokeIcon name="send_message" style={[st.white]} size={20} />
                </Button>
              </Flex>
            </Flex>
          </>
        )}
      </Flex>
    </KeyboardAvoidingView>
  );
}

export default AdventureStepModal;
