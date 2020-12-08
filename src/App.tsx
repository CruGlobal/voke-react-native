import React, {
  useEffect,
  useState,
  useCallback,
  ReactElement,
  useRef,
  memo,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  NavigationContainer,
  useRoute,
  useNavigationState,
  useFocusEffect,
  StackActions,
  RouteProp,
} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Linking, YellowBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import useAppState from 'react-native-appstate-hook';
import RNBootSplash from 'react-native-bootsplash';
import { Host } from 'react-native-portalize';
import theme from 'utils/theme';
import st from 'utils/st';
import {
  AdventureStackParamList,
  AppStackParamList,
  NotificationStackParamList,
  RootStackParamList,
  VideoStackParamList,
} from 'utils/types';
import { useMount } from 'utils';
import NavBackButton from 'components/NavBackButton';

import {
  startupAction,
  sleepAction,
  wakeupAction,
  getMeAction,
} from './actions/auth';
import { routeNameRef, navigationRef } from './RootNavigation';
import Welcome from './domain/Account/containers/Welcome';
import Menu from './domain/Menu/Menu';
import MenuHelp from './domain/Menu/Help';
import MenuAbout from './domain/Menu/About';
import MenuAcknowledgements from './domain/Menu/Acknowledgements';
import AccountSignIn from './domain/Account/containers/AccountSignIn';
import AccountPass from './domain/Account/containers/AccountPass';
import AccountEmail from './domain/Account/containers/AccountEmail';
import AccountProfile from './domain/Account/containers/AccountProfile';
import AccountCreate from './domain/Account/containers/AccountCreate';
import AccountForgotPassword from './domain/Account/containers/AccountForgotPassword';
import Adventures from './domain/Adventures/AdventuresTab';
import AdventureAvailable from './domain/Adventure/Available';
import VideoDetails from './domain/Explore/containers/VideoDetails';
import AdventureName from './domain/Adventure/Name';
import AdventureShareCode from './domain/Adventure/Share';
import AdventureActive from './domain/Adventure/Active';
import AdventureManage from './domain/Adventure/Manage';
import AdventureStepScreen from './domain/Adventure/StepScreen';
import GroupReleaseType from './domain/Adventure/GroupReleaseType';
import GroupReleaseDate from './domain/Adventure/ReleaseDate';
import ModalAppUpdate from './components/ModalAppUpdate';
import AllMembersModal from './domain/Adventure/MembersModal';
import AdventureCode from './domain/Adventure/Code';
import Videos from './domain/Explore/containers/Videos';
import Notifications from './domain/Notifications/containers/Notifications';
import AccountName from './domain/Account/containers/AccountName';
import AccountPhoto from './domain/Account/containers/AccountPhoto';
import GroupModal from './domain/Adventure/GroupModal';
import TabBar from './components/TabBar';
import HeaderLeft from './components/HeaderLeft';
import Touchable from './components/Touchable';
import SignOut from './components/SignOut';
import Text from './components/Text';
import { checkInitialNotification } from './actions/notifications';
import KitchenSink from './domain/Common/KitchenSink';

// https://reactnavigation.org/docs/stack-navigator#options
const defaultHeaderConfig = {
  headerStyle: {
    backgroundColor: theme.colors.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    color: theme.colors.secondary,
    fontSize: 16,
    fontWeight: 'normal',
  },
  headerLeft: (): ReactElement => <HeaderLeft resetTo="Menu" />,
};

// https://reactnavigation.org/docs/stack-navigator#options
const altHeaderConfig = {
  headerStyle: {
    backgroundColor: theme.colors.primary,
    elevation: 0,
    shadowOpacity: 0,
    // paddingTop: insets.top // TODO: Check if it really works here?
  },
  headerTitleStyle: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'normal',
  },
  headerTitleAlign: 'center' as const,
  headerTintColor: theme.colors.white,
  headerBackTitle: ' ',
};

const transparentHeaderConfig = {
  ...altHeaderConfig,
  headerStyle: {
    ...altHeaderConfig.headerStyle,
    backgroundColor: 'transparent',
  },
  headerTransparent: true,
};

