import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navMenuOptions } from '../../utils/menu';
import { navigateAction } from '../../actions/navigation';
import { logoutAction } from '../../actions/auth';

import SettingsList from '../../components/SettingsList';

class Menu extends Component {
  render() {
    return <SettingsList items={navMenuOptions(this.props.dispatch)} />;
    const { dispatch } = this.props;
    return (
      <SettingsList
        items={[
          { name: 'Profile', onPress: () => dispatch(navigateAction('Profile')) },
          { name: 'About', onPress: () => dispatch(navigateAction('About')) },
          { name: 'Write a Review', onPress: () => dispatch(navigateAction('Home')) },
          { name: 'Acknowledgements', onPress: () => dispatch(navigateAction('Acknowledgements')) },
          { name: 'Help', onPress: () => dispatch(navigateAction('Home')) },
          { name: 'Sign Out', onPress: () => dispatch(logoutAction()) },
        ]}
      />
    );
>>>>>>> changed button containers to take in icon and set up video list and video actions
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Menu);
