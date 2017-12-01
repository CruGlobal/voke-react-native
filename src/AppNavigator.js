import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers } from 'react-navigation';
import { MainRoutes } from './AppRoutes';
import { navigateBack } from './actions/nav';

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
      return false;
    }
    dispatch(navigateBack());
    return true;
  }
  
  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: nav });
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