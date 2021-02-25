import React, { useEffect, useState, ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  NavigationContainer,
  StackActions,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';
import { Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import { useAppState } from '@react-native-community/hooks';
import RNBootSplash from 'react-native-bootsplash';
import { Host } from 'react-native-portalize';
import theme from 'utils/theme';
import st from 'utils/st';
import {
  AppStackParamList,
  NotificationStackParamList,
  RootStackParamList,
} from 'utils/types';
import { useMount } from 'utils';
import { getTimeSinceStartup } from 'react-native-startup-time';
import { REDUX_ACTIONS } from 'utils/constants';

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

const LoggedInAppContainer = () => {
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
      () => LOG(' 🧛‍♂️ startupAction > SUCCESS'),
      (error) => WARN(' 🧚‍♂️ startupAction > ERROR', error),
    );
  }, []);

  return (
    <Tabs.Navigator tabBar={(props) => <TabBar {...props} />}>
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
const getActiveRouteName = (state) => {
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
            options={() => ({
              ...transparentHeaderConfig,
              headerStyle: {
                ...transparentHeaderConfig.headerStyle,
                paddingTop: insets.top, // TODO: Check if it really works here?
              },
              headerRight: () => <></>,
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
            options={() => ({
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

          <RootStack.Screen
            name="AccountEmail"
            component={AccountEmail}
            options={() => ({
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
            options={() => ({
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
            options={() => ({
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
            options={() => ({
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
            options={() => ({
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
            options={() => ({
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
  () => {
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

  const deepLinkListener = (event) => {
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
    getTimeSinceStartup().then((time) => {
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
    if (deeplink) {
    }
  }, [deeplink]);

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
    Linking.addEventListener('url', deepLinkListener);

    // When the is component unmounted, remove the listener
  }, []);

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
        onStateChange={async (state) => {
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
              options={() => ({
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
              options={() => ({
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
              options={() => ({
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
              options={() => ({
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
