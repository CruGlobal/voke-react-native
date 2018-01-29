import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';


export function navigatePush(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.navigate({
      routeName: screen,
      params: props,
    }));
  };
}

export function navigateBack(key = null) {
  return (dispatch) => {
    dispatch(NavigationActions.back({ key }));
  };
}

export function navigateResetTo(screen, props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: screen }),
      ],
    }));
  };
}

export function navigateResetHome(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('MainTabs'));
  };
}

export function navigateResetLogin(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.SignUpWelcome'));
  };
}

export function navigateResetToNumber(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.SignUpNumber'));
  };
}

export function navigateResetToProfile(options) {
  return (dispatch) => {
    dispatch(navigateResetTo('voke.SignUpProfile'));
  };
}

export function navigateResetMessage(props = {}) {
  return (dispatch) => {
    dispatch(NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'MainTabs' }),
        NavigationActions.navigate({ routeName: 'voke.Message', params: props }),
      ],
    }));
  };
}

export const NavPropTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  navigatePush: PropTypes.func.isRequired, // Redux
  navigateBack: PropTypes.func.isRequired, // Redux
  navigateResetHome: PropTypes.func.isRequired, // Redux
  navigateResetLogin: PropTypes.func.isRequired, // Redux
  navigateResetToNumber: PropTypes.func.isRequired, // Redux
  navigateResetToProfile: PropTypes.func.isRequired, // Redux
  navigateResetMessage: PropTypes.func.isRequired, // Redux
  navigateResetTo: PropTypes.func.isRequired, // Redux
};

// Redux connect function for navigator screens
export default (dispatch) => {
  return {
    dispatch,
    navigatePush: debounce((...args) => dispatch(navigatePush(...args)), 50),
    navigateBack: (...args) => dispatch(navigateBack(...args)),
    navigateResetHome: (...args) => dispatch(navigateResetHome(...args)),
    navigateResetLogin: (...args) => dispatch(navigateResetLogin(...args)),
    navigateResetToNumber: (...args) => dispatch(navigateResetToNumber(...args)),
    navigateResetToProfile: (...args) => dispatch(navigateResetToProfile(...args)),
    navigateResetMessage: (...args) => dispatch(navigateResetMessage(...args)),
    navigateResetTo: (...args) => dispatch(navigateResetTo(...args)),
  };
};