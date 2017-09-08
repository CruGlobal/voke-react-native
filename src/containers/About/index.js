import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';

import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';
import SettingsList from '../../components/SettingsList';

function setButtons() {
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

class About extends Component {
  static navigatorStyle = {
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
    const versionBuild = '1.0';
    return (
      <SettingsList
        items={[
          {
            name: 'Visit Voke Website',
            onPress: () => this.handleLink('https://www.vokeapp.com'),
          },
          {
            name: 'Follow us on Facebook',
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
          {
            name: 'Terms of Service',
            onPress: () => this.handleLink('https://www.vokeapp.com/terms-in-app/'),
          },
          {
            name: 'Privacy Policy',
            onPress: () => this.handleLink('https://www.vokeapp.com/privacy-in-app/'),
          },
          {
            name: `Version: ${versionBuild}`,
            onPress: () => {},
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
