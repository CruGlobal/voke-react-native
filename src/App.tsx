import React, { useEffect, useState, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  NavigationContainer,
  useNavigationState,
  StackActions,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import { Alert, Linking, YellowBox } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import { SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { useAppState } from '@react-native-community/hooks';
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
import { getTimeSinceStartup } from 'react-native-startup-time';
import { REDUX_ACTIONS } from 'utils/constants';

import {
  startupAction,
  sleepAction,
  wakeupAction,
  getMeAction,
  updateMe,
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
import AccountBlocked from './domain/Account/containers/AccountBlocked';
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

const NotificationStack = createStackNavigator<NotificationStackParamList>();
const NotificationStackScreens = () => {
  const { t } = useTranslation('title');
  return (
    <NotificationStack.Navigator
      mode="card"
      screenOptions={{
        headerShown: false,
      }}
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

const LoggedInAppContainer = (navigation, route) => {
  const dispatch = useDispatch();
  const Tabs = createBottomTabNavigator();
  const { t } = useTranslation('title');
  const currentAppState = useAppState();

  useEffect(() => {
    // AppState will change between one of 'active', 'background',
    // or(iOS) 'inactive' when the app is closed or put into the background.

    console.warn('App state changed to ', currentAppState);
    switch (currentAppState) {
      case 'active':
        // Callback function to be executed once app go to foreground
        dispatch(wakeupAction());
        break;
      case 'background':
        // Callback function to be executed once app go to background
        dispatch(wakeupAction());
        dispatch(sleepAction());
        break;
      default:
        break;
    }
  }, [currentAppState]);

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
        component={Adventures}
        options={{
          title: t('adventures'),
        }}
      />
      <Tabs.Screen
        name="Explore"
        component={Videos}
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
    const isBlocked = useSelector(
      ({ auth }: any) => auth.userBlocked.isBlocked,
    );
    const firstName = useSelector(({ auth }: any) => auth.user.firstName);
    const insets = useSafeArea();
    const { t } = useTranslation('title');

    return (
      <>
        <RootStack.Navigator mode="card" screenOptions={defaultHeaderConfig}>
          {isLoggedIn && firstName?.length ? (
            <RootStack.Screen
              name="LoggedInApp"
              component={isBlocked ? AccountBlocked : LoggedInAppContainer}
              options={({
                route,
              }): { headerShown: boolean; headerTitle: string | undefined } => {
                // https://reactnavigation.org/docs/screen-options-resolution/
                // If the focused route is not found, we need to assume it's the initial screen
                // This can happen during if there hasn't been any navigation inside the screen
                // In our case, it's "Adventures" as that's the first screen inside the navigator
                const routeName =
                  getFocusedRouteNameFromRoute(route) ?? t('adventures');
                return {
                  headerShown: isBlocked ? false : true,
                  headerTitle: routeName,
                };
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

          <RootStack.Screen
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
              headerLeft: (): ReactElement => (
                <HeaderLeft testID="VideoDetails" />
              ),
            }}
          />
          <RootStack.Screen
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
          <RootStack.Screen
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
                <HeaderLeft resetTo="LoggedInApp" testID="AdventureActive" />
              ),
              headerRight: undefined,
            }}
          />
          <RootStack.Screen
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
                <HeaderLeft
                  resetTo="AdventureActive"
                  testID="AdventureManage"
                />
              ),

              /* navigation.navigate('AdventureActive', {
                adventureId: adventureItem.id,
              }); */
            })}
          />
          <RootStack.Screen
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
          <RootStack.Screen
            name="GroupModal"
            component={GroupModal}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
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
  const [deeplink, setDeeplink] = useState('');

  // Deeplinks are links like voke:// or any other non-Firebase link.
  const handleDeepLink = (link: string | null | { url: string }): void => {
    let flatLink = link as string;
    const deepLink = link as { url: string };
    if (deepLink?.url) {
      flatLink = deepLink?.url;
    }

    // Don't process Dynamic Links generated in Firebase (//voke.page.link)
    if (!flatLink.includes('//voke.page.link')) {
      setDeeplink(flatLink as string);
    }
  };

  // Dynamic Links are links generated via Firebase. (https://voke.page.link/..)
  const handleDynamicLink = (
    link: FirebaseDynamicLinksTypes.DynamicLink | null,
  ): void => {
    if (link?.url) {
      setDeeplink(link?.url);
    }
  };

  const getUrlAsync = async (): Promise<void> => {
    // Get the deep link used to open the app from cold state.
    // Required to open app using url like voke://...
    // Don't confuse it with Firebase Dynamic links https://voke.page.link/..
    // These two are not the same thing and needs a differenet approach.
    // 🛑 WARNING! This works only with RN debugger disabled! 🛑
    const newDeeplink = await Linking.getInitialURL();
    // TODO: For Android issues see: https://github.com/facebook/react-native/issues/25675#
    handleDeepLink(newDeeplink);
  };

  // Hide splash screen on load.
  useMount(() => {
    getTimeSinceStartup().then(time => {
      dispatch({
        type: REDUX_ACTIONS.SET_STARTUP_TIME,
        data: time,
      });
    });

    getUrlAsync();
    checkInitialNotification();
    RNBootSplash.hide({ duration: 250 }); // Hide splash screen.
    if (!isLoggedIn && userId) {
      dispatch(getMeAction());
    }
  });

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
    Linking.addEventListener('url', handleDeepLink);
  }, []);

  useEffect(() => {
    // Opened the app from link.
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link);
      });
    // Opened Firebase Dynamic Link while the app in the background (hot mode).
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // Component unmounted, remove the listener
    return (): void => unsubscribe();
  }, []);

  useEffect(() => {
    if (deeplink) {
      let campaign = '';
      let medium = '';
      let source = '';

      const tempLink: string[] = decodeURIComponent(deeplink).split('?');
      let linkParams = '';
      tempLink.forEach(str => {
        if (str.includes('utm_')) {
          linkParams = str;
        }
      });
      const linkParts = linkParams.split('&');
      linkParts.forEach(part => {
        const [param, value] = part.split('=');
        switch (param) {
          case 'utm_campaign':
            campaign = value;
            break;
          case 'utm_medium':
            medium = value;
            break;
          case 'utm_source':
            source = value;
            break;
        }
      });

      if (userId) {
        // Update user account with campaign data,
        // but only when userId available
        dispatch(
          updateMe({
            utm: {
              source: source,
              campaign: campaign,
              medium: medium,
            },
          }),
        );
      }
    }
  }, [deeplink, dispatch, userId]);

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

  // Make screen names meaningfull for Analytic reports.
  const analyticsRenameRoute = (routeName: string) => {
    let newName = '';

    switch (routeName) {
      case 'AdventureName':
        newName = 'Share - Friend Name';
        break;

      case 'AdventureShareCode':
        newName = 'Share - Code';
        break;

      default:
        newName = routeName;
        break;
    }

    return newName;
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        onStateChange={async state => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = getActiveRouteName(state);

          if (previousRouteName !== currentRouteName) {
            // Google Analytics: Record screen change.
            // https://rnfirebase.io/analytics/screen-tracking#react-navigation
            analytics().logScreenView({
              screen_name: analyticsRenameRoute(currentRouteName),
              screen_class: 'NavigationContainer',
            });
          }
          // Save the current route name for later comparision
          routeNameRef.current = currentRouteName;
        }}
        // linking={linking} - not working.
        // initialState={ ( isLoggedIn ? ({ index: 0, routes: [{ name: 'LoggedInApp' }] }) : ({ index: 0, routes: [{ name: 'WelcomeApp' }] }) ) }
        // initialState={ ( isLoggedIn ? ({ index: 0, routes: [{ name: 'LoggedInApp' }] }) : ({ index: 0, routes: [{ name: 'WelcomeApp' }] }) ) }
      >
        <Host>
          <AppStack.Navigator
            screenOptions={{
              headerShown: true,
            }}
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
