import React, { Component } from 'react';
import { Image, ScrollView, TouchableOpacity, Keyboard, KeyboardAvoidingView, Alert } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
      const data = {
        me: {
          first_name: firstName,
          last_name: lastName,
        },
      };
      this.props.dispatch(updateMe(data)).then(() => {
        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert('', 'Please fill in your first and last name');
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
      <ScrollView style={styles.container} value={1} keyboardShouldPersistTaps="always">
        <KeyboardAvoidingView behavior="padding">
          <SignUpHeaderBack
            onPress={() => {
              if (this.props.hideBack) {
                this.props.navigateResetLogin();
              } else {
                this.props.navigateBack();
              }
            }}
          />
          <SignUpHeader title="Create Profile" onPress={()=> Keyboard.dismiss()} />
          <Flex value={1} align="center" justify="start" self="stretch" style={styles.inputs}>
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
            <Flex value={1} align="center" justify="end" style={{ paddingTop: 75 }}>
              <Button
                text="Next"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.addProfile}
              />
            </Flex>
          </Flex>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
  hideBack: PropTypes.bool,
};

export default connect(null, nav)(SignUpProfile);
