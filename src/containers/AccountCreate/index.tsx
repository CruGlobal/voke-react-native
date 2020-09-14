/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useRef, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getTimeZone, getCountry, getLocales } from 'react-native-localize';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import {
  Transitioning,
  Transition,
  TransitioningView,
} from 'react-native-reanimated';
import useKeyboard from '@rnhooks/keyboard';

import { userLogin, updateMe } from '../../actions/auth';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import TextField from '../../components/TextField';
import { useMount, lockToPortrait } from '../../utils';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';
import BotTalking from '../../components/BotTalking';
import CONSTANTS from '../../constants';
import VokeIcon from '../../components/VokeIcon';

import styles from './styles';

const AccountCreate: React.FC = (): React.ReactElement => {
  const { t } = useTranslation('signUp');
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const firstName = useSelector(({ auth }: any) => auth.user.firstName);
  const lastName = useSelector(({ auth }: any) => auth.user.lastName);

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);
  // const passwordRef = useRef<HTMLInputElement>(null);
  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard({
    useWillShow: Platform.OS === 'android' ? false : true,
    useWillHide: Platform.OS === 'android' ? false : true,
    // Not availabe on Android https://reactnative.dev/docs/keyboard#addlistener
  });
  // const refBotBlock = useRef();
  const refBotBlock = useRef<TransitioningView>(null);
  const headerHeight = useHeaderHeight();
  const { width, height } = Dimensions.get('window');

  // const transition = <Transition.Change interpolation="easeInOut" />;
  const transition = (
    <Transition.Together>
      <Transition.Change interpolation="easeInOut" />
    </Transition.Together>
  );

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

  const register = async (): Promise<void> => {
    // According to Voke API, password should be at least 8 characters long.
    if (emailValid && password.length > 7) {
      setIsLoading(true);

      try {
        await dispatch(
          // API docs: https://docs.vokeapp.com/#me-update-me
          updateMe({
            me: {
              first_name: firstName,
              last_name: lastName,
              email,
              password,
              timezone_name: getTimeZone(),
              country_code: getCountry(),
              language: {
                language_code: getLocales(),
              },
            },
          }),
        );
        setIsLoading(false);
        navigation.navigate('AccountProfile');
      } catch (e) {
        setIsLoading(false);
        // eslint-disable-next-line no-console
        console.log("🛑 Error updating the user's Email/Pass \n", e);
        Alert.alert(e.error_description ? e.error_description : e.errors[0]);
      }
    } else {
      setIsLoading(false);
      Alert.alert(t('login:invalid'), t('login:enterValid'));
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: styles.colors.primary,
        flex: 1,
        height: '100%',
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1, // Will break scrolling on Android
          // height:'100%', // Will break scrolling on Android
          flexDirection: 'column',
          // alignContent: 'stretch',
          justifyContent: 'flex-end',
        }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          {/* <StatusBar /> <- TODO: Not sure why we need it here? */}
          <Flex
            // direction="row"
            // align="end"
            // justify="end"
            style={{
              // flexShrink: 0,
              display: isKeyboardVisible ? 'none' : 'flex',
              // paddingTop: height > 800 ? theme.spacing.xl : 0,
              height: 240,
            }}
          >
            <BotTalking
              heading={t('profile:saveProgress')}
              style={{
                opacity: isKeyboardVisible ? 0 : 1,
              }}
            >
              {t('login:enterValid')}
            </BotTalking>
          </Flex>
          {/* Makes possible to hide keyboard when tapping outside. */}
          {/* <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // TODO: Verify!
              style={styles.MainContainer}
            > */}
          <Flex
            // value={1}
            direction="column"
            align="center"
            justify="center"
            style={{
              paddingTop: isKeyboardVisible ? theme.spacing.m : 0,
              paddingHorizontal: theme.spacing.xl,
            }}
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
              testID={"inputEmail"}
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
              onSubmitEditing={(): Promise<void> => register()}
              testID={"inputPassword"}
            />
            {/* SECTION: CALL TO ACTION BUTTON */}
            {/* BUTTON: SIGN UP */}
            <Button
              isAndroidOpacity
              style={[
                st.pd4,
                st.br1,
                st.w(st.fullWidth - 70),
                {
                  backgroundColor: theme.colors.white,
                  textAlign: 'center',
                  marginTop: 20,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                  shadowOpacity: 0.5,
                  elevation: 4,
                  shadowRadius: 5,
                  shadowOffset: { width: 1, height: 8 },
                },
              ]}
              onPress={(): Promise<void> => register()}
              isLoading={isLoading}
              testID={"ctaSignUp"}
            >
              <Text
                style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
              >
                {t('signUp')}
              </Text>
            </Button>
            {/* TEXT: NOTICE */}
            <Flex
              direction="column"
              justify="start"
              style={
                (styles.SectionNotice,
                {
                  paddingTop: theme.spacing.xl,
                  paddingBottom: theme.spacing.xl,
                })
              }
              // value={1}
            >
              {/* TEXT: TERMS OF SERVICE */}
              <Text style={[styles.TextSmall, { textAlign: 'center' }]}>
                {t('agreementCreate')}
                {'\n'}
                <Text
                  style={styles.Link}
                  onPress={(): void =>
                    Linking.openURL(CONSTANTS.WEB_URLS.PRIVACY)
                  }
                >
                  {t('privacy')}
                </Text>
                &nbsp; {t('and')} &nbsp;
                <Text
                  style={styles.Link}
                  onPress={(): void =>
                    Linking.openURL(CONSTANTS.WEB_URLS.TERMS)
                  }
                >
                  {t('tos')}
                </Text>
              </Text>
            </Flex>
          </Flex>
          {/* </KeyboardAvoidingView> */}

          {/* Safe area at the bottom for phone with exotic notches */}
          {/* <Flex
              style={{
                paddingBottom: insets.bottom,
              }}
            /> */}
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountCreate;
