import { Linking } from 'react-native';
import Communications from 'react-native-communications';

import { logoutAction, showLanguageModal } from '../actions/auth';
import CONSTANTS from '../constants';
import theme from '../theme';
import i18n from '../i18n';
// This is used by the android <MenuButton /> and the iOS <Menu />
export function navMenuOptions(
  { dispatch, navigatePush, navigateResetLogin, isAnonUser } = {},
) {
  let createButton = [];
  let signinButton = [];
  let logoutButton = [];
  if (!isAnonUser) {
    logoutButton.push({
      id: 'signout',
      name: i18n.t('signOut'),
      onPress: () => {
        dispatch &&
          dispatch(logoutAction()).then(() => {
            navigateResetLogin && navigateResetLogin();
          });
      },
    });
  }
  if (isAnonUser) {
    signinButton.push({
      id: 'signin',
      name: i18n.t('signIn'),
      onPress: () => navigatePush && navigatePush('voke.LoginInput'),
    });
    createButton.push({
      id: 'createaccount',
      name: i18n.t('createAccount'),
      onPress: () => navigatePush && navigatePush('voke.SignUpAccount'),
    });
  }
  return [
    {
      id: 'profile',
      name: i18n.t('title.profile'),
      onPress: () => navigatePush && navigatePush('voke.Profile'),
    },
    ...createButton,
    ...signinButton,
    {
      id: 'invite',
      name: i18n.t('inviteFriend'),
      onPress: () =>
        navigatePush &&
        navigatePush('voke.Contacts', {
          isInvite: true,
          onSelect: c => {
            LOG('Invite this person:', c);
            let phone = c.phone && c.phone[0] ? c.phone[0] : null;
            LOG(phone);
            let message = 'Check out this awesome app! https://vokeapp.com';
            Communications.textWithoutEncoding(phone, message);
          },
        }),
    },
    {
      id: 'review',
      name: i18n.t('writeReview'),
      onPress: () => {
        let link;
        if (!theme.isAndroid) {
          link = CONSTANTS.IOS_STORE_LINK;
        } else {
          link = CONSTANTS.ANDROID_STORE_LINK;
        }
        if (link) {
          Linking.canOpenURL(link).then(
            isSupported => {
              isSupported && Linking.openURL(link);
            },
            err => LOG('opening url', err),
          );
        }
      },
    },
    {
      id: 'instagram',
      name: i18n.t('followInstagram'),
      onPress: () => {
        let link = CONSTANTS.WEB_URLS.INSTAGRAM;
        Linking.canOpenURL(link).then(
          isSupported => {
            isSupported && Linking.openURL(link);
          },
          err => LOG('error opening url', err),
        );
      },
    },
    {
      id: 'help',
      name: i18n.t('title.help'),
      onPress: () => navigatePush && navigatePush('voke.Help'),
    },
    {
      id: 'about',
      name: i18n.t('title.about'),
      onPress: () => navigatePush && navigatePush('voke.About'),
    },
    ...logoutButton,
  ];
}
