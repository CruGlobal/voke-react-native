import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navMenuOptions } from '../../utils/menu';

import SettingsList from '../../components/SettingsList';

class Menu extends Component {
  render() {
    return <SettingsList items={navMenuOptions(this.props.dispatch)} />;
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Menu);
