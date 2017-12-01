import React from 'react';
import { Image, Easing, Animated } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import BadgeHomeIcon from './containers/BadgeHomeIcon';

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
import AndroidReportModal from './containers/AndroidReportModal';
import ShareModal from './containers/ShareModal';
import Channels from './containers/Channels';


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

import VIDEOS_ICON from '../images/video_icon.png';
import CHANNELS_ICON from '../images/channelsIcon.png';
import VIDEOS_ICON_INACTIVE from '../images/video_icon.png';
import CHANNELS_ICON_INACTIVE from '../images/channelsIcon.png';

const navIcon = (active, inactive) => ({tintColor}) => (
  <Image
    source={tintColor === theme.primaryColor ? active : inactive}
    style={{ width: 26, height: 26 }}
  />
);


export const MainTabRoutes = TabNavigator({
  'voke.Home': {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <BadgeHomeIcon isActive={tintColor === theme.primaryColor} />,
    },
  },
  'voke.Videos': {
    screen: Videos,
    navigationOptions: {
      tabBarLabel: 'Videos',
      tabBarIcon: navIcon(VIDEOS_ICON, VIDEOS_ICON_INACTIVE),
    },
  },
  'voke.Channels': {
    screen: Channels,
    navigationOptions: {
      tabBarLabel: 'Channels',
      tabBarIcon: navIcon(CHANNELS_ICON, CHANNELS_ICON_INACTIVE),
    },
  },
}, {
  tabBarOptions: {
    showIcon: true,
    showLabel: true,
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.lightText,
    // ios props
    activeBackgroundColor: theme.convert({ color: theme.secondaryColor, lighten: 0.1 }),
    inactiveBackgroundColor: theme.secondaryColor,
    // android props
    iconStyle: { width: 60 },
    tabStyle: { backgroundColor: theme.secondaryColor },
    style: { backgroundColor: theme.secondaryColor },
  },
  initialRouteName: 'voke.Home',
  tabBarPosition: 'bottom',
  animationEnabled: false,
  lazy: false, // Load all tabs right away
});

export const MainStackRoutes = StackNavigator({
  'voke.About': { screen: About },
  'voke.Acknowledgements': { screen: Acknowledgements },
  'voke.AndroidReportModal': { screen: AndroidReportModal },
  'voke.CountrySelect': { screen: CountrySelect },
  'voke.ForgotPassword': { screen: ForgotPassword },
  'voke.Help': { screen: Help },
  'voke.KickstartersTab': { screen: KickstartersTab },
  'voke.Loading': { screen: LoadingScreen },
  'voke.Login': { screen: Login },
  'voke.LoginInput': { screen: LoginInput },
  'voke.Message': { screen: Message },
  'voke.Profile': { screen: Profile },
  'voke.SignUpAccount': { screen: SignUpAccount },
  'voke.SignUpFBAccount': { screen: SignUpFBAccount },
  'voke.SignUpNumber': {
    screen: SignUpNumber,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.SignUpNumberVerify': {
    screen: SignUpNumberVerify,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.SignUpProfile': {
    screen: SignUpProfile,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.SignUpWelcome': { screen: SignUpWelcome },
  'voke.ThemeSelect': {
    screen: ThemeSelect,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.Menu': { screen: Menu },
  'voke.Contacts': { screen: Contacts },
  'voke.SelectFriend': { screen: SelectFriend },
  'voke.VideoDetails': {
    screen: VideoDetails,
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.ShareModal': { screen: ShareModal },

  'voke.VideosTab': { screen: VideosTab },
  // DetailsModal: { screen: ModalNavigator },
  MainTabs: {
    screen: MainTabRoutes,
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
}, {
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
