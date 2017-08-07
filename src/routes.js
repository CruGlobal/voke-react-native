// import React from 'react';
// import { Platform } from 'react-native';
//
// import Home from './containers/Home';
// import Menu from './containers/Menu';
//
// import VideosButton from './containers/VideosButton';
// import Videos from './containers/Videos';
// import HeaderLogo from './components/HeaderLogo';
// import theme from './theme';

import { Navigation } from 'react-native-navigation';

import LoadingScreen from './containers/LoadingScreen';
import Login from './containers/Login';
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
import MessageTabView from './containers/MessageTabView';
import SignUpAccount from './containers/SignUpAccount';
import SignUpProfile from './containers/SignUpProfile';
import SignUpNumber from './containers/SignUpNumber';
import SignUpNumberVerify from './containers/SignUpNumberVerify';
import SignUpWelcome from './containers/SignUpWelcome';
import CountrySelect from './containers/CountrySelect';


// TODO: Wrap each of these in a HoC where we inject the navigation actions
export default function(store, Provider) {
  Navigation.registerComponent('voke.Loading', () => LoadingScreen, store, Provider);
  Navigation.registerComponent('voke.Login', () => Login, store, Provider);
  Navigation.registerComponent('voke.Home', () => Home, store, Provider);
  Navigation.registerComponent('voke.Menu', () => Menu, store, Provider);
  Navigation.registerComponent('voke.Message', () => Message, store, Provider);
  Navigation.registerComponent('voke.About', () => About, store, Provider);
  Navigation.registerComponent('voke.Profile', () => Profile, store, Provider);
  Navigation.registerComponent('voke.Acknowledgements', () => Acknowledgements, store, Provider);
  Navigation.registerComponent('voke.Videos', () => Videos, store, Provider);
  Navigation.registerComponent('voke.VideoDetails', () => VideoDetails, store, Provider);
  Navigation.registerComponent('voke.SelectFriend', () => SelectFriend, store, Provider);
  Navigation.registerComponent('voke.Contacts', () => Contacts, store, Provider);
  Navigation.registerComponent('voke.KickstartersTab', () => KickstartersTab, store, Provider);
  Navigation.registerComponent('voke.VideosTab', () => VideosTab, store, Provider);
  Navigation.registerComponent('voke.MessageTabView', () => MessageTabView, store, Provider);
  Navigation.registerComponent('voke.SignUpAccount', () => SignUpAccount, store, Provider);
  Navigation.registerComponent('voke.SignUpProfile', () => SignUpProfile, store, Provider);
  Navigation.registerComponent('voke.SignUpNumber', () => SignUpNumber, store, Provider);
  Navigation.registerComponent('voke.SignUpNumberVerify', () => SignUpNumberVerify, store, Provider);
  Navigation.registerComponent('voke.SignUpWelcome', () => SignUpWelcome, store, Provider);
  Navigation.registerComponent('voke.CountrySelect', () => CountrySelect, store, Provider);
}






// See https://reactnavigation.org/docs/navigators/stack
// const Routes = {
//   Login: {
//     screen: Login,
//     navigationOptions: {
//       header: null,
//     },
//   },
//   Home: {
//     screen: Home,
//     navigationOptions: {
//       headerTitle: <HeaderLogo />,
//       headerRight: Platform.OS === 'android' ? <MenuButton /> : <VideosButton />,
//       headerLeft: Platform.OS === 'android' ? null : <MenuButton />,
//       headerBackTitle: 'Back',
//     },
//   },
//   Menu: {
//     screen: Menu,
//     navigationOptions: {
//       headerRight: <BackNavButton text="Done" />,
//       headerLeft: null,
//     },
//   },
//   Videos: {
//     screen: Videos,
//     navigationOptions: {
//       headerStyle: {
//         backgroundColor: theme.headerBackgroundColor,
//         borderBottomWidth: 0,
//         shadowOffset: { width: 0, height: 0 },
//         shadowOpacity: 0,
//       },
//       headerTitle: <HeaderLogo />,
//       headerLeft: <BackNavButton icon="home" iconStyle={{fontSize: 30}} style={{paddingLeft: 10}} />,
//     },
//   },
//   VideoDetails: {
//     screen: VideoDetails,
//     navigationOptions: {
//       headerLeft: <BackNavButton text="Back" style={{paddingLeft: 10}} />,
//     },
//   },
//   About: {
//     screen: About,
//     navigationOptions: {
//       title: 'About',
//     },
//   },
//   Profile: {
//     screen: Profile,
//     navigationOptions: {
//       title: 'Profile',
//     },
//   },
//   Acknowledgements: {
//     screen: Acknowledgements,
//     navigationOptions: {
//       title: 'Acknowledgements',
//     },
//   },
//   Message: {
//     screen: Message,
//     navigationOptions: {
//       headerTintColor: theme.messageHeaderTextColor,
//     },
//   },
// };
//
// export default Routes;
