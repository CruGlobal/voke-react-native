import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';


import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';
import ImagePicker from '../../components/ImagePicker';
import theme from '../../theme';
import VOKE_LOGO from '../../../images/vokeLogo.png';

import { Flex, Icon, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // Android implements this already
      icon: iconsMap['ios-arrow-back'], // For iOS only
    }],
  };
}

class SignUpProfile extends Component {
  static navigatorStyle = {
    screenBackgroundColor: theme.primaryColor,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.primaryColor,
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
  };


  constructor(props) {
    super(props);
    this.state= {
      imageUri: null,
      firstName: '',
      lastName: '',
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'back') {
        this.props.navigateBack();
      }
    }
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    this.props.navigator.setTitle({ title: 'Create Profile' });
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
  }

  addProfile() {
    this.props.navigatePush('voke.SignUpNumber');
  }

  renderImagePicker() {
    const image = { uri: this.state.imageUri };
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          {
            this.state.imageUri ? (
              <Image source={image}>
              </Image>
            ) : null
          }
          <Flex align="center" justify="center" style={styles.imageCover}>
            <Text style={styles.photoText}>Photo</Text>
          </Flex>
        </Flex>
      </ImagePicker>
    );
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex direction="column" align="center" justify="center" style={styles.headerWrap}>
          <Text style={styles.headerTitle}>Create Profile</Text>
        </Flex>
        <Flex value={1} align="center" justify="center" style={styles.inputs}>
          {this.renderImagePicker()}
          <Text>Input Box 1</Text>
          <Text>Input Box 2</Text>
          <Button
            text="Next"
            buttonTextStyle={styles.signInButton}
            style={styles.actionButton}
            onPress={this.addProfile}
          />
        </Flex>
      </Flex>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpProfile);
