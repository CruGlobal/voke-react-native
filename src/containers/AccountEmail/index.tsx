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
import { updateMe } from '../../actions/auth';
import { useMount, lockToPortrait } from '../../utils';
import { useTranslation } from "react-i18next";

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

const AccountEmailPass: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation(['common','placeholder', 'profile', 'forgotPassword', 'login', 'error']);

  const emailRef = useRef<TextInput>(null);
  const emailConfirmRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  useMount(() => {
    lockToPortrait();
    emailRef?.current?.focus();
  });

  const checkEmail = (text: string): void => {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    if (emailValidation) {
      setEmailValid(true);
    }
    setEmail(text);
  };

  const save = async (): Promise<void> => {

    const emailValidation = CONSTANTS.EMAIL_REGEX.test(email);
    const confirmEmailValidation = CONSTANTS.EMAIL_REGEX.test(confirmEmail);

    if (!emailValidation || !confirmEmailValidation) {
      Alert.alert(
        t('forgotPassword:invalid'),
      );
      return;
    } else if( email !== confirmEmail ) {
      Alert.alert(
        t('profile:emailsMatch'),
      );
      return;
    } else if( password.length <= 7 ) {
      // According to Voke API, password should be at least 8 characters long.
      Alert.alert(
        t('profile:passwordsLength'),
      );
      return;
    } else {
      setIsLoading(true);

      let data = {
        me: {
          // first_name: firstName,
          // last_name: lastName,
          email: email,
          current_password: password,
          // password: newPassword,
        },
      };

      console.log( "🐸 data:", data );

      try {
        const result = await dispatch(updateMe(data));
        console.log( "🐸 result:", result );
        /* .then(() => {
          this.resetState();
        })
        .catch(e => {
          if (e && e.errors && e.errors[0]) {
            Alert.alert(e.errors[0]);
          }
        }); */
        setIsLoading(false);
        navigation.navigate('AccountProfile');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('🛑 Error on email/pass change \n', { e });
        Alert.alert(
          t('error:error'),
          e?.errors[0]
        );
        setIsLoading(false);
      }
    }
  };

  return (
    <DismissKeyboardView
      style={{ backgroundColor: styles.colors.primary, height: '100%' }}
    >
      {/* <StatusBar /> <- TODO: Not sure why we need it here? */}

      {/* Makes possible to hide keyboard when tapping outside. */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // TODO: Verify!
        style={styles.MainContainer}
      >
        <Flex
          value={8}
          direction="column"
          align="center"
          justify="center"
          style={[styles.PrimaryContent]}
        >
          {/* INPUT FIELD: EMAIL */}
          <TextField
            ref={emailRef}
            // blurOnSubmit={false}
            label={t('placeholder:newEmail')}
            onSubmitEditing={(): void => emailConfirmRef?.current?.focus()}
            placeholder={t('placeholder:newEmail')}
            value={email}
            onChangeText={checkEmail}
            autoCapitalize="none"
            textContentType="username"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            autoFocus={true}
          />
          {/* INPUT FIELD: CONFIRM NEW EMAIL */}
          <TextField
            ref={emailConfirmRef}
            // blurOnSubmit={true}
            label={t('placeholder:confirmEmail')}
            placeholder={t('placeholder:confirmEmail')}
            value={confirmEmail}
            onChangeText={(text: string): void => setConfirmEmail(text)}
            onSubmitEditing={(): void => passwordRef?.current?.focus()}
            autoCapitalize="none"
            textContentType="username"
            autoCompleteType="email"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={(): void => passwordRef?.current?.focus()}
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
            onSubmitEditing={(): Promise<void> => save()}
          />
        </Flex>

        {/* SECTION: CALL TO ACTION BUTTON */}
        <Flex
          value={1}
          direction="column"
          justify="center"
          style={styles.SectionAction}
        >
          {/* BUTTON: SIGN IN */}
          <Button
            isAndroidOpacity
            touchableStyle={[st.pd4, st.br1, st.w(st.fullWidth - 80),{backgroundColor: theme.colors.white, textAlign:"center",shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0.5,
            elevation: 4,
            shadowRadius: 5 ,
            shadowOffset : { width: 1, height: 8}}]}
            onPress={(): Promise<void> => save()}
            isLoading={isLoading}
          >
            <Text style={styles.ButtonStartLabel}>{t('save')}</Text>
          </Button>
        </Flex>
      </KeyboardAvoidingView>
      {/* Safe area at the bottom for phone with exotic notches */}
      <Flex
        style={{
          paddingBottom: insets.bottom,
        }}
      />
    </DismissKeyboardView>
  );
};

export default AccountEmailPass;
