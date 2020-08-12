import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import { NavigationContainer, useRoute, useNavigationState, useFocusEffect } from '@react-navigation/native';
import { startupAction, sleepAction, wakeupAction, getMeAction } from './actions/auth';
import { routeNameRef, navigationRef } from './RootNavigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Alert, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSafeArea } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Welcome from './containers/Welcome';
import Menu from './containers/Menu';
import MenuHelp from './containers/MenuHelp';
import MenuAbout from './containers/MenuAbout';
import MenuAcknowledgements from './containers/MenuAcknowledgements';
import AccountSignIn from './containers/AccountSignIn';
import AccountPass from './containers/AccountPass';
import AccountEmail from './containers/AccountEmail';
import AccountProfile from './containers/AccountProfile';
import AccountCreate from './containers/AccountCreate';
import AccountForgotPassword from './containers/AccountForgotPassword';
import Adventures from './containers/Adventures';
import AdventureAvailable from './containers/AdventureAvailable';
import VideoDetails from './containers/VideoDetails';
import AdventureName from './containers/AdventureName';
import AdventureShareCode from './containers/AdventureShareCode';
import AdventureActive from './containers/AdventureActive';
import AdventureStepScreen from './containers/AdventureStepScreen';
import VideosSearch from './containers/VideosSearch';
import AllMembersModal from './containers/AllMembersModal';
import AdventureCode from './containers/AdventureCode';
import Videos from './containers/Videos';
import Notifications from './containers/Notifications';
import AccountName from './containers/AccountName';
import AccountPhoto from './containers/AccountPhoto';
import GroupModal from './containers/GroupModal';
import CustomModal from './containers/CustomModal';
import TabBar from './components/TabBar';
import theme from './theme';
import st from './st';
import HeaderLeft from './components/HeaderLeft';
import Touchable from './components/Touchable';
import Flex from './components/Flex';
import SignOut from './components/SignOut';
import Text from './components/Text';
import Button from './components/Button'
import { useMount } from './utils';
import useAppState from 'react-native-appstate-hook';

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
  headerLeft: () => <HeaderLeft />
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
  headerTitleAlign: 'center',
  headerTintColor: theme.colors.white,
  headerBackTitle: ' ',
  // headerLeft: () => <HeaderLeft hasBack={true} />,
};

const transparentHeaderConfig = {
  ...altHeaderConfig,
  headerStyle: {
    ...altHeaderConfig.headerStyle,
    backgroundColor: 'transparent',
  },
  headerTransparent: true,
};

const AdventureStack = createStackNavigator();

const AdventureStackScreens = ({ navigation, route }: any) => {
  const insets = useSafeArea();
  const { t } = useTranslation('title' );

  // Make top bar visible dynamically.
  navigation.setOptions({
    tabBarVisible: route?.state && route?.state?.type === 'stack' ?
      !(route?.state?.routes.length > 1) :
      null,
  });
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
          headerLeft: () => <HeaderLeft hasBack />,
        }}
      />
      <AdventureStack.Screen
        name="AdventureName"
        component={AdventureName}
        options={{
          title: '',
          headerLeft: () => <HeaderLeft hasBack />,
        }}
      />
      <AdventureStack.Screen
        name="AdventureShareCode"
        component={AdventureShareCode}
        options={{
          ...transparentHeaderConfig,
          headerStyle: {
            ...transparentHeaderConfig.headerStyle,
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: () => <></>,
          headerRight: () => (
            <Touchable
              onPress={
                () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Adventures' }],
                  })
                }}>
              <Text style={[st.white, st.mr4, st.fs16]}>{t('done')}</Text>
            </Touchable>
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
            paddingTop: insets.top,
          },
          title: '',
          headerLeft: () => <HeaderLeft hasBack resetTo='Adventures' />,
          headerRight: undefined,
        }}
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
          headerLeft: () => <HeaderLeft hasBack />,
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
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AccountPhoto"
        component={AccountPhoto}
        options={{ headerShown: false }}
      />
    </AdventureStack.Navigator>
  );
};


const VideoStack = createStackNavigator();
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
          headerLeft: () => <HeaderLeft hasBack />,
        }}
      />
      <VideoStack.Screen
        name="VideosSearch"
        component={VideosSearch}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.transparent },
        }}
      />
    </VideoStack.Navigator>
  );
}

