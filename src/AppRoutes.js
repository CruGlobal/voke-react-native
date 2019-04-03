import React from 'react';
import {
  createBottomTabNavigator,
  createStackNavigator,
  StackViewTransitionConfigs,
} from 'react-navigation';
import VokeIcon from './components/VokeIcon';
import { IS_SMALL_ANDROID } from './constants';
import About from './containers/About';
import Acknowledgements from './containers/Acknowledgements';
import Adventures from './containers/Adventures';
import BadgeHomeIcon from './containers/BadgeHomeIcon';
import Channels from './containers/Channels';
import Contacts from './containers/Contacts';
import Conversations from './containers/Conversations';
import CountrySelect from './containers/CountrySelect';
import ForgotPassword from './containers/ForgotPassword';
import Help from './containers/Help';
import KickstartersTab from './containers/KickstartersTab';
import LoadingScreen from './containers/LoadingScreen';
import LoginInput from './containers/LoginInput';
import Menu from './containers/Menu';
import Message from './containers/Message';
import Profile from './containers/Profile';
import SelectFriend from './containers/SelectFriend';
import ShareFlow from './containers/ShareFlow';
import SignUpAccount from './containers/SignUpAccount';
import SignUpFBAccount from './containers/SignUpFBAccount';
import SignUpNumber from './containers/SignUpNumber';
import SignUpNumberVerify from './containers/SignUpNumberVerify';
import SignUpProfile from './containers/SignUpProfile';
import SignUpWelcome from './containers/SignUpWelcome';
import TryItNowName from './containers/TryItNowName';
import VideoContentWrap from './containers/VideoContentWrap';
import Videos from './containers/Videos';
import VideosTab from './containers/VideosTab';
import TryItNowProfilePhoto from './containers/TryItNowProfilePhoto';
import AdventureCode from './containers/AdventureCode';
import i18n from './i18n';
import theme from './theme';
import { buildTrackingObj } from './utils/common';
import ShareEnterName from './containers/ShareEnterName';
import ShareJourneyInvite from './containers/ShareJourneyInvite';

// Do custom animations between pages
const verticalPages = [
  'voke.Menu',
  'voke.VideoContentWrap',
  'voke.CountrySelect',
];
let dynamicModalTransition = (transitionProps, prevTransitionProps) => {
  const tpScenes = ((transitionProps || {}).scenes || []).length || 0;
  const prevTpScenes = ((prevTransitionProps || {}).scenes || []).length || 0;
  const isForward = tpScenes > prevTpScenes;
  let isModal = verticalPages.some(screenName =>
    isForward
      ? screenName === transitionProps.scene.route.routeName
      : prevTransitionProps &&
        screenName === prevTransitionProps.scene.route.routeName,
  );
  return StackViewTransitionConfigs.defaultTransitionConfig(
    transitionProps,
    prevTransitionProps,
    isModal,
  );
};

const ICON_SIZE = theme.isAndroid ? 25 : 26;
const navIcon = icon => ({ tintColor }) => (
  <VokeIcon
    name={icon}
    size={ICON_SIZE}
    style={{
      color: tintColor === theme.lightText ? 'white' : theme.primaryColor,
    }}
  />
);

export const tabs = {
  'voke.Adventures': {
    tracking: buildTrackingObj('adventures', 'home'),
    screen: Adventures,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.adventures'),
      tabBarIcon: navIcon('adventure'),
    }),
  },
  'voke.Conversations': {
    tracking: buildTrackingObj('chat', 'home'),
    screen: Conversations,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('conversations'),
      tabBarIcon: ({ tintColor }) => (
        <BadgeHomeIcon isActive={tintColor === theme.lightText} />
      ),
    }),
  },
  'voke.Videos': {
    tracking: buildTrackingObj('videos', 'home'),
    screen: Videos,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.videos'),
      tabBarIcon: navIcon('video'),
    }),
  },
  'voke.Channels': {
    tracking: buildTrackingObj('channel', 'home'),
    screen: Channels,
    navigationOptions: () => ({
      tabBarLabel: i18n.t('title.channels'),
      tabBarIcon: navIcon('channel'),
    }),
  },
};

