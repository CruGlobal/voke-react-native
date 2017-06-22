import React from 'react';
import { Platform } from 'react-native';

import Login from './containers/Login';
import Home from './containers/Home';
import Menu from './containers/Menu';
import About from './containers/About';
import Acknowledgements from './containers/Acknowledgements';
import Message from './containers/Message';

import LogoutButton from './containers/LogoutButton';
import BackNavButton from './containers/BackNavButton';
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
      headerRight: Platform.OS === 'android' ? <MenuButton /> : <LogoutButton />,
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
  About: {
    screen: About,
    navigationOptions: {
      title: 'About',
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
