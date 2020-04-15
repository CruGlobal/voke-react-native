import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './containers/Welcome';
import SettingsModal from './containers/SettingsModal';
import HelpModal from './containers/HelpModal';
import AboutModal from './containers/AboutModal';
import SignInModal from './containers/SignInModal';
import ProfileModal from './containers/ProfileModal';
import AccountCreate from './containers/AccountCreate';
import ForgotPasswordModal from './containers/ForgotPasswordModal';
import GetConversationsModal from './containers/GetConversationsModal';
import Adventures from './containers/Adventures';
import AvailableAdventureModal from './containers/AvailableAdventureModal';
import VideoDetailModal from './containers/VideoDetailModal';
import StartAdventureModal from './containers/StartAdventureModal';
import NameAdventureModal from './containers/NameAdventureModal';
import ShareAdventureCodeModal from './containers/ShareAdventureCodeModal';
import ActiveAdventureModal from './containers/ActiveAdventureModal';
import AdventureStepModal from './containers/AdventureStepModal';
import SearchVideosModal from './containers/SearchVideosModal';
import AllMembersModal from './containers/AllMembersModal';
import EnterAdventureCode from './containers/EnterAdventureCode';
import Videos from './containers/Videos';
import Notifications from './containers/Notifications';
import CreateName from './containers/CreateName';
import CreateProfilePhoto from './containers/CreateProfilePhoto';
import GroupModal from './containers/GroupModal';
import AsyncStorage from '@react-native-community/async-storage';
import TabBar from './components/TabBar';
import st from './st';
import HeaderRight from './components/HeaderRight';
import HeaderLeft from './components/HeaderLeft';
import Touchable from './components/Touchable';
import Text from './components/Text';

import { useSafeArea } from 'react-native-safe-area-context';

