import React, { useState, useRef, FunctionComponent } from 'react';
import {
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
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useKeyboard } from '@react-native-community/hooks';

import { useMount, lockToPortrait } from '../../utils';
import { userLogin, facebookLogin } from '../../actions/auth';
import TextField from '../../components/TextField';
import OldButton from '../../components/OldButton';
import Flex from '../../components/Flex';
import Text from '../../components/Text';
import st from '../../st';
import theme from '../../theme';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import Spacer from '../../components/Spacer';
import { RootState } from '../../reducers';

import styles from './styles';

interface Props {
  layout: string;
  parentScroll: React.RefObject<ScrollView>;
  scrollTo: number;
  onComplete: () => void;
}

const AccountSignIn: FunctionComponent<Props> = ({
  layout,
  parentScroll,
  scrollTo,
  onComplete = (): null => {
    return null;
  },
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const myAdventures = useSelector(
    ({ data }: RootState) => data.myAdventures.allIds,
  );
  const myInvites = useSelector(
    ({ data }: RootState) => data.adventureInvitations.allIds,
  );
  const [formIsVisible, setFormIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation('common');
  const passwordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const windowDimensions = useWindowDimensions();
  const keyboard = useKeyboard();

  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('forgotPassword:invalid'))
      .required(t('required')),
    // According to Voke API, password should be at least 8 characters long.
    password: Yup.string().min(8, t('shortPassword')).required(t('required')),
  });

  const login = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await dispatch(userLogin(formik.values.email, formik.values.password));
      setIsLoading(false);
      if (layout === 'embed') {
        onComplete();
      } else {
        navigation.navigate('LoggedInApp');
      }
    } catch (e) {
      console.log('🛑 Error on login \n', { e });
      if (e?.message === 'Network request failed') {
        Alert.alert(e?.message, t('checkInternet'));
      } else {
        Alert.alert(t('login:invalid'), t('login:enterValid'));
      }

      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: SigninSchema,
    onSubmit: async () => {
      await login();
    },
  });

  useMount(() => {
    lockToPortrait();
  });

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
      if (layout === 'embed') {
        return onComplete();
      }

      navigation.navigate('LoggedInApp');
    }
  };

  const cancelLoading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <Screen
      layout={layout === 'embed' ? 'embed' : null}
      noKeyboard={layout === 'embed'}
      testID={'accountSignInScreen'}
    >
      {/* SECTION: SIGN IN OPTIONS */}
      <Flex style={styles.signInOptions}>
        {layout !== 'embed' && (
          <View
            style={{
              minHeight:
                keyboard.keyboardShown && windowDimensions.height < 812
                  ? theme.spacing.xl
                  : theme.spacing.xxxl,
              // Vertically align form on different screens sizes.
            }}
          />
        )}
        {layout === 'embed' && <Spacer size="xl" />}
        {!formIsVisible && (
          <>
            <Button
              onPress={(): void => {
                setFormIsVisible(true);
                emailRef?.current?.focus();
                setTimeout(() => {
                  emailRef?.current?.focus();
                }, 400);
              }}
              testID={'ctaSignInEmail'}
              size="l"
              color="blank"
              icon="mail"
            >
              {t('signInEmail')}
            </Button>
          </>
        )}
        {formIsVisible && (
          <Flex style={[styles.primaryContent]}>
            {/* INPUT FIELD: EMAIL */}
            <TextField
              ref={emailRef}
              label={t('placeholder:email')}
              onSubmitEditing={(): void => passwordRef?.current?.focus()}
              placeholder={t('placeholder:email')}
              value={formik.values.email}
              onChangeText={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              onFocus={(): void => {
                if (
                  // Platform.OS === 'ios' &&
                  parentScroll?.current &&
                  scrollTo
                ) {
                  // Android is doing that all for us automatically.
                  // Need timeout for Keyboard to appear and scroll become available.
                  setTimeout(() => {
                    if (parentScroll?.current) {
                      parentScroll?.current
                        // ?.getScrollResponder() - Is causing TypeScript error.
                        .scrollTo({ x: 0, y: scrollTo + 30, animated: true });
                    }
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
                  : undefined
              }
              testID={'inputEmail'}
            />
            {/* INPUT FIELD: PASSWORD */}
            <TextField
              ref={passwordRef}
              label={t('placeholder:password')}
              placeholder={t('placeholder:password')}
              value={formik.values.password}
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
                  : undefined
              }
              testID={'inputPassword'}
            />
            <Spacer size="xl" />
            {/* BUTTON: SIGN IN */}
            <Button
              onPress={formik.handleSubmit}
              isLoading={isLoading}
              testID={'ctaSignInNow'}
              size="l"
              color="blank"
              shadow
            >
              {t('signIn')}
            </Button>
            {/* TEXT: FORGOT PASSWORD */}
            <Text
              style={styles.link}
              onPress={(): void => navigation.navigate('ForgotPassword')}
            >
              {t('forgotPassword')}
            </Text>
            <Spacer size="xxl" />
          </Flex>
        )}
        <Spacer />
        {/* {Platform.OS === 'ios' && (
          <>
            <Button
              onPress={(): Promise<void> => fbLogin()}
              testID={'ctaAdventureCode'}
              size="l"
              styling="outline"
              color="blank"
              icon="apple"
            >
              {t('signInApple')}
            </Button>
            <Spacer />
          </>
        )} - Apple sinin button */}
        <Button
          onPress={(): Promise<void> => fbLogin()}
          testID={'ctaSignInFb'}
          size="l"
          styling="outline"
          color="blank"
          icon="facebook"
        >
          {t('signInFb')}
        </Button>
        <Spacer />
      </Flex>
      <Spacer size="xl" />
      {/* TEXT: NOTICE */}
      {/* Hide it if there is no progress (no adventures or invites) */}
      {(!!myAdventures.length || !!myInvites.length) && (
        <Flex direction="column" justify="start" style={styles.sectionNotice}>
          <Text style={styles.textMedium}>{t('login:existingAccount')}</Text>
        </Flex>
      )}
    </Screen>
  );
};

export default AccountSignIn;
