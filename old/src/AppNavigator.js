import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { createReduxContainer } from 'react-navigation-redux-helpers';

import { MainRoutes } from './AppRoutes';
import { navigateBack } from './actions/nav';

const AppNav = createReduxContainer(MainRoutes);

class AppWithNavigationState extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }
    // Don't go back if the user is on the mainTabs already
    if (nav.routes[nav.index].routeName === 'MainTabs') {
      // TODO: Get android back button to go to the initial tab when user is on the MainTabs and the key is not 0
      return false;
    }
    dispatch(navigateBack());
    return true;
  };

  render() {
    const { nav, language, dispatch } = this.props;
    return <AppNav state={nav} language={language} dispatch={dispatch} />;
  }
}

AppWithNavigationState.propTypes = {
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav, auth }) => ({
  nav,
  language: auth.language,
});

export default connect(mapStateToProps)(AppWithNavigationState);
