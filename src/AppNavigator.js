import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { createReduxBoundAddListener } from 'react-navigation-redux-helpers';

import { MainRoutes } from './AppRoutes';
import { navigateBack } from './actions/nav';

const addListener = createReduxBoundAddListener('root');


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
    // LOG('nav', nav);
    // Don't go back if the user is on the mainTabs already
    if (nav.routes[nav.index].routeName === 'MainTabs') {
      // TODO: Get android back button to go to the initial tab when user is on the MainTabs and the key is not 0
      return false;
    }
    dispatch(navigateBack());
    return true;
  }
  
  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: nav, addListener });
    return <MainRoutes navigation={navigation} />;
  }
}

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = ({ nav }) => ({
  nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);