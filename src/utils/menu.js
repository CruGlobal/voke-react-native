import { Linking } from 'react-native';
import Communications from 'react-native-communications';

import { logoutAction } from '../actions/auth';
import CONSTANTS from '../constants';
import theme from '../theme';

// This is used by the android <MenuButton /> and the iOS <Menu />
export function navMenuOptions({ dispatch, navigatePush, navigateResetLogin, isAnonUser } = {}) {
  let authButtons = [];
  if (isAnonUser) {
    authButtons.push({
      id: 'signin',
      name: 'Sign In',
      onPress: () => navigatePush && navigatePush('voke.LoginInput'),
    });
    authButtons.push({
      id: 'createaccount',
      name: 'Create Account',
      onPress: () => navigatePush && navigatePush('voke.SignUpAccount'),
    });
  } else {
    authButtons.push({
      id: 'signout',
      name: 'Sign Out',
      onPress: () => {
        dispatch && dispatch(logoutAction()).then(() => {
          navigateResetLogin && navigateResetLogin();
        });
      },
    });
  }
  return [
    // {
    //   id: 'country',
    //   name: 'Country Codes',
    //   onPress: () => navigatePush && navigatePush('voke.CountrySelect', {
    //     onSelect: (c) => LOG('country selected', c),
    //   }),
    // },
    {
      id: 'profile',
      name: 'Profile',
      onPress: () => navigatePush && navigatePush('voke.Profile'),
    },
    {
      id: 'invite',
      name: 'Invite Friend',
      onPress: () => navigatePush && navigatePush('voke.Contacts', {
        isInvite: true,
        onSelect: (c) => {
          LOG('Invite this person:', c);
          let phone = c.phone && c.phone[0] ? c.phone[0] : null;
          LOG(phone);
          let message = 'Check out this awesome app! https://vokeapp.com';
          Communications.textWithoutEncoding(phone, message);
        },
      }),
    },
    {
      id: 'about',
      name: 'About',
      onPress: () => navigatePush && navigatePush('voke.About'),
    },
    {
      id: 'review',
      name: 'Write a Review',
      onPress: () => {
        let link;
        if (!theme.isAndroid) {
          link = CONSTANTS.IOS_STORE_LINK;
        } else {
          link = CONSTANTS.ANDROID_STORE_LINK;
        }
        if (link) {
          Linking.canOpenURL(link).then((isSupported) => {
            isSupported && Linking.openURL(link);
          }, (err) => LOG('opening url', err));
        }
      },
    },
    {
      id: 'instagram',
      name: 'Follow us on Instagram',
      onPress: () => {
        let link = CONSTANTS.WEB_URLS.INSTAGRAM;
        Linking.canOpenURL(link).then((isSupported) => {
          isSupported && Linking.openURL(link);
        }, (err) => LOG('error opening url', err));
      },
    },
    {
      id: 'facebook',
      name: 'Like us on Facebook',
      onPress: () => {
        let link = CONSTANTS.WEB_URLS.FACEBOOK;
        Linking.canOpenURL(link).then((isSupported) => {
          isSupported && Linking.openURL(link);
        }, (err) => LOG('error opening url', err));
      },
    },
    {
      id: 'acknowledgements',
      name: 'Acknowledgements',
      onPress: () => navigatePush && navigatePush('voke.Acknowledgements'),
    },
    {
      id: 'help',
      name: 'Help',
      onPress: () => navigatePush && navigatePush('voke.Help'),
    },
    {
      id: 'onboarding',
      name: 'Onboarding',
      onPress: () => navigatePush && navigatePush('voke.SignUpWelcome', { noSignIn: true }),
    },
    ...authButtons,
  ];
}
