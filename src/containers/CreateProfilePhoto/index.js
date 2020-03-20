import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import Image from '../../components/Image';
import StatusBar from '../../components/StatusBar';
import Triangle from '../../components/Triangle';
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
// import { MONTHLY_PRICE } from '../../constants';
import { useDispatch } from 'react-redux';
import {
  logoutAction,
  loginAction,
  login,
  register,
  passwordReset,
} from '../../actions/auth';
import {
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Alert,
  Keyboard,
} from 'react-native';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';

function CreateProfilePhoto(props) {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loginLoading, setLoginLoading] = useState(false);

  function handleContinue() {
    dispatch(loginAction({ id: 123 }));
    return;

    if (isValidLoginInfo()) {
      try {
        setLoginLoading(true);
        dispatch(login(firstName, lastName));
      } finally {
        setLoginLoading(false);
      }
    } else {
      Alert.alert(
        'Login Failed',
        'Email or password are too short. Please try again.',
      );
    }
  }

  return (
    <Flex
      style={[
        st.aic,
        st.w100,
        st.jcsb,
        { opacity: loginLoading ? 0 : 1 },
        st.bgBlue,
        { paddingTop: insets.top },
      ]}
    >
      <StatusBar />
      <Flex direction="column" justify="end" style={[st.w100, st.h100]}>
        <Flex direction="row" justify="between">
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
          <Touchable style={[st.p5, st.pl4, st.mb3]} onPress={handleContinue}>
            <Text style={[st.white, st.fs16, st.pr5]}>Skip</Text>
          </Touchable>
        </Flex>
        <Flex direction="column" self="stretch" align="center">
          <Flex
            direction="row"
            align="start"
            justify="between"
            style={[st.mb4, st.h(180)]}
          >
            <Flex
              direction="column"
              value={1}
              justify="start"
              align="end"
              style={[st.pl1]}
            >
              <Flex style={[st.bgOffBlue, st.ph3, st.pv5, st.br5]}>
                <Text style={[st.white, st.fs20, st.tac]}>
                  Add a photo so your friends can recognize you
                </Text>
              </Flex>
              <Triangle
                width={20}
                height={15}
                color={st.colors.offBlue}
                style={[st.rotate(120), st.mt(-6)]}
              />
            </Flex>
            <Flex justify="end" self="stretch" style={[]}>
              <Image
                source={VOKE_BOT}
                resizeMode="contain"
                style={[st.w(80), st.h(120)]}
              />
            </Flex>
          </Flex>
          <Flex
            direction="column"
            align="center"
            justify="center"
            style={[
              st.w(st.fullWidth / 1.8),
              st.h(st.fullWidth / 1.8),
              st.bgOffBlue,
              { borderRadius: st.fullWidth / 1.8 },
            ]}
          >
            <VokeIcon type="image" name="camera" style={[st.w(70), st.h(70)]} />
          </Flex>
        </Flex>
        <Flex value={1} />
        <Button
          onPress={handleContinue}
          touchableStyle={[
            st.w100,
            st.bgDarkBlue,
            st.p4,
            { paddingBottom: insets.bottom },
          ]}
        >
          <Text style={[st.white, st.fs20, st.tac]}>Continue</Text>
        </Button>
      </Flex>
    </Flex>
  );
}

export default CreateProfilePhoto;