const AdventureStack = createStackNavigator<AdventureStackParamList>();

const AdventureStackScreens = ({ navigation, route }: any) => {
  const insets = useSafeArea();
  const { t } = useTranslation('title');

  useEffect(() => {
    if (route?.state?.routes.length && route?.state?.type) {
      // Make tapbar visible dynamically.
      navigation.setOptions({
        tabBarVisible:
          route?.state && route?.state?.type === 'stack'
            ? !(route?.state?.routes.length > 1)
            : null,
      });
    }
  }, [route?.state?.routes.length]);

  return (
    <AdventureStack.Navigator
      screenOptions={{
        ...defaultHeaderConfig,
      }}
    >
      <AdventureStack.Screen
        name="Adventures"
        component={Adventures}
        options={{
          title: t('adventures'),
        }}
      />
      <AdventureStack.Screen
        name="AdventureAvailable"
        component={AdventureAvailable}
        // Fixed header with back button.
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: (): ReactElement => (
            <HeaderLeft testID="AdventureAvailable" />
          ),
        }}
      />
      <AdventureStack.Screen
        name="AdventureActive"
        component={AdventureActive}
        // Fixed header with back button.
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
          },
          title: '',
          headerLeft: (): ReactElement => (
            <HeaderLeft resetTo="Adventures" testID="AdventureActive" />
          ),
          headerRight: undefined,
        }}
      />
      <AdventureStack.Screen
        name="AdventureManage"
        component={AdventureManage}
        // Fixed header with back button.
        options={({ route, navigation }) => ({
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: (): ReactElement => (
            <HeaderLeft testID="AdventureManage" />
          ),
        })}
      />
      <AdventureStack.Screen
        name="AdventureStepScreen"
        component={AdventureStepScreen}
        // Fixed header with back button.
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: (): ReactElement => (
            <HeaderLeft testID="AdventureStepScreenHeader" />
          ),
          headerRight: undefined,
        }}
      />
      <AdventureStack.Screen
        name="GroupModal"
        component={GroupModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AllMembersModal"
        component={AllMembersModal}
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: (): ReactElement => (
            <HeaderLeft testID="AllMembersModal" />
          ),
          headerRight: undefined,
        }}
      />
      {/* <AdventureStack.Screen
        name="AccountPhoto"
        component={AccountPhoto}
        options={{ headerShown: false }}
      /> */}
    </AdventureStack.Navigator>
  );
};

const VideoStack = createStackNavigator<VideoStackParamList>();
function VideoStackScreens({ navigation, route }: any) {
  const { t } = useTranslation('title');
  const insets = useSafeArea();
  // TODO: extract into utility function.
  navigation.setOptions({
    tabBarVisible: route.state ? !(route.state.index > 0) : null,
  });
  return (
    <VideoStack.Navigator screenOptions={defaultHeaderConfig}>
      <VideoStack.Screen
        name="Explore"
        component={Videos}
        options={{
          title: t('explore'),
        }}
      />
      <VideoStack.Screen
        name="VideoDetails"
        component={VideoDetails}
        // Fixed header with back button.
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top, // TODO: Check if it really works here?
          },
          title: '',
          headerLeft: (): ReactElement => <HeaderLeft testID="VideoDetails" />,
        }}
      />
    </VideoStack.Navigator>
  );
}

const NotificationStack = createStackNavigator<NotificationStackParamList>();
const NotificationStackScreens = () => {
  const { t } = useTranslation('title');
  return (
    <NotificationStack.Navigator
      mode="card"
      screenOptions={defaultHeaderConfig}
    >
      <NotificationStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          title: t('notifications'),
        }}
      />
    </NotificationStack.Navigator>
  );
};

