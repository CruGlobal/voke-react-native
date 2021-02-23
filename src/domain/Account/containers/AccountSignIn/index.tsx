import React, { useState, useRef, FunctionComponent } from 'react';
import {
  Platform,
  Alert,
  useWindowDimensions,
  TextInput,
  View,
  Linking,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useKeyboard } from '@react-native-community/hooks';
import { StackNavigationProp } from '@react-navigation/stack';
import TextField from 'components/TextField';
import Flex from 'components/Flex';
import Text from 'components/Text';
import Screen from 'components/Screen';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import {
  userLogin,
  facebookLogin,
  appleSignIn,
  userBlockedAction,
} from 'actions/auth';
import theme from 'utils/theme';
import { RootStackParamList } from 'utils/types';
import { RootState } from 'reducers';
import { useMount, lockToPortrait } from 'utils';
import CONSTANTS from 'utils/constants';

import styles from './styles';

/* interface Props {
  layout: string;
  parentScroll: React.RefObject<ScrollView>;
  scrollTo: number;
  onComplete: () => void;
} */

type NavigationPropType = StackNavigationProp<
  RootStackParamList,
  'AccountSignIn'
>;

type RoutePropType = RouteProp<RootStackParamList, 'AccountSignIn'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

const AccountSignIn: FunctionComponent<Props> = props => {
  const {
    layout,
    parentScroll,
    scrollTo,
    onComplete = (): void => {
      //void
    },
  } = props.route.params || {};
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
      // 403 - user blocked
      // 401 - password is wrong
      console.log('🛑 Error on login \n', { e });
      if (e?.message === 'Network request failed') {
        Alert.alert(e?.message, t('checkInternet'));
      } else if (e?.error === 'invalid_grant') {
        Alert.alert(t('login:invalid'), t('login:enterValid'));
      } else if (e?.status === 403) {
        dispatch(userBlockedAction());
      } else if (e?.error_description) {
        Alert.alert(e.error_description);
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

  const onAppleSignin = async (): Promise<void> => {
    setIsLoading(true);
    const user = await dispatch(appleSignIn());

    setIsLoading(false);
    if (!user?.id) {
      const errorMessage = user?.error
        ? `\n(${user?.error.substring(0, 30)})` // Limit error message length.
        : '';

      Alert.alert(
        `Can't sign\u00A0in using Apple\u00A0ID`,
        'Apple authentication is\u00A0not\u00A0available at\u00A0this\u00A0moment.' +
          errorMessage,
      );
    } else if (!user?.first_name) {
      // If user.id is set but user.first_name = null in the server response
      // it means user had Apple Signin before but then deleted his account.
      // In this case we need to show him a way to start using Apple Signin
      // from scratch. An old Apple token isn't associated with any data
      // on the server and we don't know user's name, so it can't be used
      // without goind through registration UI again.
      Alert.alert(t('appleSignInDeletedTile'), t('appleSignInDeletedBody'), [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('getHelp'),
          onPress: async (): Promise<void> => {
            return Linking.openURL(CONSTANTS.WEB_URLS.HELP_RESET_APPLEID);
          },
        },
      ]);
    } else {
      if (layout === 'embed') {
        return onComplete();
      }

      navigation.navigate('LoggedInApp');
    }
  };

  /* const cancelLoading = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }; */

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
                        .scrollTo({ x: 0, y: scrollTo, animated: true });
                      // scrollTo + 30 ☝️ it was like this, but not sure why.
                      // It overscrolls (with +30) on iPhone 11.
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
        {Platform.OS === 'ios' && (
          <>
            <Button
              onPress={(): Promise<void> => onAppleSignin()}
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
        )}
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
