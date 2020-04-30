import React, { useState, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { KeyboardAvoidingView, Alert, Keyboard } from 'react-native';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import NameInput from '../../components/NameInput';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';
import {
  sendAdventureInvitation,
  sendVideoInvitation,
} from '../../actions/requests';

function AdventureName(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [name, setName] = useState('');

  const { item, withGroup, isVideoInvite = false } = props.route.params;

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  const isValidName = () => name.length > 0;

  async function handleContinue() {
    if (isValidName()) {
      try {
        setIsLoading(true);
        console.log(item);
        let result;
        if (isVideoInvite) {
          result = await dispatch(
            sendVideoInvitation({
              name,
              item_id: `${item.id}`,
            }),
          );
        } else {
          result = await dispatch(
            sendAdventureInvitation({
              organization_journey_id: item.id,
              name,
              kind: withGroup ? 'multiple' : 'duo',
            }),
          );
        }
        navigation.navigate('AdventureShareCode', {
          invitation: result,
          withGroup,
          isVideoInvite,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        'Please provide a name',
        'We need a name so you can manage your adventures',
      );
    }
  }

  return (
    <>
      <StatusBar />
      <KeyboardAvoidingView
        behavior="padding"
        style={[
          st.aic,
          st.w100,
          st.jcsb,
          st.bgBlue,
          { paddingTop: insets.top },
        ]}
      >
        <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
          <Flex direction="column" self="stretch">
            <Touchable
              style={[st.p5, st.pl4, st.mb3]}
              onPress={() => navigation.goBack()}
            >
              <VokeIcon
                type="image"
                name="leftArrow"
                style={[st.h(22), st.w(22)]}
              />
            </Touchable>
            <Flex
              direction="row"
              align="start"
              justify="between"
              style={[st.mb4, st.h(180)]}
            >
              <Flex justify="end" self="stretch" style={[]}>
                <Image
                  source={VOKE_BOT}
                  resizeMode="contain"
                  style={[
                    st.w(80),
                    st.h(120),
                    { transform: [{ rotateY: '180deg' }] },
                  ]}
                />
              </Flex>
              <Flex
                direction="column"
                value={1}
                justify="start"
                style={[st.pr1]}
              >
                <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                  <Text style={[st.white, st.fs20, st.tac]}>
                    {withGroup
                      ? "What's the name of your group?"
                      : "What is your friend's name?"}
                  </Text>
                </Flex>
                <Triangle
                  width={20}
                  height={15}
                  color={st.colors.offBlue}
                  slant="down"
                  flip
                  style={[st.rotate(90), st.mt(-6)]}
                />
              </Flex>
            </Flex>
            <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
              <NameInput
                blurOnSubmit={false}
                label={withGroup ? 'Group Name' : 'First Name'}
                onSubmitEditing={handleContinue}
                placeholder={withGroup ? 'Group Name' : "Friend's Name"}
                value={name}
                onChangeText={text => setName(text)}
                returnKeyType="done"
              />
              <Touchable onPress={() => setShowHelp(!showHelp)}>
                <Text style={[st.offBlue, st.fs14, st.pt3, st.tac, st.ph1]}>
                  {showHelp
                    ? withGroup
                      ? 'We use the group name to onboard your friends and help you manage your groups'
                      : "We use your friend's name to help you know who responded to the videos you shared."
                    : 'Why do we need this?'}
                </Text>
              </Touchable>
            </Flex>
          </Flex>
          <Flex value={1} />
          <Button
            onPress={handleContinue}
            touchableStyle={[
              st.w100,
              st.bgDarkBlue,
              st.p4,
              { paddingBottom: isKeyboardVisible ? 15 : insets.bottom },
            ]}
            isLoading={isLoading}
          >
            <Text style={[st.white, st.fs20, st.tac]}>Continue</Text>
          </Button>
        </Flex>
      </KeyboardAvoidingView>
    </>
  );
}

export default AdventureName;
