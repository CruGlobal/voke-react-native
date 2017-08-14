import React, { Component } from 'react';
import { Linking } from 'react-native';
import BACK_ICON from '../../../images/back-arrow.png';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import theme from '../../theme';
import SettingsList from '../../components/SettingsList';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: BACK_ICON, // for icon button, provide the local image asset name
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
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
          {
            name: 'Privacy Policy',
            onPress: () => this.handleLink('https://www.facebook.com'),
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
