/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useRef, useEffect } from 'react';
import { Platform, Alert, KeyboardAvoidingView } from 'react-native';
import {
  Transitioning,
  Transition,
  TransitioningView,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import useKeyboard from '@rnhooks/keyboard';
import { RootState } from '../../reducers';
import { createAccount, updateMe } from '../../actions/auth';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import Triangle from '../../components/Triangle';
import NameInput from '../../components/NameInput';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import Image from '../../components/Image';
import st from '../../st';
import styles from './styles';

import VOKE_BOT from '../../assets/voke_bot_face_large.png';

const AccountName: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // State:
  const initialFirstName = useSelector(
    ({ auth }: RootState) => auth.user.firstName,
  );
  const initialLastName = useSelector(
    ({ auth }: RootState) => auth.user.lastName,
  );
  const isLoggedIn = useSelector(({ auth }: RootState) => auth.isLoggedIn);
  // Hooks:
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const lastNameRef = useRef(null);
  const [topMargin, setTopMargin] = useState(0);
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard({
    useWillShow: true,
    useWillHide: true,
  });

  // const refBotBlock = useRef();
  const refBotBlock = useRef<TransitioningView>(null);

  // const transition = <Transition.Change interpolation="easeInOut" />;
  const transition = (
    <Transition.Together>
      <Transition.Change interpolation="easeInOut" />
    </Transition.Together>
  );

  useEffect(() => {
    if (isKeyboardVisible) {
      setTopMargin(-250);
    } else {
      setTopMargin(100);
    }
    refBotBlock?.current?.animateNextTransition();
  }, [isKeyboardVisible]);

  const handleContinue = async () => {
    if (!firstName || firstName.length < 1) {
      return Alert.alert(
        'Please provide your first name',
        'We need at least your first name so your friends know who you are',
      );
    }
    if (firstName === initialFirstName && lastName === initialLastName) {
      // Nothing changed
      return navigation.navigate('AccountPhoto');
    }
    setIsLoading(true);

    if (!isLoggedIn) {
      // Create New Account.
      await dispatch(
        createAccount({
          first_name: firstName,
          last_name: lastName,
        }),
      );
    } else {
      try {
        // Update Existing Account.
        await dispatch(
          updateMe({
            first_name: firstName,
            last_name: lastName,
          }),
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log("🛑 Error updating the user's details \n", e);
        Alert.alert(e.error_description ? e.error_description : e.errors[0]);
      }
    }

    setIsLoading(false);
    // Go to the next screen.
    return navigation.navigate('AccountPhoto');
  };

  return (
    <DismissKeyboardView style={styles.colors.primary}>
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}

      {/* Makes possible to hide keyboard when tapping outside. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // TODO: Verify!
        style={[{ paddingTop: insets.top }, styles.container.default]}
      >
        <Flex direction="column" justify="end" style={styles.MainContainer}>
          <Transitioning.View
            ref={refBotBlock}
            transition={transition}
            style={{
              marginTop: topMargin,
            }}
          >
            <Flex
              direction="row"
              align="start"
              justify="between"
              style={[st.h(180)]}
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
                    {initialFirstName
                      ? 'Please confirm your name'
                      : 'Hi! My name is Vokebot. What is your name?'}
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
          </Transitioning.View>

          <Flex
            value={1}
            direction="column"
            align="center"
            justify="flex-start"
            self="stretch"
            style={[
              st.ph1,
              st.w100,
              { paddingTop: isKeyboardVisible ? 120 : 0 },
            ]}
          >
            <NameInput
              blurOnSubmit={false}
              label="First Name (Required)"
              onSubmitEditing={() => lastNameRef.current.focus()}
              placeholder="First"
              value={firstName}
              onChangeText={text => setFirstName(text)}
              returnKeyType="next"
            />
            <NameInput
              ref={lastNameRef}
              blurOnSubmit
              label="Last Name"
              placeholder="Last"
              value={lastName}
              onChangeText={text => setLastName(text)}
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </Flex>
          <Button
            onPress={handleContinue}
            touchableStyle={[st.w100, st.p4, {backgroundColor: styles.colors.secondary}]}
            isLoading={isLoading}
          >
            <Text style={[st.white, st.fs20, st.tac]}>Continue</Text>
            {/* Safety spacing. */}
            <Flex style={{ height: (isKeyboardVisible ? 0 : insets.bottom ) }} />
          </Button>
        </Flex>
      </KeyboardAvoidingView>
    </DismissKeyboardView>
  );
};

export default AccountName;
