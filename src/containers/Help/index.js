import React, { Component } from 'react';
import { Linking } from 'react-native';
import BACK_ICON from '../../../images/back-arrow.png';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';

import theme from '../../theme';
import SettingsList from '../../components/SettingsList';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: BACK_ICON, // for icon button, provide the local image asset name
    }],
    rightButtons: [{
      title: 'Done',
      id: 'home',
    }],
  };
}

class Help extends Component {

  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.textColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarRightButtonColor: theme.textColor,
    navBarRightButtonFontSize: 12,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLink = this.handleLink.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
      if (event.id =='home') {
        Navigation.dismissModal({
          animationType: 'slide-down',
        });
      }
    }
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    const versionBuild = '1.0';
    return (
      <SettingsList
        items={[
          {
            name: 'Visit our Help Website',
            onPress: () => this.handleLink('https://www.vokeapp.com'),
          },
          {
            name: 'Visit our FAQ Website',
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
          {
            name: 'Make a Feature Request',
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
          {
            name: 'Report a User',
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
          {
            name: 'Email Us',
            onPress: () => {},
          },
        ]}
      />
    );
  }
}

Help.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Help);
