import React, { useState, useRef, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import NameInput from '../../components/NameInput';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';

import { KeyboardAvoidingView, Alert, Keyboard } from 'react-native';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';

function CreateName(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const lastNameRef = useRef(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

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

  const isValidLoginInfo = () => firstName.length > 0;

  function handleContinue() {
    if (isValidLoginInfo()) {
      try {
        setLoginLoading(true);
        navigation.navigate('CreateProfilePhoto', { firstName, lastName });
      } finally {
        setLoginLoading(false);
      }
    } else {
      Alert.alert(
        'Please provide your first name',
        'We need atleast your first name so your friends know who you are',
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
                name="buttonArrow"
                style={[st.rotate('180deg'), st.h(22), st.w(22)]}
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
                    Hi! My name is Vokebot. What is your name?
                  </Text>
                </Flex>
                <Triangle
                  width={20}
                  height={15}
                  color={st.colors.offBlue}
                  slant="down"
                  flip={true}
                  style={[st.rotate(90), st.mt(-6)]}
                />
              </Flex>
            </Flex>
            <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
              <NameInput
                blurOnSubmit={false}
                label="First Name (Required)"
                onSubmitEditing={() => lastNameRef.current.focus()}
                placeholder={'First'}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                returnKeyType={'next'}
              />
              <NameInput
                ref={lastNameRef}
                blurOnSubmit={true}
                label="Last Name"
                placeholder={'Last'}
                value={lastName}
                onChangeText={text => setLastName(text)}
                returnKeyType={'done'}
                onSubmitEditing={handleContinue}
              />
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
          >
            <Text style={[st.white, st.fs20, st.tac]}>Continue</Text>
          </Button>
        </Flex>
      </KeyboardAvoidingView>
    </>
  );
}

export default CreateName;
