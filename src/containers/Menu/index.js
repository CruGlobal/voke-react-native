import React, { Component } from 'react';
import { connect } from 'react-redux';
import Analytics from '../../utils/analytics';

import { navMenuOptions } from '../../utils/menu';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';
import theme from '../../theme';
import SettingsList from '../../components/SettingsList';

class Menu extends Component {

  static navigatorButtons = {
    rightButtons: [{
      title: 'Done',
      id: 'home',
      disableIconTint: true,
    }],
  };

  static navigatorStyle = {
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    Analytics.screen('Menu');
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'home') {
        Navigation.dismissModal({
          animationType: 'slide-down',
        });
      }
    }
  }

  render() {
    return <SettingsList items={navMenuOptions(this.props)} />;
  }
}

Menu.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Menu);
