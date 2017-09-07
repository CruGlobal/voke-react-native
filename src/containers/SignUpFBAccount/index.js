import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TextInput, ScrollView, KeyboardAvoidingView, Alert, Linking, Image } from 'react-native';
import ImagePicker from '../../components/ImagePicker';


import styles from './styles';
import { createAccountAction, updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';

import { Flex, Text, Button, Icon } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

class SignUpFBAccount extends Component {
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
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      emailValidation: false,
      imageUri: '',
    };
    this.createAccount = this.createAccount.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }

  createAccount() {
    // PUT THIS BACK IN, JUST FOR TESTING
    // if (this.state.emailValidation && this.state.password) {
    if (this.state.password) {
      this.props.dispatch(createAccountAction(this.state.email, this.state.password)).then((results) => {
        if (results.errors) {
          Alert.alert('Error', `${results.errors}`);
        }
        else {
          this.props.navigatePush('voke.SignUpProfile');
        }
      });
    } else {
      Alert.alert('Please enter a valid email and password','');
    }
  }

  checkEmail(text) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)) {
      this.setState({ emailValidation: true });
    } else { this.setState({ emailValidation: false }); }
    this.setState({ email: text });
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
    LOG('image selected');
  }

  addProfile() {
    const { imageUri, firstName, lastName, email } = this.state;
    if (firstName && lastName && email) {
      let data = {
        me: {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
        avatar: imageUri,
      };
      this.props.dispatch(updateMe(data)).then(()=>{
        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert('Please fill in your first name, last name, and email', '');
    }
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
      <ScrollView style={styles.container} value={1} align="center" justify="center">
        <KeyboardAvoidingView
          behavior="padding"
        >
          <StatusBar />
          <SignUpHeader
            title="Create Account"
          />
          <Flex value={1} align="center" justify="start" style={styles.inputs}>
            {this.renderImagePicker()}
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.firstName}
              onChangeText={(text) => this.setState({ firstName: text })}
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={theme.accentColor}
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
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={false}
            />
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.email}
              onChangeText={(text) => this.checkEmail(text)}
              multiline={false}
              placeholder="Email"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCapitalize="none"
              autoCorrect={false}
              underlineColorAndroid="transparent"
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Create Account"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.createAccount}
              />
            </Flex>
          </Flex>
          <Flex direction="column">
            <Text style={styles.legalText}>By creating an account you agree to our </Text>
            <Flex direction="row" align="center" justify="center">
              <Button
                text="Privacy Policy"
                type= "transparent"
                buttonTextStyle={styles.legalLinkText}
                style={styles.legalLink}
                onPress={() => this.handleLink('https://www.vokeapp.com/privacy-in-app/')}
              />
              <Text style={styles.legalText}>and
              </Text>
              <Button
                text="Terms of Service"
                type= "transparent"
                buttonTextStyle={styles.legalLinkText}
                style={styles.legalLink}
                onPress={() => this.handleLink('https://www.vokeapp.com/terms-in-app/')}
              />
            </Flex>
          </Flex>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

SignUpFBAccount.propTypes = {
  ...NavPropTypes,
  me: PropTypes.object,
};

export default connect(null, nav)(SignUpFBAccount);
