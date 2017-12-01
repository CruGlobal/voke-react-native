import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import Analytics from '../../utils/analytics';
import { navMenuOptions } from '../../utils/menu';
import nav, { NavPropTypes } from '../../actions/nav';
import theme from '../../theme';
import SettingsList from '../../components/SettingsList';
import { Button } from '../../components/common';
import Header from '../Header';

class Menu extends Component {

  static navigatorButtons = {
    rightButtons: [{
      title: 'Done',
      id: 'home',
      disableIconTint: true,
    }],
  };

  static navigatorStyle = {
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);

    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            <Button
              type="transparent"
              text="Done"
              buttonTextStyle={{ padding: 10, fontSize: 16 }}
              onPress={() => this.props.navigateBack()}
            />
          }
          title="Settings"
          light={true}
        />
        <SettingsList items={navMenuOptions(this.props)} />
      </View>
    );
  }
}

Menu.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Menu);
