import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { userLogin, facebookLogin } from '../../actions/auth';
import { useMount, lockToPortrait } from '../../utils';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import VokeIcon from '../../components/VokeIcon';
import TextField from '../../components/TextField';
import Triangle from '../../components/Triangle';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import styles from './styles';
import CONSTANTS from '../../constants';

const AccountSignIn: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  useMount(() => {
    lockToPortrait();
  });

  const checkEmail = (text: string): void => {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    if (emailValidation) {
      setEmailValid(true);
    }
    setEmail(text);
  };

  const login = async (): Promise<void> => {
    // According to Voke API, password should be at least 8 characters long.
    if (emailValid && password.length > 7) {
      setIsLoading(true);

      try {
        await dispatch(userLogin(email, password)); // Then try to login.
        setIsLoading(false);
        navigation.navigate('LoggedInApp');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('🛑 Error on login \n', { e });
        Alert.alert(
          "Can't Login",
          e.error_description ? e.error_description : e.errors[0]
        );
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        'Invalid email/password',
        'Please enter a valid email and password'
      );
    }
  };

  // Facebook Login.
  const fbLogin = async (): Promise<void> => {
    setIsLoading(true);
    const userId = await dispatch(facebookLogin());
    setIsLoading(false);
    if (!userId) {
      Alert.alert(
        "Can't sign in with Facebook",
        'Facebook authentication is not available at this moment'
      );
    } else {
      navigation.navigate('LoggedInApp');
    }
  };

  return (
    <DismissKeyboardView
      style={{ backgroundColor: styles.colors.secondary, height: '100%' }}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}

      {/* Makes possible to hide keyboard when tapping outside. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // TODO: Verify!
        style={styles.MainContainer}
      >
        <Flex
          value={4}
          direction="column"
          align="center"
          justify="center"
          style={[styles.PrimaryContent, { paddingTop: insets.top + 30 }]}
        >
          {/* INPUT FIELD: EMAIL */}
          <TextField
            // blurOnSubmit={false}
            label="Email"
            onSubmitEditing={(): void => passwordRef?.current?.focus()}
            placeholder="Email"
            value={email}
            onChangeText={checkEmail}
            autoCapitalize="none"
            textContentType="emailAddress"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
          />
          {/* INPUT FIELD: PASSWORD */}
          <TextField
            ref={passwordRef}
            // blurOnSubmit={true}
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={(text: string): void => setPassword(text)}
            secureTextEntry
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="send"
            onSubmitEditing={(): Promise<void> => login()}
          />
        </Flex>
        {/* TRIANGLE DIVIDER */}
        <Flex value={1} justify="end" style={styles.Divider}>
          <Triangle
            width={useWindowDimensions().width}
            height={40}
            color={styles.colors.secondary}
          />
        </Flex>
        {/* SECTION: CALL TO ACTION BUTTON */}
        <Flex
          value={2}
          direction="column"
          justify="start"
          style={styles.SectionAction}
        >
          {/* BUTTON: SIGN IN */}
          <Button
            isAndroidOpacity
            style={styles.ButtonStart}
            onPress={(): Promise<void> => login()}
            isLoading={isLoading}
          >
            <Text style={styles.ButtonStartLabel}>Sign In</Text>
          </Button>
          {/* TEXT: FORGOT PASSWORD */}
          <Text
            style={styles.Link}
            onPress={(): void => navigation.navigate('ForgotPassword')}
          >
            Forgot Password?
          </Text>
        </Flex>
      </KeyboardAvoidingView>
      {/* TEXT: NOTICE */}
      {/* TODO: hide this notice if it's on the welcome stage (no progress) */}
      <Flex direction="column" justify="start" style={styles.SectionNotice}>
        <Text style={styles.TextSmall}>
          Successful login to an existing account will merge your current
          progress with saved data.
        </Text>
      </Flex>
      {/* SECTION: FACEBOOK SIGN IN */}
      <Flex
        direction="row"
        align="center"
        justify="center"
        style={styles.SectionFB}
      >
        <Button
          isAndroidOpacity
          style={styles.ButtonFBSignIn}
          onPress={(): Promise<void> => fbLogin()}
        >
          <Flex direction="row" align="center" justify="center">
            <VokeIcon
              type="image"
              name="facebook"
              style={styles.ButtonFBSignInIcon}
            />
            <Text style={styles.ButtonFBSignInLabel}>
              Sign In with Facebook
            </Text>
          </Flex>
        </Button>
      </Flex>

      {/* Safe area at the bottom for phone with exotic notches */}
      <Flex
        style={{
          paddingBottom: insets.bottom,
        }}
      />
    </DismissKeyboardView>
  );
};

export default AccountSignIn;
