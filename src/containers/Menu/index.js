import React, { Component } from 'react';
import { connect } from 'react-redux';

import { navMenuOptions } from '../../utils/menu';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import SettingsList from '../../components/SettingsList';

class Menu extends Component {
  render() {
    return <SettingsList items={navMenuOptions(this.props.dispatch)} />;
  }
}

Menu.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Menu);
