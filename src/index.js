import { AppRegistry, unstable_enableLogBox } from 'react-native';
import Root from './Root';
import { name as appName } from './app.json';
import 'react-native-gesture-handler'; // Required for React Navigation.
import firebase from '@react-native-firebase/app';

// Unlike the Firebase Web SDK, there is no need to manually call the initializeApp method with your project credentials. The native Android & iOS SDKs automatically connect to your Firebase project using the credentials provided during the Getting Started installation steps. 
// firebase.initializeApp();

// unstable_enableLogBox();
AppRegistry.registerComponent(appName, () => Root);
