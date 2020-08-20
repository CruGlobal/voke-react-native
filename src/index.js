import { AppRegistry, unstable_enableLogBox } from 'react-native';
import Root from './Root';
import { name as appName } from './app.json';
import 'react-native-gesture-handler'; // Required for React Navigation.
import firebase from '@react-native-firebase/app';

// firebase.initializeApp();
// unstable_enableLogBox();
AppRegistry.registerComponent(appName, () => Root);
