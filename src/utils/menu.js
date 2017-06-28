// import { navigateAction } from '../actions/navigation';
import { logoutAction } from '../actions/auth';

// This is used by the android <MenuButton /> and the iOS <Menu />
export function navMenuOptions(dispatch, navigatePush) {
  return [
    {
      id: 'profile',
      name: 'Profile',
      onPress: () => navigatePush && navigatePush('voke.Profile', {}, { title: 'Profile' }),
    },
    {
      id: 'about',
      name: 'About',
      onPress: () => navigatePush && navigatePush('voke.About'),
    },
    {
      id: 'review',
      name: 'Write a Review',
      onPress: () => navigatePush && navigatePush('voke.Home'),
    },
    {
      id: 'acknowledgements',
      name: 'Acknowledgements',
      onPress: () => navigatePush && navigatePush('voke.Acknowledgements'),
    },
    {
      id: 'help',
      name: 'Help',
      onPress: () => navigatePush && navigatePush('voke.Home'),
    },
    {
      id: 'signout',
      name: 'Sign Out',
      onPress: () => dispatch && dispatch(logoutAction()),
    },
    {
      id: 'select',
      name: 'Select Friend',
      onPress: () => navigatePush && navigatePush('voke.SelectFriend', {}, {
        titleImage: require('../../images/vokeLogo.png'),
      }),
    },
    {
      id: 'contacts',
      name: 'Contacts',
      onPress: () => navigatePush && navigatePush('voke.Contacts', {}, {
        title: 'Contacts',
      }),
    },
  ];
}
