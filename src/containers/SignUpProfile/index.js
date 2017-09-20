import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { updateMe } from '../../actions/auth';
import ImagePicker from '../../components/ImagePicker';
import Analytics from '../../utils/analytics';

import { Flex, Icon, Button } from '../../components/common';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';

class SignUpProfile extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };


  constructor(props) {
    super(props);

    this.state= {
      imageUri: null,
      firstName: '',
      lastName: '',
    };

    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }

  componentDidMount() {
    Analytics.screen('SignUp Profile');
  }

  handleImageChange(data) {
    this.setState({ imageUri: data.uri });
    if (data.uri) {
      const updateData = {
        avatar: {
          fileName: `new_user_${Date.now()}.png`,
          uri: data.uri,
          // base64: data.imageBinary,
        },
      };
      this.props.dispatch(updateMe(updateData));
    }
  }

  addProfile() {
    const { firstName, lastName } = this.state;
    if (firstName && lastName) {
      let data = {
        me: {
          first_name: firstName,
          last_name: lastName,
        },
      };
      this.props.dispatch(updateMe(data)).then(() => {
        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert('Please fill in your first and last name', '');
    }
    // // This is just for testing
    // this.props.navigatePush('voke.SignUpNumber');
  }

  renderImagePicker() {
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          {
            this.state.imageUri ? (
              <Image source={{ uri: this.state.imageUri }} style={styles.image} />
            ) : (
              <Flex align="center" justify="center">
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
        <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeader title="Create Profile" />
          <Flex value={1} align="center" justify="start" style={styles.inputs}>
            {this.renderImagePicker()}
            <SignUpInput
              value={this.state.firstName}
              onChangeText={(text) => this.setState({ firstName: text })}
              placeholder="First Name"
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
            <SignUpInput
              ref={(c) => this.lastName = c}
              value={this.state.lastName}
              onChangeText={(text) => this.setState({ lastName: text })}
              placeholder="Last Name"
              autoCapitalize="words"
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
        </TouchableOpacity>
      </Flex>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpProfile);
