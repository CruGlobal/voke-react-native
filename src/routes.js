import React from 'react';
import LogoutButton from './containers/LogoutButton';
import MenuButton from './containers/MenuButton';
import theme from './theme';

import Login from './containers/Login';
import Home from './containers/Home';
import Menu from './containers/Menu';
import Message from './containers/Message';

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
      headerRight: <LogoutButton />,
      headerLeft: <MenuButton />,
    },
  },
  Menu: {
    screen: Menu,
    navigationOptions: {
      headerRight: <LogoutButton />,
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