const MainTabRoutes = createBottomTabNavigator(tabs, {
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
      paddingBottom: theme.isAndroid ? 0 : 10,
    },
    style: {
      backgroundColor: theme.secondaryColor,
      height: 70,
    },
    scrollEnabled: false,
  },
  swipeEnabled: false,
  initialRouteName: 'voke.Adventures',
  tabBarPosition: 'bottom',
  animationEnabled: false,
  // lazy: false, // Load all tabs right away
  lazy: true,
});
const noGestures = { navigationOptions: { gesturesEnabled: false } };

const screens = {
  'voke.About': {
    screen: About,
    tracking: buildTrackingObj('menu', 'about'),
  },
  'voke.Acknowledgements': {
    screen: Acknowledgements,
    tracking: buildTrackingObj('menu', 'acknowledgements'),
  },
  'voke.CountrySelect': {
    screen: CountrySelect,
    tracking: buildTrackingObj('menu', 'countryselect'),
  },
  'voke.ForgotPassword': {
    screen: ForgotPassword,
    tracking: buildTrackingObj('entry', 'forgotpassword'),
  },
  'voke.Help': {
    screen: Help,
    tracking: buildTrackingObj('menu', 'help'),
  },
  'voke.KickstartersTab': {
    screen: KickstartersTab,
    tracking: buildTrackingObj('chat', 'kickstarters'),
  },
  'voke.Loading': {
    screen: LoadingScreen,
    tracking: buildTrackingObj('loading', 'loading'),
  },
  'voke.LoginInput': {
    screen: LoginInput,
    tracking: buildTrackingObj('entry', 'signin'),
  },
  'voke.Message': {
    screen: Message,
    tracking: buildTrackingObj('chat', 'conversation'),
  },
  'voke.Profile': {
    screen: Profile,
    tracking: buildTrackingObj('menu', 'profile'),
  },
  'voke.SignUpAccount': {
    screen: SignUpAccount,
    tracking: buildTrackingObj('entry', 'createaccount'),
  },
  'voke.SignUpFBAccount': {
    screen: SignUpFBAccount,
    tracking: buildTrackingObj('entry', 'createaccountfb'),
  },
  'voke.SignUpNumber': {
    screen: SignUpNumber,
    tracking: buildTrackingObj('menu', 'signupmobile'),
    ...noGestures,
  },
  'voke.SignUpNumberVerify': {
    screen: SignUpNumberVerify,
    tracking: buildTrackingObj('menu', 'verifymobile'),
    ...noGestures,
  },
  'voke.SignUpProfile': {
    screen: SignUpProfile,
    tracking: buildTrackingObj('entry', 'profile'),
    ...noGestures,
  },
  'voke.SignUpWelcome': {
    screen: SignUpWelcome,
    tracking: buildTrackingObj('entry', 'screen1'),
  },
  'voke.Menu': {
    screen: Menu,
    tracking: buildTrackingObj('menu', 'home'),
  },
  'voke.Contacts': {
    screen: Contacts,
    tracking: buildTrackingObj('contacts', 'share'),
  },
  'voke.SelectFriend': {
    screen: SelectFriend,
    tracking: buildTrackingObj('contacts', 'selectfriend'),
  },
  // 'voke.VideoDetails': {
  //   screen: VideoDetails,
  //   tracking: buildTrackingObj('video', 'preview'),
  //   ...noGestures,
  // },
  'voke.VideosTab': {
    screen: VideosTab,
    tracking: buildTrackingObj('video', 'all'),
  },
  'voke.TryItNowName': {
    screen: TryItNowName,
    tracking: buildTrackingObj('share', 'tryitnowname'),
  },
  'voke.ShareFlow': {
    screen: ShareFlow,
    tracking: buildTrackingObj('share', 'flow'),
  },
  'voke.VideoContentWrap': {
    screen: VideoContentWrap,
  },
  'voke.TryItNowProfilePhoto': {
    screen: TryItNowProfilePhoto,
  },
  'voke.AdventureCode': {
    screen: AdventureCode,
  },
  'voke.ShareEnterName': {
    screen: ShareEnterName,
  },
  'voke.ShareJourneyInvite': {
    screen: ShareJourneyInvite,
  },
};

export const trackableScreens = {
  ...screens,
};

export const MainStackRoutes = createStackNavigator(
  {
    ...screens,
    MainTabs: {
      screen: MainTabRoutes,
      ...noGestures,
    },
  },
  {
    initialRouteName: 'MainTabs',
    transitionConfig: dynamicModalTransition,
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export const MainRoutes = MainStackRoutes;
