import React, { Component } from 'react';
import { Linking } from 'react-native';

import theme from '../../theme';
import SettingsList from '../../components/SettingsList';

class Acknowledgements extends Component {
  static navigatorStyle = {
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };

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
