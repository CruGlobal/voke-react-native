import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  TouchableOpacity,
} from 'react-native';
import RNImagePicker from 'react-native-image-picker';

const IMAGE_PICKER_OPTIONS = {
  title: 'Select Image', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  // customButtons: {
  //   '': '', // [Button Text] : [String returned upon selection]
  // },
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  // videoQuality: 'high', // 'low', 'medium', or 'high'
  // durationLimit: 10, // video recording max time in seconds
  maxWidth: 600, // photos only
  // maxHeight: 800, // photos only
  quality: 0.75, // 0 to 1, photos only
  allowsEditing: false, // Built in functionality to resize/reposition the image after selection
  noData: true, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
    cameraRoll: true, // ios only - image will NOT be backed up to icloud
    skipBackup: true, // ios only - image will NOT be backed up to icloud
    path: 'images', // ios only - will save image at /Documents/images rather than the root
  },
};

class ImagePicker extends Component {

  constructor(props) {
    super(props);
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {
    RNImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        // console.log('RNImagePicker Error: ', response.error);
        // TODO: Figure out better error messaging for image picker errors
        Alert.alert(
          'Error',
          'There was an error processing your request. Please try again later.',
          [{ text: 'Ok' }]
        );
      } else {
        // You can display the image using either data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data, isStatic: true };

        let payload = {
          // imageBinary: `data:image/jpeg;base64,${response.data}`,
          fileSize: response.fileSize,
          fileName: response.fileName,
          width: response.width,
          height: response.height,
          isVertical: response.isVertical,
          uri: response.uri,
        };
        this.props.onSelectImage(payload);
      }
    });
  }

  render() {
    return (
      <TouchableOpacity onPress={this.selectImage} activeOpacity={0.75}>
        {this.props.children}
      </TouchableOpacity>
    );
  }
}

ImagePicker.propTypes = {
  onSelectImage: PropTypes.func.isRequired, // func with args: (data, callback)
  children: PropTypes.element.isRequired,
};

export default ImagePicker;
