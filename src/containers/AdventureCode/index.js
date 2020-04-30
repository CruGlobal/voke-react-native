import React, { useState, useRef, useEffect } from 'react';
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
// import { MONTHLY_PRICE } from '../../constants';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';
import Touchable from '../../components/Touchable';
import { acceptAdventureInvitation } from '../../actions/requests';

function AdventureCode(props) {
  console.log('📟Container > EnterAdventureCode:');
  const insets = useSafeArea();
  const navigation = useNavigation();
  const [adventureCode, setAdventureCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
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

  async function handleContinue() {
    if (adventureCode.length > 3) {
      try {
        setIsLoading(true);

        const newAdventure = await dispatch(
          acceptAdventureInvitation(adventureCode),
        );
        const isGroup = newAdventure.kind === 'multiple';
        if (isGroup) {
          navigation.navigate('GroupModal', {
            adventure: newAdventure || {},
          });
        } else {
          navigation.goBack();
          // TODO: GO STRAIGHT INTO ADVENTURE
        }
      } finally {
        setIsLoading(false);
      }
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
            <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
              <NameInput
                blurOnSubmit
                label="Have a code from a friend?"
                placeholder="Adventure Code"
                value={adventureCode}
                onChangeText={text => setAdventureCode(text)}
                returnKeyType="done"
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

export default AdventureCode;
