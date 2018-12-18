import React, { Component } from 'react';
import { Alert } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';
import RNImagePicker from 'react-native-image-crop-picker';

import { Touchable } from '../common';
import theme from '../../theme';

// See https://github.com/ivpusic/react-native-image-crop-picker#request-object
const OPTIONS = {
  mediaType: 'photo',
  width: 600,
  height: 600,
  cropping: true,
  showCropGuidelines: false,
  // This was causing crashing issues on some Android devices. No need to compress
  // compressImageQuality: 0.75,
  cropperCircleOverlay: true,
  includeBase64: false,
  cropperToolbarColor: theme.primaryColor,
  cropperStatusBarColor: theme.statusBarColor,
};

class ImagePicker extends Component {
  constructor(props) {
    super(props);

    this.state = { hasSelectedImage: false };

    this.selectImage = this.selectImage.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  componentWillUnmount() {
    if (this.state.hasSelectedImage) {
      // Remove tmp files
      RNImagePicker.clean();
    }
  }

  handleResponse(response) {
    this.setState({ hasSelectedImage: true });
    const payload = {
      // imageBinary: response.data,
      fileSize: response.size,
      width: response.width,
      height: response.height,
      uri: response.path,
    };
    LOG('image picker payload', payload);
    this.props.onSelectImage(payload);
  }

  handleError(err) {
    LOG('error getting picture', err);
  }

  selectImage() {
    const { t } = this.props;
    Alert.alert(t('where'), t('selectOrNew'), [
      {
        text: t('select'),
        onPress: () =>
          RNImagePicker.openPicker(OPTIONS)
            .then(this.handleResponse)
            .catch(this.handleError),
      },
      {
        text: t('new'),
        onPress: () =>
          RNImagePicker.openCamera(OPTIONS)
            .then(this.handleResponse)
            .catch(this.handleError),
      },
    ]);
  }

  render() {
    return (
      <Touchable isAndroidOpacity={true} onPress={this.selectImage}>
        {this.props.children}
      </Touchable>
    );
  }
}

ImagePicker.propTypes = {
  onSelectImage: PropTypes.func.isRequired, // func with args: (data, callback)
  children: PropTypes.element.isRequired,
};

export default translate('imagePicker')(ImagePicker);
