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
import BotTalking from '../../components/BotTalking';
import st from '../../st';
import styles from './styles';
import theme from '../../theme';


const AccountName = ( props ): React.ReactElement => {
  const onComplete = props?.route?.params?.onComplete;
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
      setTopMargin(-300);
    } else {
      setTopMargin(60);
    }
    refBotBlock?.current?.animateNextTransition();
  }, [isKeyboardVisible]);

  const nextScreen = ( screenName = 'AccountPhoto' ) => {
    if (onComplete) {
      return onComplete();
    } else {
      return navigation.navigate(screenName);
    }
  }

  const handleContinue = async () => {
    if (!firstName || firstName.length < 1) {
      return Alert.alert(
        'Please provide your first name',
        'We need at least your first name so your friends know who you are',
      );
    }
    if (firstName === initialFirstName && lastName === initialLastName && isLoggedIn) {
      // Nothing changed
      return nextScreen();
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
    return nextScreen();
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
              <BotTalking heading="Hello!">I’m Vokebot, I'm glad you're here.</BotTalking>
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
          <Flex direction="row" justify="center" style={[st.w100, st.mt1]}/>
          <Flex value={1} align="center">
          <Button
            onPress={handleContinue}
            touchableStyle={[st.pd4, st.br1, st.w(st.fullWidth - 70),{backgroundColor: theme.colors.white, textAlign:"center", marginTop: isKeyboardVisible ? 70 : 20 ,}]}
            isLoading={isLoading}
          >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>Next</Text>
          </Button>
            {/* Safety spacing. */}
            <Flex style={{ height: (isKeyboardVisible ? 0 : insets.bottom ) }} />
          </Flex>
        </Flex>
      </KeyboardAvoidingView>
    </DismissKeyboardView>
  );
};

export default AccountName;