// https://reactnavigation.org/docs/stack-navigator#options
const defaultHeaderConfig = {
  headerStyle: {
    backgroundColor: st.colors.darkBlue,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitleStyle: {
    color: st.colors.white,
    fontSize: 14,
    fontWeight: 'normal',
  },
  headerLeft: () => <HeaderLeft />,
};

// https://reactnavigation.org/docs/stack-navigator#options
const altHeaderConfig = {
  headerStyle: {
    backgroundColor: st.colors.blue,
    elevation: 0,
    shadowOpacity: 0,
    // paddingTop: insets.top // TODO: Check if it really works here?
  },
  headerTitleStyle: {
    color: st.colors.white,
    fontSize: 18,
    fontWeight: 'normal',
  },
  headerTintColor: st.colors.white,
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
}


const AdventureStack = createStackNavigator();

const AdventureStackScreens = ({ navigation, route }: any) => {
  console.log( '⏩ AdventureStackScreens' );
  // Make top bar visible dynamically.
  navigation.setOptions({
    tabBarVisible: route.state
      ? route.state.index > 0
        ? false
        : true
      : null,
  });
  return (
    <AdventureStack.Navigator
      screenOptions={{
        ...defaultHeaderConfig,
      }}
    >
      <AdventureStack.Screen name="Adventures" component={Adventures} />
      <AdventureStack.Screen
        name="AvailableAdventureModal"
        component={AvailableAdventureModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="EnterAdventureCode"
        component={EnterAdventureCode}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="StartAdventureModal"
        component={StartAdventureModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="NameAdventureModal"
        component={NameAdventureModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="ShareAdventureCodeModal"
        component={ShareAdventureCodeModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="ActiveAdventureModal"
        component={ActiveAdventureModal}
        options={{ headerShown: false }}
      />
      <AdventureStack.Screen
        name="AdventureStepModal"
        component={AdventureStepModal}
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
        name="CreateProfilePhoto"
        component={CreateProfilePhoto}
        options={{ headerShown: false }}
      />
    </AdventureStack.Navigator>
  );
}

function VideoStackScreens({ navigation, route }: any) {
  console.log( '⏩ VideoStackScreens' );
  const VideoStack = createStackNavigator();
  // TODO: extract into utility function.
  navigation.setOptions({
    tabBarVisible: route.state
      ? route.state.index > 0
        ? false
        : true
      : null,
  });
  return (
    <VideoStack.Navigator screenOptions={defaultHeaderConfig}>
      <VideoStack.Screen name="Videos" component={Videos} />
      <VideoStack.Screen
        name="VideoDetailModal"
        component={VideoDetailModal}
        options={{ headerShown: false }}
      />
      <VideoStack.Screen
        name="SearchVideosModal"
        component={SearchVideosModal}
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: st.colors.transparent },
        }}
      />
    </VideoStack.Navigator>
  );
}

const NotificationStackScreens = () => {
  console.log( '⏩ NotificationStackScreens' );
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
}

const LoggedInAppContainer = () => {
  const Tabs = createBottomTabNavigator();
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

  React.useEffect(() => {
    console.log('APP useEffect')
    const state = navigationRef.current.getRootState();
    // Save the initial route name
    routeNameRef.current = getActiveRouteName(state);
    console.log( "routeNameRef.current:" ); console.log( routeNameRef.current );
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={state => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getActiveRouteName(state);
        console.log( "%c🧭 Navigated to / Re-rendered " + currentRouteName, 'color: #bada55' );

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
      <AppStack.Navigator screenOptions={{
        // headerShown: false
        }} >
        { isLoggedIn ? (
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
        ) }
        {/* <AppStack.Screen name="WelcomeApp" component={WelcomeAppContainer} /> */}
        {/* <AppStack.Screen name="Welcome" component={Welcome} /> */}
        {/* Don't hide these Welcome screens under !isLoggedIn
            as we need to access these when editing name and image
            for already logged in users.   */}
        <AppStack.Screen
          name="CreateName"
          component={CreateName}
          options={{
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top // TODO: Check if it really works here?
            },
            title: '',
            // headerShown: true,
          }}
        />
        <AppStack.Screen
          name="CreateProfilePhoto"
          component={CreateProfilePhoto}
          options={ ({ navigation }) =>({
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top // TODO: Check if it really works here?
            },
            headerRight: () => (
              <Touchable
                // style={[st.p5, st.pl4, st.mb3]}
                onPress={() => navigation.navigate('LoggedInApp')}
              >
                <Text
                  style={[st.white, st.fs16, st.pr5]}
                >Skip</Text>
              </Touchable>
              // <Button onPress={() => navigation.navigate('LoggedInApp')} title="Skip" />
            ),
            title: '',
            // headerShown: true,
          })}
        />
        <AppStack.Screen
          name="SettingsModal"
          component={SettingsModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => (
              <Touchable onPress={() => navigation.goBack()}>
                <Text style={[st.white, st.mr4, st.fs16]}>Done</Text>
              </Touchable>
            ),
            headerLeft: () => {},
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'Settings',
          })}
        />
        <AppStack.Screen
          name="AccountCreate"
          component={AccountCreate}
          options={ {
            ...altHeaderConfig,
            title: 'Create Account',
            headerShown: true,
            /* headerStyle: {
              backgroundColor: st.colors.blue,
              paddingTop: insets.top // TODO: Check if it really works here?
            }, */
          } }
        />
        <AppStack.Screen
          name="SignInModal"
          component={SignInModal}
          options={{
            ...transparentHeaderConfig,
            headerStyle: {
              ...transparentHeaderConfig.headerStyle,
              paddingTop: insets.top // TODO: Check if it really works here?
            },
            title: 'Sign In',
            // headerShown: true,
          }}
        />
        <AppStack.Screen
          name="ForgotPassword"
          component={ForgotPasswordModal}

          options={{
            ...defaultHeaderConfig,
            title: 'Get New Password',
            headerShown: true,
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
              paddingTop: insets.top // TODO: Check if it really works here?
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
          }}
        />
         <AppStack.Screen
          name="Profile"
          component={ProfileModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'Profile',
          })}
        />
        <AppStack.Screen
          name="SignUp"
          component={SignUpModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'Sign Up',
          })}
        />
        <AppStack.Screen
          name="Help"
          component={HelpModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'Help Center',
          })}
        />
        <AppStack.Screen
          name="About"
          component={AboutModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'About Voke',
          })}
        />
         <AppStack.Screen
          name="OldConversations"
          component={GetConversationsModal}
          options={({ navigation }) => ({
            headerShown: true,
            headerLeft: () => <HeaderLeft  hasBack= {true} />,
            cardStyle: { backgroundColor: st.colors.transparent },
            headerStyle: {
              backgroundColor: st.colors.blue,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTitleStyle: {
              color: st.colors.white,
              fontSize: 18,
              fontWeight: 'normal',
            },
            title: 'Get my Old Conversations',
          })}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
