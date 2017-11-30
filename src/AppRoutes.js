import React from 'react';
import {StackNavigator, TabNavigator} from 'react-navigation';

import LoadingScreen from './containers/LoadingScreen';
import Login from './containers/Login';
import LoginInput from './containers/LoginInput';
import Home from './containers/Home';
import Videos from './containers/Videos';
import Menu from './containers/Menu';
import About from './containers/About';
import Profile from './containers/Profile';
import Acknowledgements from './containers/Acknowledgements';
import Message from './containers/Message';
import VideoDetails from './containers/VideoDetails';
import SelectFriend from './containers/SelectFriend';
import Contacts from './containers/Contacts';
import KickstartersTab from './containers/KickstartersTab';
import VideosTab from './containers/VideosTab';
import SignUpAccount from './containers/SignUpAccount';
import SignUpProfile from './containers/SignUpProfile';
import SignUpNumber from './containers/SignUpNumber';
import SignUpNumberVerify from './containers/SignUpNumberVerify';
import SignUpWelcome from './containers/SignUpWelcome';
import CountrySelect from './containers/CountrySelect';
import ThemeSelect from './containers/ThemeSelect';
import Help from './containers/Help';
import ForgotPassword from './containers/ForgotPassword';
import SignUpFBAccount from './containers/SignUpFBAccount';
import Modal from './containers/Modal';
import AndroidReportModal from './containers/AndroidReportModal';
import ShareModal from './containers/ShareModal';
import Channels from './containers/Channels';


import {Icon} from './components/common';

import theme from './theme';

// Do custom animations between pages
// import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
// const customAnimationFunc = () => ({
//   screenInterpolator: (sceneProps) => {
//     if (
//       sceneProps.index === 0 &&
//       sceneProps.scene.route.routeName !== 'MainNavigator' &&
//       sceneProps.scenes.length > 2
//     ) return null;
//     return CardStackStyleInterpolator.forVertical(sceneProps);
//   },
// });

const navIcon = (name) => ({tintColor}) => <Icon name={name} size={30} style={{color: tintColor}} />;


export const MainTabRoutes = TabNavigator({
  'voke.Home': {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: navIcon('plus'),
    },
  },
  'voke.Videos': {
    screen: Videos,
    navigationOptions: {
      tabBarLabel: 'Videos',
      tabBarIcon: navIcon('plus'),
    },
  },
  'voke.Channels': {
    screen: Channels,
    navigationOptions: {
      tabBarLabel: 'Channels',
      tabBarIcon: navIcon('plus'),
    },
  },
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    style: {backgroundColor: theme.white},
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.inactiveColor,
    tabStyle: {backgroundColor: theme.lightBackgroundColor},
  },
  tabBarPosition: 'bottom',
  animationEnabled: false,
  lazy: false, // Load all tabs right away
});


export const MainStackRoutes = StackNavigator({
  'voke.Loading': { screen: LoadingScreen },
  'voke.Login': { screen: Login },
  'voke.LoginInput': { screen: LoginInput },
  'voke.Menu': { screen: Menu },
  'voke.Message': { screen: Message },
  'voke.About': { screen: About },
  'voke.Help': { screen: Help },
  'voke.Profile': { screen: Profile },
  'voke.Acknowledgements': { screen: Acknowledgements },
  'voke.VideoDetails': { screen: VideoDetails },
  'voke.SelectFriend': { screen: SelectFriend },
  'voke.Contacts': { screen: Contacts },
  'voke.KickstartersTab': { screen: KickstartersTab },
  'voke.VideosTab': { screen: VideosTab },
  'voke.SignUpAccount': { screen: SignUpAccount },
  'voke.SignUpProfile': { screen: SignUpProfile },
  'voke.SignUpNumber': { screen: SignUpNumber },
  'voke.SignUpNumberVerify': { screen: SignUpNumberVerify },
  'voke.SignUpWelcome': { screen: SignUpWelcome },
  'voke.CountrySelect': { screen: CountrySelect },
  'voke.ThemeSelect': { screen: ThemeSelect },
  'voke.ForgotPassword': { screen: ForgotPassword },
  'voke.SignUpFBAccount': { screen: SignUpFBAccount },
  'voke.Modal': { screen: Modal },
  'voke.AndroidReportModal': { screen: AndroidReportModal },
  'voke.ShareModal': { screen: ShareModal },
  MainTabs: {screen: MainTabRoutes},
}, {
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
