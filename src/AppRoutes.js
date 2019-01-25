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
import Adventures from './containers/Adventures';
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
import i18n from './i18n';
import theme from './theme';

// Do custom animations between pages
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
const verticalPages = ['voke.Menu', 'voke.VideoDetails', 'voke.CountrySelect'];
const customAnimationFunc = () => ({
  screenInterpolator: sceneProps => {
    const from = sceneProps.scenes[0];
    const to = sceneProps.scenes[1];
    const current = sceneProps.scene.route.routeName;
    // If navigating to a vertical slide page, don't move the old page away sideways (translateX)
    if (
      from &&
      to &&
      from.route.routeName === current &&
      verticalPages.includes(to.route.routeName)
    ) {
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
import ADVENTURE_ICON from '../images/adventureIcon.png';
import ADVENTURE_ICON_INACTIVE from '../images/adventureInactive.png';
import { IS_SMALL_ANDROID } from './constants';
import { buildTrackingObj } from './utils/common';

const ICON_SIZE = theme.isAndroid ? 25 : 26;
const navIcon = (active, inactive) => ({ tintColor }) => (
  <Image
    resizeMode="contain"
    resizeMethod="scale"
    source={tintColor === theme.lightText ? active : inactive}
    style={{ width: ICON_SIZE, height: ICON_SIZE }}
  />
);

export const tabs = {
  'voke.Home': {
    tracking: buildTrackingObj('chat', 'chat'),
    screen: Home,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('home'),
      tabBarIcon: ({ tintColor }) => (
        <BadgeHomeIcon isActive={tintColor === theme.lightText} />
      ),
    }),
  },
  'voke.Videos': {
    tracking: buildTrackingObj('videos', 'videos'),
    screen: Videos,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.videos'),
      tabBarIcon: navIcon(VIDEOS_ICON, VIDEOS_ICON_INACTIVE),
    }),
  },
  'voke.Channels': {
    tracking: buildTrackingObj('channels', 'channels'),
    screen: Channels,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.channels'),
      tabBarIcon: navIcon(CHANNELS_ICON, CHANNELS_ICON_INACTIVE),
    }),
  },
  'voke.Adventures': {
    tracking: buildTrackingObj('adventures', 'adventures'),
    screen: Adventures,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.adventure'),
      tabBarIcon: navIcon(ADVENTURE_ICON, ADVENTURE_ICON_INACTIVE),
    }),
  },
};

export const MainTabRoutes = TabNavigator(
  {
    ...tabs,
  },
  {
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
      tabStyle: {
        backgroundColor: theme.secondaryColor,
        paddingTop: theme.isAndroid ? 13 : 0,
      },
      labelStyle: {
        fontSize: theme.isAndroid ? (IS_SMALL_ANDROID ? 8 : 10) : 12,
        paddingBottom: theme.isAndroid ? 0 : theme.isIphoneX ? 30 : 10,
      },
      style: {
        backgroundColor: theme.secondaryColor,
        height: theme.isIphoneX ? 90 : 70,
      },
      scrollEnabled: false,
    },
    swipeEnabled: false,
    initialRouteName: 'voke.Home',
    tabBarPosition: 'bottom',
    animationEnabled: false,
    // lazy: false, // Load all tabs right away
    lazy: true,
  },
);
const noGestures = { navigationOptions: { gesturesEnabled: false } };

const screens = {
  'voke.About': {
    screen: About,
    tracking: buildTrackingObj('about', 'about'),
  },
  'voke.Acknowledgements': {
    screen: Acknowledgements,
    tracking: buildTrackingObj('acknowledgements', 'acknowledgements'),
  },
  'voke.CountrySelect': {
    screen: CountrySelect,
    tracking: buildTrackingObj('countryselect', 'countryselect'),
  },
  'voke.ForgotPassword': {
    screen: ForgotPassword,
    tracking: buildTrackingObj('forgotpassword', 'forgotpassword'),
  },
  'voke.Help': {
    screen: Help,
    tracking: buildTrackingObj('help', 'help'),
  },
  'voke.KickstartersTab': {
    screen: KickstartersTab,
    tracking: buildTrackingObj('kickstarterstab', 'kickstarterstab'),
  },
  'voke.Loading': {
    screen: LoadingScreen,
    tracking: buildTrackingObj('loading', 'loading'),
  },
  'voke.LoginInput': {
    screen: LoginInput,
    tracking: buildTrackingObj('logininput', 'logininput'),
  },
  'voke.Message': {
    screen: Message,
    tracking: buildTrackingObj('message', 'message'),
  },
  'voke.Profile': {
    screen: Profile,
    tracking: buildTrackingObj('profile', 'profile'),
  },
  'voke.SignUpAccount': {
    screen: SignUpAccount,
    tracking: buildTrackingObj('signupaccount', 'signupaccount'),
  },
  'voke.SignUpFBAccount': {
    screen: SignUpFBAccount,
    tracking: buildTrackingObj('signupfbaccount', 'signupfbaccount'),
  },
  'voke.SignUpNumber': {
    screen: SignUpNumber,
    tracking: buildTrackingObj('signupnumber', 'signupnumber'),
    ...noGestures,
  },
  'voke.SignUpNumberVerify': {
    screen: SignUpNumberVerify,
    tracking: buildTrackingObj('signupnumberverify', 'signupnumberverify'),
    ...noGestures,
  },
  'voke.SignUpProfile': {
    screen: SignUpProfile,
    tracking: buildTrackingObj('signupprofile', 'signupprofile'),
    ...noGestures,
  },
  'voke.SignUpWelcome': {
    screen: SignUpWelcome,
    tracking: buildTrackingObj('signupwelcome', 'signupwelcome'),
  },
  'voke.Menu': {
    screen: Menu,
    tracking: buildTrackingObj('menu', 'menu'),
  },
  'voke.Contacts': {
    screen: Contacts,
    tracking: buildTrackingObj('contacts', 'contacts'),
  },
  'voke.SelectFriend': {
    screen: SelectFriend,
    tracking: buildTrackingObj('selectfriend', 'selectfriend'),
  },
  'voke.VideoDetails': {
    screen: VideoDetails,
    tracking: buildTrackingObj('videodetails', 'videodetails'),
    ...noGestures,
  },
  'voke.VideosTab': {
    screen: VideosTab,
    tracking: buildTrackingObj('videostab', 'videostab'),
  },
  'voke.TryItNowName': {
    screen: TryItNowName,
    tracking: buildTrackingObj('tryitnowname', 'tryitnowname'),
  },
  'voke.ShareFlow': {
    screen: ShareFlow,
    tracking: buildTrackingObj('shareflow', 'shareflow'),
  },
};

export const trackableScreens = {
  ...screens,
};

export const MainStackRoutes = StackNavigator(
  {
    ...screens,
    MainTabs: {
      screen: MainTabRoutes,
      ...noGestures,
    },
  },
  {
    initialRouteName: 'MainTabs',
    transitionConfig: customAnimationFunc,
    navigationOptions: {
      header: null,
    },
  },
);

export const MainRoutes = MainStackRoutes;
