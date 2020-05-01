import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';
import { startupAction } from './actions/auth';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import { useSafeArea } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Welcome from './containers/Welcome';
import Menu from './containers/Menu';
import MenuHelp from './containers/MenuHelp';
import MenuAbout from './containers/MenuAbout';
import MenuAcknowledgements from './containers/MenuAcknowledgements';
import AccountSignIn from './containers/AccountSignIn';
import AccountProfile from './containers/AccountProfile';
import AccountCreate from './containers/AccountCreate';
import AccountForgotPassword from './containers/AccountForgotPassword';
import AccountGetConversations from './containers/AccountGetConversations';
import Adventures from './containers/Adventures';
import AdventureAvailable from './containers/AdventureAvailable';
import VideoDetails from './containers/VideoDetails';
import AdventureStart from './containers/AdventureStart';
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
import TabBar from './components/TabBar';
import theme from './theme';
import st from './st';
import HeaderRight from './components/HeaderRight';
import HeaderLeft from './components/HeaderLeft';
import Touchable from './components/Touchable';
import Text from './components/Text';
import { useMount } from './utils';

// https://reactnavigation.org/docs/stack-navigator#options
const defaultHeaderConfig = {
  headerStyle: {
    backgroundColor: theme.colors.secondary,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'normal',
  },
  headerLeft: () => <HeaderLeft />,
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
  headerTintColor: theme.colors.white,
  // headerBackTitle: ' ',
  // headerLeft: () => <HeaderLeft  hasBack={true} />,
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
  // Make top bar visible dynamically.
  navigation.setOptions({
    tabBarVisible: route.state ? !(route.state.index > 0) : null,
  });
  return (
    <AdventureStack.Navigator
      screenOptions={{
        ...defaultHeaderConfig,
      }}
    >
      <AdventureStack.Screen name="Adventures" component={Adventures} />
      <AdventureStack.Screen
        name="AdventureAvailable"
        component={AdventureAvailable}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureCode"
        component={AdventureCode}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureStart"
        component={AdventureStart}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureName"
        component={AdventureName}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureShareCode"
        component={AdventureShareCode}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureActive"
        component={AdventureActive}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureStepScreen"
        component={AdventureStepScreen}
        options={{ headerShown: false }}
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

function VideoStackScreens({ navigation, route }: any) {
  const VideoStack = createStackNavigator();
  // TODO: extract into utility function.
  navigation.setOptions({
    tabBarVisible: route.state ? !(route.state.index > 0) : null,
  });
  return (
    <VideoStack.Navigator screenOptions={defaultHeaderConfig}>
      <VideoStack.Screen name="Videos" component={Videos} />
      <VideoStack.Screen
        name="VideoDetails"
        component={VideoDetails}
        options={{ headerShown: false }}
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

const NotificationStackScreens = () => {
  console.log('⏩ NotificationStackScreens');
  const NotificationStack = createStackNavigator();
  return (
    <NotificationStack.Navigator
      mode="card"
      screenOptions={defaultHeaderConfig}
    >
      <NotificationStack.Screen
        name="Notifications"
        component={Notifications}
      />
    </NotificationStack.Navigator>
  );
};

const LoggedInAppContainer = () => {
  const dispatch = useDispatch();
  const Tabs = createBottomTabNavigator();
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
          title: 'Adventures',
        }}
      />
      <Tabs.Screen
        name="Videos"
        component={VideoStackScreens}
        options={{
          title: 'Videos',
        }}
      />
      <Tabs.Screen
        name="Notifications"
        component={NotificationStackScreens}
        options={{
          title: 'Notifications',
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

const App = () => {
  // Quickly clears local storage for debugging.
  // AsyncStorage.clear();
  // Extract store.auth.isLoggedIn value.
  const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
  const AppStack = createStackNavigator();
  const routeNameRef = React.useRef();
  const navigationRef = React.useRef();
  const insets = useSafeArea();

  // Hide splash screen on load.
  useMount(() => SplashScreen.hide());

  React.useEffect(() => {
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
  }, []);

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

      // initialState={ ( isLoggedIn ? ({ index: 0, routes: [{ name: 'LoggedInApp' }] }) : ({ index: 0, routes: [{ name: 'WelcomeApp' }] }) ) }
    >
      <AppStack.Navigator
        screenOptions={
          {
            // headerShown: false
          }
        }
      >
        {isLoggedIn ? (
          <AppStack.Screen
            name="LoggedInApp"
            component={LoggedInAppContainer}
            options={{
              headerShown: false,
            }}
          />
        ) : (
          <AppStack.Screen
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
        <AppStack.Screen
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
          }}
        />
        <AppStack.Screen
          name="AccountPhoto"
          component={AccountPhoto}
          options={({ navigation }) => ({
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top, // TODO: Check if it really works here?
            },
            headerRight: () => (
              <Touchable
                // style={[st.p5, st.pl4, st.mb3]}
                onPress={() => navigation.navigate('LoggedInApp')}
              >
                <Text style={[st.white, st.fs16, st.pr5]}>Skip</Text>
              </Touchable>
              // <Button onPress={() => navigation.navigate('LoggedInApp')} title="Skip" />
            ),
            title: '',
            // headerShown: true,
          })}
        />
        <AppStack.Screen
          name="Menu"
          component={Menu}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => (
              <Touchable onPress={() => navigation.goBack()}>
                <Text style={[st.white, st.mr4, st.fs16]}>Done</Text>
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
            title: 'Settings',
          })}
        />
        <AppStack.Screen
          name="AccountCreate"
          component={AccountCreate}
          options={{
            ...altHeaderConfig,
            title: 'Create Account',
            headerShown: true,
            /* headerStyle: {
              backgroundColor: theme.colors.primary,
              paddingTop: insets.top // TODO: Check if it really works here?
            }, */
          }}
        />
        <AppStack.Screen
          name="AccountSignIn"
          component={AccountSignIn}
          options={{
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top, // TODO: Check if it really works here?
            },
            title: 'Sign In',
            // headerShown: true,
          }}
        />
        <AppStack.Screen
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
        <AppStack.Screen
          name="Profile"
          component={AccountProfile}
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
            title: 'Profile',
          })}
        />
        <AppStack.Screen
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
            title: 'Sign Up',
          })}
        />
        <AppStack.Screen
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
            title: 'Help Center',
          })}
        />
        <AppStack.Screen
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
            title: 'About Voke',
          })}
        />
        <AppStack.Screen
          name="OldConversations"
          component={AccountGetConversations}
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
            title: 'Get my Old Conversations',
          })}
        />
        <AppStack.Screen
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
            title: 'Acknowledgements',
          })}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
