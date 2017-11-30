import React, { Component } from 'react';
import { Linking, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import DeviceInfo from 'react-native-device-info';

import nav, { NavPropTypes } from '../../actions/nav';
import Analytics from '../../utils/analytics';

import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';
import SettingsList from '../../components/SettingsList';
import CONSTANTS from '../../constants';

function setButtons() {
  if (Platform.OS === 'ios') {
    return {
      leftButtons: [{
        id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        icon: vokeIcons['back'], // for icon button, provide the local image asset name
      }],
      rightButtons: [{
        title: 'Done',
        id: 'done',
        disableIconTint: true,
      }],
    };
  }
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
  };
}

const VERSION_BUILD = DeviceInfo.getReadableVersion();

class About extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLink = this.handleLink.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  componentDidMount() {
    Analytics.screen('About');
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
      if (event.id =='done') {
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
    return (
      <SettingsList
        items={[
          {
            name: 'Visit Voke Website',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.VOKE),
          },
          {
            name: 'Follow us on Facebook',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FACEBOOK),
          },
          {
            name: 'Terms of Service',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.TERMS),
          },
          {
            name: 'Privacy Policy',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY),
          },
          {
            name: `Version: ${VERSION_BUILD}`,
          },
        ]}
      />
    );
  }
}

About.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(About);
