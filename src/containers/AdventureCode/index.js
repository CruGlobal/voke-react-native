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
import BotTalking from '../../components/BotTalking'
import VokeIcon from '../../components/VokeIcon';
import st from '../../st';
import Button from '../../components/Button';
import { toastAction } from '../../actions/info';

// import { MONTHLY_PRICE } from '../../constants';
import theme from '../../theme';

import Touchable from '../../components/Touchable';
import { acceptAdventureInvitation } from '../../actions/requests';

function AdventureCode(props) {
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
      } catch (error) {
        dispatch(toastAction( 'Invalid code', 'short' ));
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
        <Flex direction="column" justify="center" style={[st.w100, st.h100]}>
          <Flex direction="column" style={[st.mt1]}>
            <BotTalking heading="Have a code from a friend?">Easily join your friend with an 
adventure invite Code.
</BotTalking>
            <Flex direction="column" align="center" style={[st.ph1, st.w100]}>
            <NameInput
                blurOnSubmit
                label="Adventure Code"
                placeholder="00000"
                value={adventureCode}
                onChangeText={text => setAdventureCode(text)}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
                keyboardType="number-pad"
              />
            </Flex>
          </Flex>
          <Flex direction="row" justify="center" style={[st.w100, st.mt2]}/>
          <Flex value={1} align="center">
          <Button
            onPress={handleContinue}
            touchableStyle={[st.pd4, st.br1, st.mb3, st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center"}]}
            isLoading={isLoading}
          >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>Continue</Text>
            {/* Safety spacing. */}
            <Flex style={{ height: (isKeyboardVisible ? 0 : insets.bottom ) }} />
          </Button>
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </>
  );
}

export default AdventureCode;
