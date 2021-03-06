import LanguageSwitch from 'domain/Common/LanguageSwitch';

import React, { ReactElement, useCallback, useLayoutEffect } from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { Alert, ScrollView, View, Dimensions } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Flex from 'components/Flex';
import Image from 'components/Image';
import Text from 'components/Text';
import Touchable from 'components/Touchable';
import OldButton from 'components/OldButton';
import VokeIcon from 'components/VokeIcon';
import { logoutAction, deleteAccountAction, facebookLogin } from 'actions/auth';
import theme from 'utils/theme';
import st from 'utils/st';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'utils/types';

import styles from './styles';

type NavigationPropType = StackNavigationProp<
  RootStackParamList,
  'AccountProfile'
>;

type RoutePropType = RouteProp<RootStackParamList, 'AccountProfile'>;

type Props = {
  navigation: NavigationPropType;
  route: RoutePropType;
};

const AccountProfile = ({ navigation, route }: Props): ReactElement => {
  const { t } = useTranslation();
  const insets = useSafeArea();
  const dispatch = useDispatch();
  const authType = useSelector(({ auth }) => auth?.authType);
  const me = useSelector(({ auth }) => auth.user);
  const windowDimensions = Dimensions.get('window');

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

  const replacePrevScreen = useCallback((): void => {
    const { routes } = navigation.dangerouslyGetState();
    /*
      When navigating into this screen from Login form we should
      go back to Menu screen, not back to Login.
    */
    if (routes[routes.length - 2]?.name !== 'Menu') {
      const newRoutes = [
        {
          key: 'Menu-1',
          name: 'Menu' as keyof RootStackParamList,
          params: undefined,
        },
        {
          key: 'AccountProfile-2',
          name: 'AccountProfile' as keyof RootStackParamList,
          params: undefined,
        },
      ];

      return navigation.reset({
        routes: newRoutes,
        index: newRoutes.length - 1,
      });
    }
  }, [navigation]);

  useLayoutEffect(() => {
    // Check the previous screen in history.
    replacePrevScreen();
  }, [replacePrevScreen]);

  return (
    <Flex
      value={1}
      style={{
        backgroundColor: theme.colors.primary,
      }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          // flex: 1,
          minHeight: '100%',
          flexDirection: 'column',
          alignContent: 'stretch',
          justifyContent: 'flex-end',
        }}
        scrollIndicatorInsets={{ right: 1 }}
        testID={'screenProfile'}
      >
        <Flex
          value={1}
          style={[
            styles.SectionOnboarding,
            // { paddingTop: insets.top }
          ]}
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
              value={1}
              direction="column"
              align="center"
              style={[st.ph1, st.w100, { marginTop: 30 }]}
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
                onPress={() =>
                  navigation.navigate('AccountName', {
                    onComplete: () => navigation.navigate('AccountProfile'),
                  })
                }
              >
                <Text
                  style={{
                    color: styles.colors.white,
                    fontSize: styles.fontSizes.xxxl,
                    textAlign: 'center',
                    paddingTop: 20,
                  }}
                  testID={'textFullName'}
                >
                  {me.firstName + (me.lastName ? ' ' + me.lastName : '')}
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
            <View
              style={{
                minHeight:
                  windowDimensions.height > 700
                    ? theme.spacing.xl
                    : theme.spacing.m,
              }}
            />
            {me.email ? (
              <Flex
                value={1}
                direction="column"
                align="flex-start"
                style={{
                  width: '100%',
                  paddingHorizontal: theme.spacing.l,
                  marginBottom: theme.spacing.l,
                }}
              >
                <View style={styles.settingRow}>
                  <Text style={styles.settingLabel}>{t('language')}</Text>
                  <LanguageSwitch />
                </View>
                {authType === 'apple' ? null : (
                  <>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>
                        {t('placeholder:email')}
                      </Text>
                      <Touchable
                        onPress={() => navigation.navigate('AccountEmail')}
                      >
                        <Text
                          style={styles.settingOption}
                          numberOfLines={2}
                          testID={'textEmail'}
                        >
                          {me.email}
                        </Text>
                      </Touchable>
                    </View>
                    <View style={styles.settingRow}>
                      <Text style={styles.settingLabel}>
                        {t('placeholder:password')}
                      </Text>
                      <Touchable
                        onPress={() => navigation.navigate('AccountPass')}
                      >
                        <Text style={styles.settingOption} numberOfLines={2}>
                          ********
                        </Text>
                      </Touchable>
                    </View>
                    <View style={{ minHeight: theme.spacing.m }} />

                    <Flex
                      direction="row"
                      align="start"
                      justify="start"
                      style={{
                        paddingHorizontal: theme.spacing.l,
                      }}
                    >
                      <VokeIcon
                        name="create"
                        size={18}
                        style={{
                          color: theme.colors.white,
                        }}
                      />
                      <Text
                        style={{
                          color: theme.colors.white,
                          fontSize: theme.fontSizes.xs,
                          paddingLeft: theme.spacing.s,
                        }}
                      >
                        {t('profile:toEdit')}
                      </Text>
                    </Flex>
                  </>
                )}
              </Flex>
            ) : (
              <></>
            )}
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
                  <OldButton
                    isAndroidOpacity={true}
                    style={[styles.ButtonSignUp]}
                    onPress={() => navigation.navigate('AccountCreate')}
                    testID={'ctaSignUpEmail'}
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
                        style={[st.mr5, st.white]}
                      />
                      <Text style={styles.ButtonSignUpLabel}>
                        {t('signUpEmail')}
                      </Text>
                    </Flex>
                  </OldButton>
                  <Flex
                    style={{
                      height: styles.spacing.m,
                    }}
                  />
                  {/* BUTTON:SIGN UP WITH FACBOOK */}
                  <OldButton
                    isAndroidOpacity={true}
                    style={[styles.ButtonSignUp]}
                    onPress={(): Promise<void> => fbLogin()}
                    testID={'ctaSignUpFacebook'}
                  >
                    <Flex
                      // value={1}
                      direction="row"
                      align="center"
                      justify="center"
                    >
                      <VokeIcon
                        name="facebook"
                        size={22}
                        style={[st.mr5, st.white]}
                      />
                      <Text style={styles.ButtonSignUpLabel}>
                        {t('signUpFb')}
                      </Text>
                    </Flex>
                  </OldButton>
                  <Flex
                    style={{
                      height: styles.spacing.m,
                    }}
                  />
                </>
              )}

              <OldButton
                isAndroidOpacity={true}
                style={[styles.ButtonActionTextOnly]}
                onPress={() =>
                  Alert.alert(t('deleteSure'), t('deleteDescription'), [
                    {
                      text: t('cancel'),
                      onPress: () => {},
                      style: 'cancel',
                    },
                    {
                      text: t('delete'),
                      onPress: async () => {
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
                testID={'ctaDeleteAccount'}
              >
                <Text style={styles.ButtonActionLabel}>
                  {t('deleteAccount')}
                </Text>
              </OldButton>
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
    </Flex>
  );
};

export default AccountProfile;
