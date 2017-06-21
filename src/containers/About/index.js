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
    return (
      <SettingsList
        items={[
          {
            name: 'Visit Voke Website',
            onPress: () => this.handleLink('https://www.vokeapp.com'),
          },
          {
            name: 'Like Us on Facebook',
            onPress: () => this.handleLink('https://www.facebook.com'),
          },
        ]}
      />
    );
  }
}

export default About;
