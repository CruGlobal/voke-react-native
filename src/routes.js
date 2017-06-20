import React from 'react';
import LogoutButton from './containers/LogoutButton';
import theme from './theme';

import Login from './containers/Login';
import Home from './containers/Home';
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