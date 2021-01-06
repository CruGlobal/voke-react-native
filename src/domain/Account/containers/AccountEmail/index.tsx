import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useKeyboard } from '@react-native-community/hooks';
import DismissKeyboardView from 'components/DismissKeyboardHOC';
import VokeIcon from 'components/VokeIcon';
import TextField from 'components/TextField';
import Triangle from 'components/Triangle';
import OldButton from 'components/OldButton';
import Flex from 'components/Flex';
import Text from 'components/Text';
import { updateMe } from 'actions/auth';
import theme from 'utils/theme';
import CONSTANTS from 'utils/constants';
import st from 'utils/st';
import { useMount, lockToPortrait } from 'utils';

import styles from './styles';

const AccountEmailPass: React.FC = (): React.ReactElement => {
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation([
    'common',
    'placeholder',
    'profile',
    'forgotPassword',
    'login',
    'error',
  ]);
  const [topMargin, setTopMargin] = useState(0);

  const emailRef = useRef<TextInput>(null);
  const emailConfirmRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const keyboard = useKeyboard();

  useEffect(() => {
    if (keyboard.keyboardShown) {
      setTopMargin(-50);
    } else {
      setTopMargin(0);
    }
  }, [keyboard.keyboardShown]);

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
      Alert.alert(t('forgotPassword:invalid'));
      return;
    } else if (email !== confirmEmail) {
      Alert.alert(t('profile:emailsMatch'));
      return;
    } else if (password.length <= 7) {
      // According to Voke API, password should be at least 8 characters long.
      Alert.alert(t('profile:passwordsLength'));
      return;
    } else {
      setIsLoading(true);

      const data = {
        me: {
          // first_name: firstName,
          // last_name: lastName,
          email: email,
          current_password: password,
          // password: newPassword,
        },
      };

      try {
        const result = await dispatch(updateMe(data));
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
        Alert.alert(t('error:error'), e?.errors[0]);
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: styles.colors.primary,
        flex: 1,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'space-evenly',
          minHeight: keyboard.keyboardShown ? 'auto' : '100%',
        }}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          <Flex
            style={[
              {
                alignItems: 'center', // Horizontal.
                justifyContent: 'center', // Vertical.
                flexGrow: 1,
              },
            ]}
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
                testID={'inputEmail'}
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
                testID={'inputEmailConfirm'}
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
                testID={'inputPassword'}
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
              <OldButton
                isAndroidOpacity
                touchableStyle={[
                  st.pd4,
                  st.br1,
                  st.w(st.fullWidth - 80),
                  {
                    backgroundColor: theme.colors.white,
                    textAlign: 'center',
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    // marginTop: keyboard.keyboardShown ? -120 : 0,
                    shadowOpacity: 0.5,
                    elevation: 4,
                    shadowRadius: 5,
                    shadowOffset: { width: 1, height: 8 },
                  },
                ]}
                onPress={(): Promise<void> => save()}
                isLoading={isLoading}
              >
                <Text style={styles.ButtonStartLabel}>{t('save')}</Text>
              </OldButton>
            </Flex>
            {/* Safe area at the bottom for phone with exotic notches */}
            <Flex style={{ height: keyboard.keyboardShown ? 0 : insets.bottom }} />
          </Flex>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountEmailPass;