const NotificationStack = createStackNavigator();
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
  const route = useRoute();
  const state = useNavigationState(state => state);
  const routeName = (state.routeNames[state.index]);
  const { t } = useTranslation('title' );



  // Handle iOS & Android appState changes.
  const { appState } = useAppState({
    // Callback function to be executed once appState is changed to
    // active, inactive, or background
    onChange: (newAppState) => console.warn('App state changed to ', newAppState),
    // Callback function to be executed once app go to foreground
    onForeground: async () => {
      // Get the deep link used to open the app
      /* await Linking.getInitialURL().then(
        (data) => {
        }
      ); */

      dispatch(wakeupAction());
    },
    // Callback function to be executed once app go to background
    onBackground: () => {
      console.warn('App went to background');
      dispatch(sleepAction());
    }
  });

  useEffect(() => {
    // Check notifications permission and setup sockets.
    dispatch(startupAction()).then(
      success => LOG(' 🧛‍♂️ startupAction > SUCCESS'),
      error => WARN(' 🧚‍♂️ startupAction > ERROR', error)
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

const RootStack = createStackNavigator();
const RootStackScreens = () => {
  const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
  const firstName = useSelector(({ auth }: any) => auth.user.firstName);
  const insets = useSafeArea();
  const { t } = useTranslation('title');

  return (
    <RootStack.Navigator
      mode="card"
      screenOptions={defaultHeaderConfig}
    >
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
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
            title: '',
            // headerShown: true,
          })}
        />
        <RootStack.Screen
          name="Menu"
          component={Menu}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => (
              <Touchable
                onPress={
                  () => {
                    // Get the index of the route to see if we can go back.
                    let index = navigation.dangerouslyGetState().index;
                    if (index > 0) {
                      navigation.goBack()
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoggedInApp' }],
                      })
                    }
                  }}>
                <Text style={[st.white, st.mr4, st.fs16]}>{t('done')}</Text>
              </Touchable>
            ),
            headerLeft: () => {},
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
            ...altHeaderConfig,
            title: t('createAccount'),
            headerShown: true,
            /* headerStyle: {
              backgroundColor: theme.colors.primary,
              paddingTop: insets.top // TODO: Check if it really works here?
            }, */
          }}
        />
        <RootStack.Screen
          name="AccountSignIn"
          component={AccountSignIn}
          options={{
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top, // TODO: Check if it really works here?
            },
            title: t('signIn'),
            // headerShown: true,
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
          }}
        />
        <RootStack.Screen
          name="AccountProfile"
          component={AccountProfile}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft hasBack resetTo='Menu' />,
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
          name="SignUp"
          component={AccountCreate}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft hasBack />,
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
        />
        <RootStack.Screen
          name="AccountEmail"
          component={AccountEmail}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
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
            headerLeft: () => <HeaderLeft hasBack />,
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
  );
};

const AppStack = createStackNavigator();

const App = () => {
  // Extract store.auth.isLoggedIn value.
  const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
  const userId = useSelector(({ auth }: any) => auth.user?.id);
  const dispatch = useDispatch();
  const { t } = useTranslation(['common', 'profile']);

  // Hide splash screen on load.
  useMount(() => {
    SplashScreen.hide();
    if(!isLoggedIn && userId) {
      dispatch(getMeAction());
    }
  });

  useEffect(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);

    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the is component unmounted, remove the listener
    // return () => unsubscribe();
  }, []);

  const linking = {
    prefixes: ['https://the.vokeapp.com', 'voke:://'],
    config: {
      screens: {
        // "voke:://messenger_journeys/e579effe-3b01-4054-bca7-db912fe463e6/messenger_journey_steps/227a52a4-2025-4770-b792-f51f3f3ab4c0"
        AdventureStepScreen: {
          path: 'messenger_journeys/:adventureId/messenger_journey_steps/:stepId',
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
      console.log( "🐙 getStateFromPath:", {path}, {options}  );
    },

    // Here Chat is the name of the screen that handles the URL /feed, and Profile handles the URL /user.
  };

  return (
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
      linking={linking}

      // initialState={ ( isLoggedIn ? ({ index: 0, routes: [{ name: 'LoggedInApp' }] }) : ({ index: 0, routes: [{ name: 'WelcomeApp' }] }) ) }
    >
      <AppStack.Navigator
        screenOptions={
          {
            // headerShown: false
          }
        }
        mode="modal"
      >
        <AppStack.Screen
            name="Root"
            component={RootStackScreens}
            options={{
              headerShown: false,
            }}
        />
       <AppStack.Screen
          name="CustomModal"
          component={CustomModal}
          // options={{ headerShown: false }}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: false,
            headerRight: () => (
              <Touchable
                onPress={
                  () => {
                    // Get the index of the route to see if we can go back.
                    let index = navigation.dangerouslyGetState().index;
                    if (index > 0) {
                      navigation.goBack()
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoggedInApp' }],
                      })
                    }
                  }}>
                <Text style={[st.white, st.fs18, {
                  paddingHorizontal:theme.spacing.l,
                }]}>{t('close')}</Text>
              </Touchable>
            ),
            cardStyle: { backgroundColor: 'rgba(0,0,0,.9)'},
            headerStyle: {
              backgroundColor: theme.colors.transparent,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: theme.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: '',
          })}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
