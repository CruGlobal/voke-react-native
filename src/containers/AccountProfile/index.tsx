import React, { ReactElement } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { Alert, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';

import { RootState } from '../../reducers';
import Flex from '../../components/Flex';
import st from '../../st';
import theme from '../../theme';
import Image from '../../components/Image';
import Text from '../../components/Text';
import Touchable from '../../components/Touchable';
import Button from '../../components/Button';
import {
  logoutAction,
  deleteAccountAction,
  facebookLogin,
} from '../../actions/auth';
import VokeIcon from '../../components/VokeIcon';
import languageCodes from '../../i18n/languageCodes';

import styles from './styles';

const AccountProfile = (): ReactElement => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const me = useSelector(({ auth }: RootState) => auth.user);

  // To change language use:
  // https://www.i18next.com/overview/api#changelanguage
  // change the language
  // i18next.changeLanguage("en-US-xx");

  // Facebook Login.
  // TODO: Create FB Button component.
  const fbLogin = async (): Promise<void> => {
    const userId = await dispatch(facebookLogin());
    if (!userId) {
      Alert.alert(
        "Can't sign in with Facebook",
        'Facebook authentication is not available at this moment',
      );
    } else {
      navigation.navigate('LoggedInApp');
    }
  };

  type currLangType = {
    name: string;
    nativeName: string;
  };

  const currLang: currLangType =
    languageCodes[i18next.language.substr(0, 2).toLowerCase()];

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        // flex: 1, // Will break scrolling on Android
        // height:'100%', // Will break scrolling on Android
        flexDirection: 'column',
        alignContent: 'stretch',
        justifyContent: 'flex-end',
      }}
    >
      <Flex
        value={1}
        style={{
          backgroundColor: theme.colors.primary,
        }}
      >
        {/* Overscroll background color protection */}
        {/* <Flex style={{
          backgroundColor: styles.colors.primary,
          height: 400,
          position: 'absolute',
          zIndex:0,
          width: '100%',
        }} /> */}
        {/* <ScrollView> */}
        <Flex
          style={{
            height: '100%',
          }}
        >
          <Flex
            // value={1}
            direction="column"
            align="center"
            style={{
              paddingHorizontal: 50,
              width: '100%',
              marginTop: 30,
            }}
          >
            <Touchable
              onPress={(): void =>
                navigation.navigate('AccountPhoto', {
                  onComplete: () => navigation.navigate('AccountProfile'),
                })
              }
            >
              <Flex
                direction="column"
                align="center"
                justify="center"
                style={[
                  st.w(st.fullWidth / 2.6),
                  st.h(st.fullWidth / 2.6),
                  {
                    borderRadius: st.fullWidth / 2.6,
                    backgroundColor: styles.colors.secondaryAlt,
                  },
                ]}
              >
                <Image
                  source={{ uri: me.avatar?.large || '' }}
                  style={[
                    st.w(st.fullWidth / 2.6),
                    st.h(st.fullWidth / 2.6),
                    {
                      borderRadius: st.fullWidth / 2.6,
                      borderColor: styles.colors.white,
                      borderWidth: 2,
                    },
                  ]}
                />
              </Flex>
            </Touchable>

            <Touchable
              onPress={(): void =>
                navigation.navigate('AccountName', {
                  onComplete: () => navigation.navigate('AccountProfile'),
                })
              }
            >
              <Text
                style={{
                  color: theme.colors.white,
                  fontSize: theme.fontSizes.xxxl,
                  textAlign: 'center',
                  paddingTop: 20,
                }}
              >
                {me.firstName + ' ' + me.lastName}
              </Text>
            </Touchable>

            {!me.email ? (
              <Text
                style={{
                  color: styles.colors.white,
                  fontSize: styles.fontSizes.l,
                  textAlign: 'center',
                }}
              >
                {t('profile:guest')}
              </Text>
            ) : (
              <Text
                style={{
                  color: styles.colors.white,
                  fontSize: styles.fontSizes.l,
                  textAlign: 'center',
                }}
              >
                {t('profile:user')}
              </Text>
            )}
          </Flex>
          <View style={{ minHeight: theme.spacing.xl }} />
          {me.email ? (
            <Flex
              value={1}
              direction="column"
              align="flex-start"
              style={{ width: '100%', marginLeft: 30, marginBottom: 10 }}
            >
              {/* <Touchable onPress={ () => navigation.navigate('AccountEmailPass')}> */}
              <Flex direction="row" align="start" justify="around">
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 18,
                    width: '30%',
                    textAlign: 'left',
                    paddingRight: 20,
                  }}
                >
                  {t('language')}
                </Text>
                {/* <Button onPress={()=>console.log('test')} > */}
                <Text style={{ color: '#fff', fontSize: 18, width: '70%' }}>
                  {currLang.name}{' '}
                  {currLang.name !== 'English'
                    ? '(' + currLang.nativeName + ')'
                    : ''}
                </Text>
                {/* </Button> */}
              </Flex>
              {/* </Touchable> */}
              <View style={{ minHeight: 12 }} />
              {/* Extra spacing for fingers to touch the right line. */}
              <Touchable
                onPress={(): void => navigation.navigate('AccountEmail')}
              >
                <Flex direction="row" align="start" justify="around">
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      width: '30%',
                      textAlign: 'left',
                      paddingRight: 20,
                    }}
                    numberOfLines={2}
                  >
                    {t('placeholder:email')}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      width: '70%',
                      paddingRight: 60,
                    }}
                    numberOfLines={2}
                  >
                    {me.email}
                  </Text>
                </Flex>
              </Touchable>
              <View style={{ minHeight: 12 }} />
              {/* Extra spacing for fingers to touch the right line. */}
              <Touchable
                onPress={(): void => navigation.navigate('AccountPass')}
              >
                <Flex direction="row" align="start" justify="around">
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      width: '30%',
                      textAlign: 'left',
                      paddingRight: 20,
                    }}
                  >
                    {t('placeholder:password')}
                  </Text>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 18,
                      width: '70%',
                      paddingRight: 60,
                    }}
                  >
                    ******
                  </Text>
                </Flex>
              </Touchable>
              <Flex
                direction="row"
                align="flex-start"
                justify="start"
                style={{ marginTop: 30 }}
              >
                <VokeIcon
                  name="create"
                  size={18}
                  style={{
                    marginLeft: 2,
                  }}
                />
                <Text style={{ color: '#fff', fontSize: 14 }}>
                  {t('profile:toEdit')}
                </Text>
              </Flex>
            </Flex>
          ) : (
            <></>
          )}
          {/* <Button
              isAndroidOpacity={true}
              style={[styles.ButtonAction, {
                marginTop: 40,
                marginBottom: 40
              }]}
              onPress={
                () => dispatch(logoutAction()).then(() => {
                  // Navigate back to the very first screen.
                  // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
                  setTimeout(() => {
                    navigation.reset({
                      index: 1,
                      routes: [{ name: 'Welcome' }],
                    });
                  }, 10);
                })
              }
            >
              <Flex
                // value={1}
                direction="row"
                align="center"
                justify="center"

              >
                <Text style={styles.ButtonActionLabel}>Sign out</Text>
              </Flex>
            </Button> */}

          {/* SECTION: CALL TO ACTION BUTTON */}

          <Flex
            direction="column"
            style={[styles.SectionAction]}
            value={1}
            justify="end"
          >
            <Flex
              style={{
                height: styles.spacing.m,
              }}
            />
            {!me.email && (
              <>
                {/* TEXT:TEXT */}
                <Text
                  style={{
                    color: styles.colors.white,
                    fontSize: styles.fontSizes.l,
                    textAlign: 'center',
                    paddingBottom: 20,
                  }}
                >
                  {t('profile:signUp')}
                </Text>
                <Flex
                  style={{
                    height: styles.spacing.s,
                  }}
                />
                {/* BUTTON:SIGN UP WITH EMAIL */}
                <Button
                  isAndroidOpacity={true}
                  style={[styles.ButtonSignUp]}
                  onPress={(): void => navigation.navigate('SignUp')}
                >
                  <Flex
                    // value={1}
                    direction="row"
                    align="center"
                    justify="center"
                  >
                    <VokeIcon
                      name="mail"
                      size={22}
                      style={{
                        marginRight: 10,
                      }}
                    />
                    <Text style={styles.ButtonSignUpLabel}>
                      {t('signUpEmail')}
                    </Text>
                  </Flex>
                </Button>
                <Flex
                  style={{
                    height: styles.spacing.m,
                  }}
                />
                {/* BUTTON:SIGN UP WITH FACBOOK */}
                <Button
                  isAndroidOpacity={true}
                  style={[styles.ButtonSignUp]}
                  onPress={(): Promise<void> => fbLogin()}
                >
                  <Flex
                    // value={1}
                    direction="row"
                    align="center"
                    justify="center"
                  >
                    <VokeIcon
                      name="logo-facebook"
                      size={22}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.ButtonSignUpLabel}>
                      {t('signUpFb')}
                    </Text>
                  </Flex>
                </Button>
                <Flex
                  style={{
                    height: styles.spacing.m,
                  }}
                />
              </>
            )}

            <Button
              isAndroidOpacity={true}
              style={[styles.ButtonActionTextOnly]}
              onPress={(): void =>
                Alert.alert(t('deleteSure'), t('deleteDescription'), [
                  {
                    text: t('cancel'),
                    onPress: undefined,
                    style: 'cancel',
                  },
                  {
                    text: t('delete'),
                    onPress: async (): Promise<void> => {
                      try {
                        dispatch(deleteAccountAction());
                        dispatch(logoutAction());
                      } finally {
                        // Navigate back to the very first screen.
                        // 🤦🏻‍♂️Give React 10ms to render WelcomeApp component.
                        setTimeout(() => {
                          navigation.reset({
                            index: 1,
                            routes: [{ name: 'Welcome' }],
                          });
                        }, 10);
                      }
                    },
                  },
                ])
              }
            >
              <Text style={styles.ButtonActionLabel}>{t('deleteAccount')}</Text>
            </Button>
            <Flex
              style={{
                height: styles.spacing.xl,
              }}
            />
          </Flex>
        </Flex>
        {/* </ScrollView> */}

        {/* Safe area bottom spacing */}
        <Flex
          style={{
            backgroundColor: styles.colors.primary,
            paddingBottom: insets.bottom,
          }}
        />
      </Flex>
    </ScrollView>
  );
};

export default AccountProfile;
