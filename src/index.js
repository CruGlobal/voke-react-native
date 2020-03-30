import { AppRegistry } from 'react-native';
import Root from './Root';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import firebase from '@react-native-firebase/app';

firebase.initializeApp();

AppRegistry.registerComponent(appName, () => Root);
