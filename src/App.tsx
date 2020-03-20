import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './containers/Login';
import Welcome from './containers/Welcome';
import Home from './containers/Home';
import MusicPlayerModal from './containers/MusicPlayerModal';
import FilterModal from './containers/FilterModal';
import SearchModal from './containers/SearchModal';
import Adventures from './containers/Adventures';
import InfoModal from './containers/InfoModal';
import PlaylistDetail from './containers/PlaylistDetail';
import ArtistDetail from './containers/ArtistDetail';
import CreateName from './containers/CreateName';
import CreateProfilePhoto from './containers/CreateProfilePhoto';
import AsyncStorage from '@react-native-community/async-storage';
import TabBar from './components/TabBar';
import st from './st';
import HeaderRight from './components/HeaderRight';
import HeaderLeft from './components/HeaderLeft';

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

  function AdventureStackScreens() {
    return (
      <AdventureStack.Navigator screenOptions={defaultHeaderConfig}>
        <AdventureStack.Screen name="Adventures" component={Adventures} />
        <AdventureStack.Screen
          name="PlaylistDetail"
          component={PlaylistDetail}
          options={{ headerLeft: () => <HeaderLeft hasBack={true} /> }}
        />
        <AdventureStack.Screen
          name="ArtistDetail"
          component={ArtistDetail}
          options={{ headerLeft: () => <HeaderLeft hasBack={true} /> }}
        />
      </AdventureStack.Navigator>
    );
  }

  function VideoStackScreens() {
    return (
      <VideoStack.Navigator screenOptions={defaultHeaderConfig}>
        <VideoStack.Screen name="Featured" component={Home} />
      </VideoStack.Navigator>
    );
  }

  function NotificationStackScreens() {
    return (
      <NotificationStack.Navigator
        mode="card"
        screenOptions={defaultHeaderConfig}
      >
        <NotificationStack.Screen
          name="Favorite"
          component={MusicPlayerModal}
        />
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
      <MainStack.Screen name="InfoModal" component={InfoModal} />
      <MainStack.Screen
        name="FilterModal"
        component={FilterModal}
        options={{ cardStyle: { backgroundColor: st.colors.transparent } }}
      />
      <MainStack.Screen
        name="SearchModal"
        component={SearchModal}
        options={{ cardStyle: { backgroundColor: st.colors.transparent } }}
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
  AsyncStorage.clear();
  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedInAppContainer /> : <WelcomeAppContainer />}
    </NavigationContainer>
  );
};

export default App;
