import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import RNImagePicker from 'react-native-image-crop-picker';

import { Touchable } from '../common';

// See https://github.com/ivpusic/react-native-image-crop-picker#request-object
const OPTIONS = {
  mediaType: 'photo',
  width: 600,
  height: 600,
  cropping: true,
  showCropGuidelines: false,
  compressImageQuality: 0.75,
  cropperCircleOverlay: true,
  // includeBase64: false,
};

class ImagePicker extends Component {

  constructor(props) {
    super(props);
    this.selectImage = this.selectImage.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentWillUnmount() {
    // Remove tmp files
    RNImagePicker.clean();
  }

  handleResponse(response) {
    const payload = {
      // imageBinary: response.data,
      fileSize: response.size,
      width: response.width,
      height: response.height,
      uri: response.path,
    };
    this.props.onSelectImage(payload);
  }

  handleError(err) {
    LOG('error getting picture', err);
  }

  selectImage() {
    Alert.alert(
      'Where is your photo?',
      'Would you like to select a photo or take a new picture?',
      [
        {
          text: 'Select picture',
          onPress: () => RNImagePicker.openPicker(OPTIONS).then(this.handleResponse).catch(this.handleError),
        },
        {
          text: 'Take a new picture',
          onPress: () => RNImagePicker.openCamera(OPTIONS).then(this.handleResponse).catch(this.handleError),
        },
      ]
    );
  }

  render() {
    return (
      <Touchable onPress={this.selectImage}>
        {this.props.children}
      </Touchable>
    );
  }
}

ImagePicker.propTypes = {
  onSelectImage: PropTypes.func.isRequired, // func with args: (data, callback)
  children: PropTypes.element.isRequired,
};

export default ImagePicker;
