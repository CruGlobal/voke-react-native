import React, { Component } from 'react';
import { Linking } from 'react-native';

import SettingsList from '../../components/SettingsList';

class Acknowledgements extends Component {
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
            name: 'Crashlytics',
            onPress: () => this.handleLink('https://try.crashlytics.com/'),
          },
          {
            name: 'React Native',
            onPress: () => this.handleLink('https://facebook.github.io/react-native/'),
          },
        ]}
      />
    );
  }
}

export default Acknowledgements;
