import React, { Component } from 'react';
import { Linking } from 'react-native';

import SettingsList from '../../components/SettingsList';

class Profile extends Component {
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
            name: 'Change Photo',
            onPress: () => {},
          },
          {
            name: 'Change Name',
            onPress: () => {},
          },
        ]}
      />
    );
  }
}

export default Profile;