const LoggedInAppContainer = () => {
  const dispatch = useDispatch();
  const Tabs = createBottomTabNavigator();
  const state = useNavigationState(state => state);
  const { t } = useTranslation('title');

  // Handle iOS & Android appState changes.
  const { appState } = useAppState({
    // Callback function to be executed once appState is changed to
    // active, inactive, or background
    onChange: newAppState => console.warn('App state changed to ', newAppState),
    // Callback function to be executed once app go to foreground
    onForeground: async () => {
      // Get the deep link used to open the app
      /* await Linking.getdeeplink().then(
        (data) => {
        }
      ); */

      dispatch(wakeupAction());
    },
    // Callback function to be executed once app go to background
    onBackground: () => {
      console.warn('App went to background');
      dispatch(sleepAction());
    },
  });

  useEffect(() => {
    // Check notifications permission and setup sockets.
    dispatch(startupAction()).then(
      success => LOG(' 🧛‍♂️ startupAction > SUCCESS'),
      error => WARN(' 🧚‍♂️ startupAction > ERROR', error),
    );
  }, []);

  return (
    <Tabs.Navigator tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen
        name="Adventures"
        component={AdventureStackScreens}
        options={{
          title: t('adventures'),
        }}
      />
      <Tabs.Screen
        name="Explore"
        component={VideoStackScreens}
        options={{
          title: t('explore'),
        }}
      />
      <Tabs.Screen
        name="Notifications"
        component={NotificationStackScreens}
        options={{
          title: t('notifications'),
        }}
      />
    </Tabs.Navigator>
  );
};

// Gets the current screen id from navigation state
const getActiveRouteName = state => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackScreens = React.memo(
  () => {
    const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
    const firstName = useSelector(({ auth }: any) => auth.user.firstName);
    const insets = useSafeArea();
    const { t } = useTranslation('title');

    return (
      <>
        <RootStack.Navigator mode="card" screenOptions={defaultHeaderConfig}>
          {isLoggedIn && firstName.length ? (
            <RootStack.Screen
              name="LoggedInApp"
              component={LoggedInAppContainer}
              options={{
                headerShown: false,
              }}
            />
          ) : (
            <RootStack.Screen
              name="Welcome"
              component={Welcome}
              options={{
                title: '',
                headerShown: false,
              }}
            />
          )}
          {/* <AppStack.Screen name="WelcomeApp" component={WelcomeAppContainer} /> */}
          {/* <AppStack.Screen name="Welcome" component={Welcome} /> */}
          {/* Don't hide these Welcome screens under !isLoggedIn
            as we need to access these when editing name and image
            for already logged in users.   */}
          <RootStack.Screen
            name="AccountName"
            component={AccountName}
            options={{
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top, // TODO: Check if it really works here?
              },
              title: '',
              // headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountName" />
              ),
            }}
          />
          <RootStack.Screen
            name="AdventureCode"
            component={AdventureCode}
            options={{
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top, // TODO: Check if it really works here?
              },
              title: '',
              // headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AdventureCode" />
              ),
            }}
          />
          <RootStack.Screen
            name="AccountPhoto"
            component={AccountPhoto}
            options={({ navigation }) => ({
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top, // TODO: Check if it really works here?
              },
              headerRight: () => (
                <>
                  {/* <Touchable
                // style={[st.p5, st.pl4, st.mb3]}
                onPress={ () => {
                    try {
                      navigation.navigate('LoggedInApp', { screen: 'Adventures' });
                    } catch (error) {
                      navigation.navigate('Adventures');
                    }
                  }
                }
              >
                <Text style={[st.white, st.fs16, st.pr5]}>Skip</Text>
              </Touchable> */}
                </>
              ),
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountPhoto" />
              ),
              title: '',
              // headerShown: true,
            })}
          />
          <RootStack.Screen
            name="Menu"
            component={Menu}
            options={({ navigation }) => ({
              animationTypeForReplace: 'pop', // Changes direction of animation.
              headerShown: true,
              headerRight: () => (
                <Touchable
                  onPress={() => {
                    // Get the index of the route to see if we can go back.
                    const { index } = navigation.dangerouslyGetState();
                    if (index > 0) {
                      navigation.goBack();
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoggedInApp' }],
                      });
                    }
                  }}
                >
                  <Text style={[st.white, st.mr4, st.fs16]}>{t('done')}</Text>
                </Touchable>
              ),
              headerLeft: (): ReactElement => {},
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('settings'),
            })}
          />
          <RootStack.Screen
            name="AccountCreate"
            component={AccountCreate}
            options={{
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top,
              },
              title: t('createAccount'),
              // headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountCreate" />
              ),
            }}
          />
          <RootStack.Screen
            name="AccountSignIn"
            component={AccountSignIn}
            options={{
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top,
              },
              title: t('signIn'),
              // headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountSignIn" />
              ),
            }}
          />
          <RootStack.Screen
            name="ForgotPassword"
            component={AccountForgotPassword}
            options={{
              ...defaultHeaderConfig,
              title: 'Get New Password',
              headerShown: true,
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
                paddingTop: insets.top, // TODO: Check if it really works here?
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="ForgotPassword" />
              ),
            }}
          />
          <RootStack.Screen
            name="AccountProfile"
            component={AccountProfile}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountProfile" />
              ),
              headerRight: () => <SignOut />,
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('title:profile'),
            })}
          />
          {/* RELEASE Check this case! */}
          {/* <RootStack.Screen
            name="SignUp"
            component={AccountCreate}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: ():ReactElement => <HeaderLeft testID="SignUp" />,
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('signUp'),
            })}
          /> */}
          <RootStack.Screen
            name="AccountEmail"
            component={AccountEmail}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountEmail" />
              ),
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('profile:changeEmail'),
            })}
          />
          <RootStack.Screen
            name="AccountPass"
            component={AccountPass}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="AccountPass" />
              ),
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('profile:changePassword'),
            })}
          />
          <RootStack.Screen
            name="Help"
            component={MenuHelp}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => <HeaderLeft testID="Help" />,
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('title:helpCenter'),
            })}
          />
          <RootStack.Screen
            name="About"
            component={MenuAbout}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => <HeaderLeft testID="About" />,
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('title:about'),
            })}
          />
          <RootStack.Screen
            name="Acknowledgements"
            component={MenuAcknowledgements}
            options={({ navigation }) => ({
              headerShown: true,
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="Acknowledgements" />
              ),
              cardStyle: { backgroundColor: theme.colors.transparent },
              headerStyle: {
                backgroundColor: theme.colors.primary,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: theme.colors.white,
                fontSize: 18,
                fontWeight: 'normal',
              },
              title: t('title:acknowledgements'),
            })}
          />
        </RootStack.Navigator>
      </>
    );
  },
  (prevProps, nextProps) => {
    // We don't care about props, and don't want our component to re-render
    // if any value in the props cahnge.
    return true; // force areEqual - don't re-render.
  },
);

