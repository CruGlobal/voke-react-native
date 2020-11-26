// import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';

import Root from './src/Root';
import { name as appName } from './app.json';

import 'react-native-gesture-handler'; // Required for React Navigation.
import firebase from '@react-native-firebase/app';

AppRegistry.registerComponent(appName, () => Root);
