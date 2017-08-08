import React, { Component } from 'react';
import { Image, TextInput } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { iconsMap } from '../../utils/iconMap';
import ImagePicker from '../../components/ImagePicker';
import theme from '../../theme';
import VOKE_LOGO from '../../../images/vokeLogo.png';

import { Flex, Icon, Text, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

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
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
    console.warn('image selected');
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
              <Image source={image} style={styles.image} />
            ) : (
              <Flex align="center" justify="center" style={styles.imageCover}>
                <Icon name="camera-alt" style={styles.photoIcon} size={32} />
              </Flex>
            )
          }
        </Flex>
      </ImagePicker>
    );
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <SignUpHeader title="Create Profile" />
        <Flex value={1} align="center" justify="start" style={styles.inputs}>
          {this.renderImagePicker()}
          <TextInput
            onFocus={() => {}}
            onBlur={() => {}}
            value={this.state.firstName}
            onChangeText={(text) => this.setState({ firstName: text })}
            multiline={false}
            placeholder="First Name"
            placeholderTextColor={theme.secondaryColor}
            style={styles.inputBox}
            autoCorrect={false}
          />
          <TextInput
            onFocus={() => {}}
            onBlur={() => {}}
            value={this.state.lastName}
            onChangeText={(text) => this.setState({ lastName: text })}
            multiline={false}
            placeholder="Last Name"
            placeholderTextColor={theme.secondaryColor}
            style={styles.inputBox}
            autoCorrect={false}
          />
          <Flex value={1} align="center" justify="end">
            <Button
              text="Next"
              buttonTextStyle={styles.signInButton}
              style={styles.actionButton}
              onPress={this.addProfile}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpProfile);
