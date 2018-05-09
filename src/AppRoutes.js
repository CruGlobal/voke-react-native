import React from 'react';
import { Image } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';

import BadgeHomeIcon from './containers/BadgeHomeIcon';

import LoadingScreen from './containers/LoadingScreen';
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
import TryItNowName from './containers/TryItNowName';
import ShareFlow from './containers/ShareFlow';
import SignUpProfile from './containers/SignUpProfile';
import SignUpNumber from './containers/SignUpNumber';
import SignUpNumberVerify from './containers/SignUpNumberVerify';
import SignUpWelcome from './containers/SignUpWelcome';
import CountrySelect from './containers/CountrySelect';
import Help from './containers/Help';
import ForgotPassword from './containers/ForgotPassword';
import SignUpFBAccount from './containers/SignUpFBAccount';
import Channels from './containers/Channels';


import theme from './theme';

// Do custom animations between pages
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
const verticalPages = ['voke.Menu', 'voke.VideoDetails', 'voke.CountrySelect'];
const customAnimationFunc = () => ({
  screenInterpolator: (sceneProps) => {

    const from = sceneProps.scenes[0];
    const to = sceneProps.scenes[1];
    const current = sceneProps.scene.route.routeName;
    // If navigating to a vertical slide page, don't move the old page away sideways (translateX)
    if (from && to && from.route.routeName === current && verticalPages.includes(to.route.routeName)) {
      return {
        ...CardStackStyleInterpolator.forHorizontal(sceneProps),
        transform: [{ translateX: 0 }],
      };
    }
    if (current && verticalPages.includes(current)) {
      return CardStackStyleInterpolator.forVertical(sceneProps);
    }
    return CardStackStyleInterpolator.forHorizontal(sceneProps);
  },
});

import VIDEOS_ICON from '../images/video_icon.png';
import CHANNELS_ICON from '../images/channelsIcon.png';
import VIDEOS_ICON_INACTIVE from '../images/videosInactive.png';
import CHANNELS_ICON_INACTIVE from '../images/channelsInactive.png';

const ICON_SIZE = theme.isAndroid ? 25 : 26;
const navIcon = (active, inactive) => ({tintColor}) => (
  <Image
    resizeMode="contain"
    resizeMethod="scale"
    source={tintColor === theme.lightText ? active : inactive}
    style={{ width: ICON_SIZE, height: ICON_SIZE }}
  />
);


export const MainTabRoutes = TabNavigator({
  'voke.Home': {
    screen: Home,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => <BadgeHomeIcon isActive={tintColor === theme.lightText} />,
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
    activeTintColor: theme.lightText,
    inactiveTintColor: theme.primaryColor,
    // ios props
    // activeBackgroundColor: theme.convert({ color: theme.secondaryColor, lighten: 0.1 }),
    inactiveBackgroundColor: theme.secondaryColor,
    // android props
    iconStyle: { width: 60 },
    tabStyle: { backgroundColor: theme.secondaryColor, paddingTop: theme.isIphoneX ? 35 : 0 },
    style: { backgroundColor: theme.secondaryColor },
    scrollEnabled: false,
  },
  swipeEnabled: false,
  initialRouteName: 'voke.Home',
  tabBarPosition: 'bottom',
  animationEnabled: false,
  // lazy: false, // Load all tabs right away
  lazy: true,
});
const noGestures = { navigationOptions: { gesturesEnabled: false } };
export const MainStackRoutes = StackNavigator({
  'voke.About': { screen: About },
  'voke.Acknowledgements': { screen: Acknowledgements },
  'voke.CountrySelect': { screen: CountrySelect },
  'voke.ForgotPassword': { screen: ForgotPassword },
  'voke.Help': { screen: Help },
  'voke.KickstartersTab': { screen: KickstartersTab },
  'voke.Loading': { screen: LoadingScreen },
  'voke.LoginInput': { screen: LoginInput },
  'voke.Message': { screen: Message },
  'voke.Profile': { screen: Profile },
  'voke.SignUpAccount': { screen: SignUpAccount },
  'voke.SignUpFBAccount': { screen: SignUpFBAccount },
  'voke.SignUpNumber': {
    screen: SignUpNumber,
    ...noGestures,
  },
  'voke.SignUpNumberVerify': {
    screen: SignUpNumberVerify,
    ...noGestures,
  },
  'voke.SignUpProfile': {
    screen: SignUpProfile,
    ...noGestures,
  },
  'voke.SignUpWelcome': { screen: SignUpWelcome },
  'voke.Menu': { screen: Menu },
  'voke.Contacts': { screen: Contacts },
  'voke.SelectFriend': { screen: SelectFriend },
  'voke.VideoDetails': {
    screen: VideoDetails,
    ...noGestures,
  },
  'voke.VideosTab': { screen: VideosTab },
  'voke.TryItNowName': { screen: TryItNowName },
  'voke.ShareFlow': { screen: ShareFlow },
  MainTabs: {
    screen: MainTabRoutes,
    ...noGestures,
  },
}, {
  initialRouteName: 'MainTabs',
  transitionConfig: customAnimationFunc,
  navigationOptions: {
    header: null,
  },
});

export const MainRoutes = MainStackRoutes;
