import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './containers/Welcome';
import SettingsModal from './containers/SettingsModal';
import Adventures from './containers/Adventures';
import AvailableAdventureModal from './containers/AvailableAdventureModal';
import StartAdventureModal from './containers/StartAdventureModal';
import NameAdventureModal from './containers/NameAdventureModal';
import ShareAdventureCodeModal from './containers/ShareAdventureCodeModal';
import ActiveAdventureModal from './containers/ActiveAdventureModal';
import AdventureStepModal from './containers/AdventureStepModal';
import CreateName from './containers/CreateName';
import CreateProfilePhoto from './containers/CreateProfilePhoto';
import AsyncStorage from '@react-native-community/async-storage';
import TabBar from './components/TabBar';
import st from './st';
import HeaderRight from './components/HeaderRight';
import HeaderLeft from './components/HeaderLeft';
import Text from './components/Text';
import Touchable from './components/Touchable';

const LoggedInAppContainer = () => {
  const MainStack = createStackNavigator();
  const AdventureStack = createStackNavigator();
  const VideoStack = createStackNavigator();
  const NotificationStack = createStackNavigator();

  const Tab = createBottomTabNavigator();

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

  function AdventureStackScreens({ navigation, route }: any) {
    navigation.setOptions({
      tabBarVisible: route.state
        ? route.state.index > 0
          ? false
          : true
        : null,
    });
    return (
      <AdventureStack.Navigator screenOptions={defaultHeaderConfig}>
        <AdventureStack.Screen name="Adventures" component={Adventures} />
        <AdventureStack.Screen
          name="AvailableAdventureModal"
          component={AvailableAdventureModal}
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
      </AdventureStack.Navigator>
    );
  }

  function VideoStackScreens() {
    return (
      <VideoStack.Navigator screenOptions={defaultHeaderConfig}>
        <VideoStack.Screen name="Videos" component={Adventures} />
      </VideoStack.Navigator>
    );
  }

  function NotificationStackScreens() {
    return (
      <NotificationStack.Navigator
        mode="card"
        screenOptions={defaultHeaderConfig}
      >
        <NotificationStack.Screen name="Notifications" component={Adventures} />
      </NotificationStack.Navigator>
    );
  }

  function TabNavigator() {
    return (
      <Tab.Navigator tabBar={props => <TabBar {...props} />}>
        <Tab.Screen name="Adventures" component={AdventureStackScreens} />
        <Tab.Screen name="Videos" component={VideoStackScreens} />
        <Tab.Screen name="Notifications" component={NotificationStackScreens} />
      </Tab.Navigator>
    );
  }

  return (
    <MainStack.Navigator
      mode="modal"
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="Tabs" component={TabNavigator} />
      <MainStack.Screen
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
    </MainStack.Navigator>
  );
};

const WelcomeAppContainer = () => {
  const WelcomeStack = createStackNavigator();

  return (
    <WelcomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WelcomeStack.Screen name="Welcome" component={Welcome} />
      <WelcomeStack.Screen name="CreateName" component={CreateName} />
      <WelcomeStack.Screen
        name="CreateProfilePhoto"
        component={CreateProfilePhoto}
      />
    </WelcomeStack.Navigator>
  );
};

const App = () => {
  const isLoggedIn = useSelector(({ auth }: any) => auth.isLoggedIn);
  // AsyncStorage.clear();
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInAppContainer /> : <WelcomeAppContainer />}
    </NavigationContainer>
  );
};

export default App;
