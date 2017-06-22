import React from 'react';
import { Platform } from 'react-native';

import Login from './containers/Login';
import Home from './containers/Home';
import Menu from './containers/Menu';
import About from './containers/About';
import Profile from './containers/Profile';
import Acknowledgements from './containers/Acknowledgements';
import Message from './containers/Message';

import VideosButton from './containers/VideosButton';
import BackNavButton from './containers/BackNavButton';
import Videos from './containers/Videos';
import VideoDetails from './containers/VideoDetails';
import MenuButton from './containers/MenuButton';
import HeaderLogo from './components/HeaderLogo';
import theme from './theme';

// See https://reactnavigation.org/docs/navigators/stack
const Routes = {
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    },
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: <HeaderLogo />,
      headerRight: Platform.OS === 'android' ? <MenuButton /> : <VideosButton />,
      headerLeft: Platform.OS === 'android' ? null : <MenuButton />,
      headerBackTitle: 'Back',
    },
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      headerRight: <BackNavButton text="Done" />,
      headerLeft: null,
    },
  },
  Videos: {
    screen: Videos,
    navigationOptions: {
      headerStyle: {
        backgroundColor: theme.headerBackgroundColor,
        borderBottomWidth: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      },
      headerTitle: <HeaderLogo />,
      headerLeft: <BackNavButton icon="home" iconStyle={{fontSize: 30}} style={{paddingLeft: 10}} />,
    },
  },
  VideoDetails: {
    screen: VideoDetails,
    navigationOptions: {
      headerLeft: <BackNavButton text="Back" style={{paddingLeft: 10}} />,
    },
  },
  About: {
    screen: About,
    navigationOptions: {
      title: 'About',
    },
  },
  Profile: {
    screen: Profile,
    navigationOptions: {
      title: 'Profile',
    },
  },
  Acknowledgements: {
    screen: Acknowledgements,
    navigationOptions: {
      title: 'Acknowledgements',
    },
  },
  Message: {
    screen: Message,
    navigationOptions: {
      headerTintColor: theme.messageHeaderTextColor,
    },
  },
};

export default Routes;
