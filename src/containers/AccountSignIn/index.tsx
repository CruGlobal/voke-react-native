import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { userLogin, facebookLogin } from '../../actions/auth';
import { useMount, lockToPortrait } from '../../utils';
import { useTranslation } from "react-i18next";
import useKeyboard from '@rnhooks/keyboard';

import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import VokeIcon from '../../components/VokeIcon';
import TextField from '../../components/TextField';
import Triangle from '../../components/Triangle';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import styles from './styles';
import CONSTANTS from '../../constants';
import st from '../../st';
import theme from '../../theme';

const AccountSignIn: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const passwordRef = useRef<TextInput>(null);

  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();

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
          t('login:invalid'),
          t('login:enterValid')
          // e.error_description ? e.error_description : e.errors[0]
        );
        setIsLoading(false);
      }
    } else {
      Alert.alert(
        t('login:invalid'),
        t('login:enterValid')
      );
    }
  };

  // Facebook Login.
  // TODO: Create FB Button component.
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
      style={{
        backgroundColor: styles.colors.primary,
        // flex:1,
        // flexGrow: 1,
        // justifyContent: 'center',
        // align: 'center',
        height:'100%',
        // flexDirection:'column',
        // alignContent: 'stretch',
        // alignItems: 'stretch',
      }}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}

      {/* Makes possible to hide keyboard when tapping outside. */}
     {/*  <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'} // TODO: Verify!
        style={[
          // styles.MainContainer,
        {
          position: 'absolute',
          // flexGrow: 1,
          flex:2,
          // flexDirection:'column',
          // alignItems: 'stretch',
          // alignContent: 'stretch',
          backgroundColor: 'green',
          // height: isKeyboardVisible ? '100%' : 'auto',
          // height: '100%',
        }]}

        // keyboardVerticalOffset={headerHeight}
      > */}
        <Flex
          // value={2}
          // direction="column"
          // align="center"
          // justify="center"
          style={[styles.PrimaryContent, {
            paddingTop: insets.top + headerHeight,
          }]}
        >
          {/* INPUT FIELD: EMAIL */}
          <TextField
            // blurOnSubmit={false}
            label={t('placeholder:email')}
            onSubmitEditing={(): void => passwordRef?.current?.focus()}
            placeholder={t('placeholder:email')}
            value={email}
            onChangeText={checkEmail}
            autoCapitalize="none"
            textContentType="username"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
          />
          {/* INPUT FIELD: PASSWORD */}
          <TextField
            ref={passwordRef}
            // blurOnSubmit={true}
            label={t('placeholder:password')}
            placeholder={t('placeholder:password')}
            value={password}
            onChangeText={(text: string): void => setPassword(text)}
            secureTextEntry
            textContentType="password"
            autoCompleteType="password"
            returnKeyType="send"
            onSubmitEditing={(): Promise<void> => login()}
          />
        {/* </Flex> */}

        <Flex
            style={{
              minHeight: 40,
            }}
          />

          {/* BUTTON: SIGN IN */}
          <Button
            onPress={(): Promise<void> => login()}
            touchableStyle={[
              st.pd4,
              st.br1,
              st.w(st.fullWidth - 70),
              {
                backgroundColor: theme.colors.white,
                textAlign:"center",
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOpacity: 0.5,
                elevation: 4,
                shadowRadius: 5 ,
                shadowOffset : { width: 1, height: 8}
              }
            ]}
            isLoading={isLoading}
          >
            <Text style={[st.fs20, st.tac, {color:theme.colors.secondary}]}>{t('signIn')}</Text>
          </Button>
          {/* TEXT: FORGOT PASSWORD */}
          <Text
            style={styles.Link}
            onPress={(): void => navigation.navigate('ForgotPassword')}
          >
            {t('forgotPassword')}
          </Text>
        </Flex>
      {/* </KeyboardAvoidingView> */}
      {
      <View style={{flex:1, opacity: isKeyboardVisible ? 0 : 1, }}>
        {/* TEXT: NOTICE */}
        {/* TODO: hide this notice if it's on the welcome stage (no progress) */}
        <Flex direction="column" justify="start" style={styles.SectionNotice}>
          <Text style={styles.TextMedium}>
            {t('login:existingAccount')}
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
                        name="logo-facebook"
                        size={22}
                        style={st.mr5}
                      />
              <Text style={styles.ButtonFBSignInLabel}>
                {t('signInFb')}
              </Text>
            </Flex>
          </Button>
          {/* Safe area at the bottom for phone with exotic notches */}
          <Flex
            style={{
              paddingBottom: insets.bottom,
            }}
          />
        </Flex>
      </View>}
    </DismissKeyboardView>
  );
};

export default AccountSignIn;
