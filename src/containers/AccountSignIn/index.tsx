import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
  View,
  ScrollView,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/stack';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import useKeyboard from '@rnhooks/keyboard';

import { useMount, lockToPortrait } from '../../utils';
import { userLogin, facebookLogin } from '../../actions/auth';
import DismissKeyboardView from '../../components/DismissKeyboardHOC';
import VokeIcon from '../../components/VokeIcon';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';

import styles from './styles';

type Props = {
  layout: string;
  parentScroll: object;
  scrollTo: number;
  onComplete: any;
};

const AccountSignIn: React.FC = ({
  layout,
  parentScroll,
  scrollTo,
  onComplete = false,
}: Props): React.ReactElement => {
  const scrollRef = useRef<ScrollView>();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const headerHeight = useHeaderHeight();

  const [formIsVisible, setFormIsVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  // https://github.com/react-native-hooks/keyboard#configuration
  const [isKeyboardVisible] = useKeyboard();

  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('forgotPassword:invalid'))
      .required(t('required')),
    // According to Voke API, password should be at least 8 characters long.
    password: Yup.string().min(8, t('shortPassword')).required(t('required')),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SigninSchema,
    onSubmit: async values => {
      await login();
      //  console.log(JSON.stringify(values, null, 2));
    },
  });

  useMount(() => {
    lockToPortrait();
  });

  const login = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await dispatch(userLogin(formik.values.email, formik.values.password));
      setIsLoading(false);
      if (onComplete) {
        onComplete();
      } else {
        navigation.navigate('LoggedInApp');
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('🛑 Error on login \n', { e });
      if (e?.message === 'Network request failed') {
        Alert.alert(e?.message, t('checkInternet'));
      } else {
        Alert.alert(
          t('login:invalid'),
          t('login:enterValid'),
          // e.error_description ? e.error_description : e.errors[0]
        );
      }

      setIsLoading(false);
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
        'Facebook authentication is not available at this moment',
      );
    } else {
      navigation.navigate('LoggedInApp');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{
        backgroundColor: theme.colors.primary,
        flex: 1,
      }}
    >
      <ScrollView
        ref={scroll => {
          if (!scrollRef?.current && scroll) {
            scrollRef.current = scroll;
          }
        }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'space-evenly',
          minHeight: isKeyboardVisible ? 'auto' : '100%',
        }}
      >
        <DismissKeyboardView>
          <SafeAreaView>
            {/* SECTION: SIGN IN OPTIONS */}
            <Flex style={styles.signInOptions}>
              {layout !== 'embed' && (
                <View style={{ minHeight: theme.spacing.xxxl }} />
              )}
              {!formIsVisible && (
                <>
                  <Button
                    isAndroidOpacity
                    style={styles.buttonSignInPrimary}
                    onPress={(): void => {
                      setFormIsVisible(true);
                      emailRef?.current?.focus();
                      setTimeout(() => {
                        emailRef?.current?.focus();
                      }, 400);
                    }}
                  >
                    <Flex direction="row" align="center" justify="center">
                      <VokeIcon
                        name="mail"
                        size={22}
                        style={styles.buttonSignInIconPrimary}
                      />
                      <Text style={styles.buttonSignInLabelPrimary}>
                        {t('signInEmail')}
                      </Text>
                    </Flex>
                  </Button>
                </>
              )}
              {formIsVisible && (
                <Flex style={[styles.primaryContent]}>
                  {/* <View style={{ minHeight: theme.spacing.xxl }} /> */}
                  {/* INPUT FIELD: EMAIL */}
                  <TextField
                    // blurOnSubmit={false}
                    ref={emailRef}
                    label={t('placeholder:email')}
                    onSubmitEditing={(): void => passwordRef?.current?.focus()}
                    placeholder={t('placeholder:email')}
                    // value={email}
                    value={formik.values.email}
                    // onChangeText={checkEmail}
                    onChangeText={formik.handleChange('email')}
                    onBlur={formik.handleBlur('email')}
                    onFocus={() => {
                      if (Platform.OS === 'ios' && parentScroll?.current && scrollTo) {
                        // Android do that all for us automatically.
                        // Need timeout for Keyboard to appear and scroll become available
                        setTimeout(() => {
                          parentScroll?.current
                            ?.getScrollResponder()
                            .scrollTo({x: 0, y: scrollTo, animated: true});
                        }, 400);
                      }
                    }}
                    autoCapitalize="none"
                    textContentType="username"
                    autoCompleteType="email"
                    keyboardType="email-address"
                    returnKeyType="next"
                    error={
                      formik.touched.email && formik.errors.email
                        ? formik.errors.email
                        : null
                    }
                    testID={'inputEmail'}
                  />
                  {/* INPUT FIELD: PASSWORD */}
                  <TextField
                    ref={passwordRef}
                    // blurOnSubmit={true}
                    label={t('placeholder:password')}
                    placeholder={t('placeholder:password')}
                    // value={password}
                    value={formik.values.password}
                    // onChangeText={(text: string): void => setPassword(text)}
                    onChangeText={formik.handleChange('password')}
                    onBlur={formik.handleBlur('password')}
                    secureTextEntry
                    textContentType="password"
                    autoCompleteType="password"
                    returnKeyType="send"
                    onSubmitEditing={formik.handleSubmit}
                    error={
                      formik.touched.password && formik.errors.password
                        ? formik.errors.password
                        : null
                    }
                    testID={'inputPassword'}
                  />
                  <Flex
                    style={{
                      minHeight: theme.spacing.xl,
                    }}
                  />
                  {/* BUTTON: SIGN IN */}
                  <Button
                    onPress={formik.handleSubmit}
                    // onPress={(): Promise<void> => login()}
                    touchableStyle={[
                      st.pd4,
                      st.br1,
                      st.w(st.fullWidth - 70),
                      {
                        backgroundColor: theme.colors.white,
                        textAlign: 'center',
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowOpacity: 0.5,
                        elevation: 4,
                        shadowRadius: 5,
                        shadowOffset: { width: 1, height: 8 },
                      },
                    ]}
                    isLoading={isLoading}
                    testID={'ctaSignInNow'}
                  >
                    <Text
                      style={[
                        st.fs20,
                        st.tac,
                        { color: theme.colors.secondary },
                      ]}
                    >
                      {t('signIn')}
                    </Text>
                  </Button>
                  {/* TEXT: FORGOT PASSWORD */}
                  <Text
                    style={styles.link}
                    onPress={(): void => navigation.navigate('ForgotPassword')}
                  >
                    {t('forgotPassword')}
                  </Text>
                  <Flex style={{ minHeight: theme.spacing.xxl }} />
                </Flex>
              )}
              <View style={{ minHeight: theme.spacing.m }} />
              <Button
                isAndroidOpacity
                style={styles.ButtonSignIn}
                onPress={(): Promise<void> => fbLogin()}
              >
                <Flex direction="row" align="center" justify="center">
                  <VokeIcon name="apple" size={22} style={[st.mr5, st.white]} />
                  <Text style={styles.ButtonSignInLabel}>
                    {t('signInApple')}
                  </Text>
                </Flex>
              </Button>
              <View style={{ minHeight: theme.spacing.m }} />
              <Button
                isAndroidOpacity
                style={styles.ButtonSignIn}
                onPress={(): Promise<void> => fbLogin()}
              >
                <Flex direction="row" align="center" justify="center">
                  <VokeIcon
                    name="logo-facebook"
                    size={22}
                    style={[st.mr5, st.white]}
                  />
                  <Text style={styles.ButtonSignInLabel}>{t('signInFb')}</Text>
                </Flex>
              </Button>
            </Flex>
            <View style={{ minHeight: theme.spacing.xl }} />
            {/* TEXT: NOTICE */}
            {/* TODO: hide this notice if it's on the welcome stage (no progress) */}
            <Flex
              direction="column"
              justify="start"
              style={styles.sectionNotice}
            >
              <Text style={styles.textMedium}>
                {t('login:existingAccount')}
              </Text>
            </Flex>
            {/* <View style={{ minHeight: theme.spacing.xl }} /> */}
            <View
              style={{
                justifyContent: 'center', // Vertical.
              }}
            >
              {/* <Flex
                  style={{
                    minHeight: 20,
                  }}
                /> */}
              {/* Safe area at the bottom for phone with exotic notches */}
              {/* <Flex
                  style={{
                    minHeight: isKeyboardVisible
                      ? 0
                      : theme.spacing.xl + insets.bottom,
                  }}
                /> */}
            </View>
          </SafeAreaView>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountSignIn;
