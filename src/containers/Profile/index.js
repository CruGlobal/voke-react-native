import React, { Component } from 'react';
import { Linking } from 'react-native';

import SettingsList from '../../components/SettingsList';
import ImagePicker from '../../components/ImagePicker';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
      imageData: null,
    };

    this.handleLink = this.handleLink.bind(this);
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  handleLink(url) {
    Linking.openURL(url);
  }

  renderImagePicker() {
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
      </ImagePicker>
    );
  }

  handleImageChange(data) {
    this.setState({
      imageSource: null,
      imageData: data,
    });
  }

  render() {
    return (
      <SettingsList
        items={[
          {
            name: 'Change Photo',
            onPress: () => this.renderImagePicker(),
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
