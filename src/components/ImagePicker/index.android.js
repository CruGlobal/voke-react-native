import React, { Component } from 'react';
import PropTypes from 'prop-types';
import RNImagePicker from 'react-native-image-crop-picker';

import { Touchable } from '../common';

// See https://github.com/ivpusic/react-native-image-crop-picker#request-object
const OPTIONS = {
  mediaType: 'photo',
  width: 600,
  height: 600,
  cropping: true,
  // showCropGuidelines: true,
  compressImageQuality: 0.75,
  cropperCircleOverlay: true,
  // includeBase64: false,
};

class ImagePicker extends Component {

  constructor(props) {
    super(props);
    this.selectImage = this.selectImage.bind(this);
  }

  componentWillUnmount() {
    // Remove tmp files
    RNImagePicker.clean();
  }

  selectImage() {
    RNImagePicker.openPicker(OPTIONS).then((response) => {
      const payload = {
        // imageBinary: response.data,
        fileSize: response.size,
        width: response.width,
        height: response.height,
        uri: response.path,
      };
      this.props.onSelectImage(payload);
    }).catch(() => {
      
    });
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
