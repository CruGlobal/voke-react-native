import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import Routes from './routes';

export const AppNavigator = StackNavigator(Routes, {
  navigationOptions: {
    title: ({ state }) => {
      if (state.params) {
        return `${state.params.title}`;
      }
    },
  },
});

const AppWithNavState = ({ dispatch, navigationState }) => (
  <AppNavigator
    navigation={addNavigationHelpers({
      dispatch,
      state: navigationState,
    })}
  />
);

AppWithNavState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigationState: PropTypes.object.isRequired,
};

const mapStateToProps = ({ navigation }) => ({
  navigationState: navigation,
});

export default connect(mapStateToProps)(AppWithNavState);