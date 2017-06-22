import React, { Component } from 'react';
import { Linking } from 'react-native';

import SettingsList from '../../components/SettingsList';

class About extends Component {
  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
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

export default About;
