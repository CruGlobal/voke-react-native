import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigateAction } from '../../actions/navigation';

import SettingsList from '../../components/SettingsList';

class Menu extends Component {
  static navigationOptions = {
    title: 'Menu',
  };
  render() {
    const { dispatch } = this.props;
    return (
      <SettingsList
        items={[
          { name: 'Profile', onPress: () => dispatch(navigateAction('Home')) },
          { name: 'About', onPress: () => dispatch(navigateAction('About')) },
          { name: 'Write a Review', onPress: () => dispatch(navigateAction('Home')) },
          { name: 'Acknowledgements', onPress: () => dispatch(navigateAction('Acknowledgements')) },
          { name: 'Help', onPress: () => dispatch(navigateAction('Home')) },
          { name: 'Sign Out', onPress: () => dispatch(navigateAction('Home')) },
        ]}
      />
    );
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Menu);
