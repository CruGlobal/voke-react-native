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
import { useSafeArea } from 'react-native-safe-area-context';
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
      navigation.navigate('LoggedInApp');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('🛑 Error on login \n', { e });
      if ( e?.message === 'Network request failed' ) {
        Alert.alert(
          e?.message,
          t('checkInternet')
        );
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
        backgroundColor: styles.colors.primary,
        // paddingTop: headerHeight,
        flex: 1,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'space-evenly',
          minHeight: isKeyboardVisible ? 'auto' : '100%',
        }}
      >
        <DismissKeyboardView
          style={{
            flex: 1,
          }}
        >
          <Flex
            style={[
              styles.PrimaryContent,
              {
                alignItems: 'center', // Horizontal.
                justifyContent: 'center', // Vertical.
                flexGrow: 1,
              },
            ]}
          >
            <Flex
              style={{
                minHeight: 40,
              }}
            />
            {/* INPUT FIELD: EMAIL */}
            <TextField
              // blurOnSubmit={false}
              label={t('placeholder:email')}
              onSubmitEditing={(): void => passwordRef?.current?.focus()}
              placeholder={t('placeholder:email')}
              // value={email}
              value={formik.values.email}
              // onChangeText={checkEmail}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
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
              testID={"inputPassword"}
            />
            <Flex
              style={{
                minHeight: 40,
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
                style={[st.fs20, st.tac, { color: theme.colors.secondary }]}
              >
                {t('signIn')}
              </Text>
            </Button>
            {/* TEXT: FORGOT PASSWORD */}
            <Text
              style={styles.Link}
              onPress={(): void => navigation.navigate('ForgotPassword')}
            >
              {t('forgotPassword')}
            </Text>
            <Flex
              style={{
                minHeight: 20,
              }}
            />
          </Flex>
          <View
            style={{
              justifyContent: 'center', // Vertical.
            }}
          >
            <Flex
              style={{
                minHeight: 20,
              }}
            />
            {/* TEXT: NOTICE */}
            {/* TODO: hide this notice if it's on the welcome stage (no progress) */}
            <Flex
              direction="column"
              justify="start"
              style={styles.SectionNotice}
            >
              <Text style={styles.TextMedium}>
                {t('login:existingAccount')}
              </Text>
            </Flex>
            {/* SECTION: FACEBOOK SIGN IN */}
            <Flex
              align="center"
              // justify="center"
              style={styles.SectionFB}
            >
              <Button
                isAndroidOpacity
                style={styles.ButtonFBSignIn}
                onPress={(): Promise<void> => fbLogin()}
              >
                <Flex direction="row" align="center" justify="center">
                  <VokeIcon name="logo-facebook" size={22} style={[st.mr5, st.white]} />
                  <Text style={styles.ButtonFBSignInLabel}>
                    {t('signInFb')}
                  </Text>
                </Flex>
              </Button>
              {/* Safe area at the bottom for phone with exotic notches */}
              <Flex
                style={{
                  minHeight: isKeyboardVisible
                    ? 0
                    : theme.spacing.xl + insets.bottom,
                }}
              />
            </Flex>
          </View>
        </DismissKeyboardView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AccountSignIn;
