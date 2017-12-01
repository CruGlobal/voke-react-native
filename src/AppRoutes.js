import React from 'react';
import { Image, Easing, Animated } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

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

import HOME_ICON from '../images/chats_icon.png';
import VIDEOS_ICON from '../images/video_icon.png';
import CHANNELS_ICON from '../images/channelsIcon.png';
import HOME_ICON_INACTIVE from '../images/chats_icon.png';
import VIDEOS_ICON_INACTIVE from '../images/video_icon.png';
import CHANNELS_ICON_INACTIVE from '../images/channelsIcon.png';

const navIcon = (active, inactive) => ({tintColor}) => (
  <Image
    source={tintColor === theme.primaryColor ? active : inactive}
    style={{width: 30, height: 30}}
  />
);


export const MainTabRoutes = TabNavigator({
  'voke.Home': {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: navIcon(HOME_ICON, HOME_ICON_INACTIVE),
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
    activeBackgroundColor: theme.convert({ color: theme.secondaryColor, lighten: 0.1 }),
    inactiveBackgroundColor: theme.secondaryColor,
    // style: { backgroundColor: theme.secondaryColor },
    activeTintColor: theme.primaryColor,
    inactiveTintColor: theme.lightText,
    // tabStyle: { backgroundColor: theme.secondaryColor },
  },
  tabBarPosition: 'bottom',
  animationEnabled: false,
  lazy: false, // Load all tabs right away
});

const ModalNavigator = StackNavigator(
  {
    'voke.Contacts': { screen: Contacts },
    'voke.SelectFriend': { screen: SelectFriend },
    'voke.VideoDetails': { screen: VideoDetails },
    'voke.ShareModal': { screen: ShareModal },
  },
  {
    initialRouteName: 'voke.VideoDetails',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
  }
);


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
  'voke.Menu': { screen: Menu },
  'voke.Message': { screen: Message },
  'voke.Modal': { screen: Modal },
  'voke.Profile': { screen: Profile },
  'voke.SignUpAccount': { screen: SignUpAccount },
  'voke.SignUpFBAccount': { screen: SignUpFBAccount },
  'voke.SignUpNumber': { screen: SignUpNumber },
  'voke.SignUpNumberVerify': { screen: SignUpNumberVerify },
  'voke.SignUpProfile': { screen: SignUpProfile },
  'voke.SignUpWelcome': { screen: SignUpWelcome },
  'voke.ThemeSelect': {
    screen: ThemeSelect,
    // mode: 'card',
    // cardStyle: {
    //   backgroundColor: 'transparent',
    // },
    // transitionConfig: { isModal: true },
    // navigationOptions: { gesturesEnabled: false },
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
  },
  'voke.VideosTab': { screen: VideosTab },
  DetailsModal: { screen: ModalNavigator },
  MainTabs: { screen: MainTabRoutes },
}, {
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
