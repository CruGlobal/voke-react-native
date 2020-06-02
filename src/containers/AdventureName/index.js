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
import theme from '../../theme'
import BotTalking from '../../components/BotTalking';
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
        let result;
        if (isVideoInvite) {
          // TODO: check this scenario.
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
      } catch (error) {
        console.error(error)
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
        <Flex direction="column" justify="end" style={[st.h100]}>
          <Flex direction="column" self="stretch">
            <Touchable
              style={[st.pt5, st.mb3]}
              onPress={() => navigation.goBack()}
            >
              <VokeIcon
                name="chevron-back-outline"
                style={[st.fs18]}
              />
            </Touchable>
            <Flex
              direction="row"
              align="center"
              justify="center"
              style={[st.mb4, st.h(180)]}
            >
              <BotTalking heading={withGroup
                      ? "Let's name your group!"
                      : "What's your friend's name?"}> 
          </BotTalking>
        
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
                    : 'Why do we ask this?'}
                </Text>
              </Touchable>
            </Flex>
            </Flex>

          <Flex direction="row" justify="center" style={[st.w100, st.mt1]}/>
          <Flex value={1} align="center">
          <Button
            onPress={handleContinue}
            touchableStyle={[st.pd4, st.br1, st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center", marginTop: isKeyboardVisible ? 0 : 85}]}
            isLoading={isLoading}
          >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>Continue</Text>
           
          </Button>
           {/* Safety spacing. */}
            <Flex style={{ height: (isKeyboardVisible ? 0 : insets.bottom ) }} />
          </Flex>
          </Flex>
      </KeyboardAvoidingView>
    </>
  );
}

export default AdventureName;