const AppStack = createStackNavigator<AppStackParamList>();

const App = () => {
  // Extract store.auth.isLoggedIn value.
  const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
  const userId = useSelector(({ auth }: any) => auth.user?.id);
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'profile']);
  const [deeplink, setDeeplink] = useState(null);

  const deepLinkListener = event => {
    if (event?.url) {
      setDeeplink(event?.url);
    }
  };

  const getUrlAsync = async () => {
    // Get the deep link used to open the app
    // Warning! This works only with debugger disabled!
    const newdeeplink = await Linking.getInitialURL();
    // TODO: For Android issues see: https://github.com/facebook/react-native/issues/25675#
    setDeeplink(newdeeplink);
  };

  // Hide splash screen on load.
  useMount(() => {
    getUrlAsync();
    checkInitialNotification();
    RNBootSplash.hide({ duration: 250 }); // Hide splash screen.
    if (!isLoggedIn && userId) {
      dispatch(getMeAction());
    }
  });

  useEffect(() => {
    if (deeplink) {
      // Alert.alert('deeplink:', deeplink);
    }
  }, [deeplink]);

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
    Linking.addEventListener('url', deepLinkListener);

    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the is component unmounted, remove the listener
    // return () => unsubscribe();
  }, []);

  const linking = {
    prefixes: ['https://the.vokeapp.com', 'voke:://', 'voke://'],
    config: {
      screens: {
        // "voke:://messenger_journeys/e579effe-3b01-4054-bca7-db912fe463e6/messenger_journey_steps/227a52a4-2025-4770-b792-f51f3f3ab4c0"
        AdventureStepScreen: {
          path:
            'messenger_journeys/:adventureId/messenger_journey_steps/:stepId',
          parse: {
            // adventureId: (adventureId) => adventureId,
          },
        },
        // Profile: 'user',
      },
    },
    getStateFromPath: (path, options) => {
      // Return a state object here
      // You can also reuse the default logic by importing `getStateFromPath` from `@react-navigation/native`
    },

    // Here Chat is the name of the screen that handles the URL /feed, and Profile handles the URL /user.
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={state => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);

          /* if (previousRouteName !== currentRouteName) {
          // The line below uses the @react-native-firebase/analytics tracker
          // Change this line to use another Mobile analytics SDK
          analytics().setCurrentScreen(currentRouteName, currentRouteName);
        } */

          // Save the current route name for later comparision
          routeNameRef.current = currentRouteName;
        }}
        // linking={linking} - not working.
        // initialState={ ( isLoggedIn ? ({ index: 0, routes: [{ name: 'LoggedInApp' }] }) : ({ index: 0, routes: [{ name: 'WelcomeApp' }] }) ) }
      >
        <Host>
          <AppStack.Navigator
            screenOptions={
              {
                // headerShown: false
              }
            }
          >
            <AppStack.Screen
              name="Root"
              component={RootStackScreens}
              options={{
                headerShown: false,
              }}
            />
            <AppStack.Screen
              name="AdventureName"
              component={AdventureName}
              options={({ navigation }) => ({
                ...transparentHeaderConfig,
                headerStyle: {
                  ...transparentHeaderConfig.headerStyle,
                },
                cardStyle: { backgroundColor: theme.colors.primary },
                title: '',
                headerLeft: (): ReactElement => (
                  <HeaderLeft testID="AdventureName" />
                ),
              })}
            />
            <AppStack.Screen
              name="GroupReleaseType"
              component={GroupReleaseType}
              options={({ navigation }) => ({
                ...transparentHeaderConfig,
                headerStyle: {
                  ...transparentHeaderConfig.headerStyle,
                },
                cardStyle: { backgroundColor: theme.colors.primary },
                title: '',
                headerLeft: (): ReactElement => (
                  <HeaderLeft testID="GroupReleaseType" />
                ),
              })}
            />
            <AppStack.Screen
              name="GroupReleaseDate"
              component={GroupReleaseDate}
              options={({ navigation }) => ({
                ...transparentHeaderConfig,
                headerStyle: {
                  ...transparentHeaderConfig.headerStyle,
                },
                cardStyle: { backgroundColor: theme.colors.primary },
                title: '',
                headerLeft: (): ReactElement => (
                  <HeaderLeft testID="GroupReleaseDate" />
                ),
              })}
            />
            <AppStack.Screen
              name="AdventureShareCode"
              component={AdventureShareCode}
              options={({ route, navigation }) => ({
                ...transparentHeaderConfig,
                headerStyle: {
                  ...transparentHeaderConfig.headerStyle,
                },
                cardStyle: { backgroundColor: theme.colors.primary },
                title: '',
                headerLeft: (): ReactElement => <></>,
                headerRight: (): ReactElement => {
                  return (
                    <Touchable
                      onPress={(): void => {
                        route?.params?.onClose
                          ? route?.params?.onClose()
                          : navigation.dispatch(StackActions.popToTop());
                      }}
                      testID={'ctaHeaderDone'}
                    >
                      <Text style={[st.white, st.mr4, st.fs16]}>
                        {t('done')}
                      </Text>
                    </Touchable>
                  );
                },
              })}
            />
            <RootStack.Screen
              name="KitchenSink"
              component={KitchenSink}
              options={({ navigation }) => ({
                headerShown: true,
                headerLeft: (): ReactElement => (
                  <HeaderLeft testID="KitchenSink" />
                ),
                cardStyle: { backgroundColor: theme.colors.transparent },
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTitleStyle: {
                  color: theme.colors.white,
                  fontSize: 18,
                  fontWeight: 'normal',
                },
                title: 'Kitchen Sink',
              })}
            />
          </AppStack.Navigator>
          <ModalAppUpdate />
        </Host>
      </NavigationContainer>
    </>
  );
};

export default App;
