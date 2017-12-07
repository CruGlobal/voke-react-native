import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ScrollView, KeyboardAvoidingView, Alert, Linking, Image } from 'react-native';
import ImagePicker from '../../components/ImagePicker';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';

import { Flex, Text, Button, Icon } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import CONSTANTS from '../../constants';

class SignUpFBAccount extends Component {
  constructor(props) {
    super(props);
    const { me } = this.props;
    this.state = {
      email: me ? me.email : '',
      firstName: me ? me.first_name : '',
      lastName: me ? me.last_name : '',
      emailValidation: false,
      imageUri: me ? me.picture.data.url : '',
    };
    this.checkEmail = this.checkEmail.bind(this);
    this.handleLink = this.handleLink.bind(this);
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }
  
  componentDidMount() {
    Analytics.screen('Create profile from Facebook Account');
  }

  checkEmail(text) {
    const emailValidation = CONSTANTS.EMAIL_REGEX.test(text);
    this.setState({ email: text, emailValidation });
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  handleImageChange(data) {
    this.setState({ imageUri: data.uri });
    if (data.uri) {
      const me = this.props.me;
      const fileName = me ? `${me.first_name}_${me.last_name}.png` : `new_user_${Date.now()}.png`;
      const updateData = {
        avatar: {
          fileName,
          uri: data.uri,
          // base64: data.imageBinary,
        },
      };
      this.props.dispatch(updateMe(updateData));
    }
  }

  addProfile() {
    const { firstName, lastName, email } = this.state;
    if (firstName && lastName && email) {
      let data = {
        me: {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
      };
      this.props.dispatch(updateMe(data)).then(() => {
        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert('Please fill in your first name, last name, and email', '');
    }
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
      <ScrollView style={styles.container} value={1} align="center" justify="center">
        <KeyboardAvoidingView behavior="padding">
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <SignUpHeader title="Create Account" />
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
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.email.focus()}
            />
            <SignUpInput
              ref={(c) => this.email = c}
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder="Email"
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Create Account"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.addProfile}
              />
            </Flex>
          </Flex>
          <Flex direction="column">
            <Text style={styles.legalText}>By creating an account you agree to our </Text>
            <Flex direction="row" align="center" justify="center">
              <Button
                text="Privacy Policy"
                type="transparent"
                buttonTextStyle={styles.legalLinkText}
                style={styles.legalLink}
                onPress={() => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY)}
              />
              <Text style={styles.legalText}>and
              </Text>
              <Button
                text="Terms of Service"
                type="transparent"
                buttonTextStyle={styles.legalLinkText}
                style={styles.legalLink}
                onPress={() => this.handleLink(CONSTANTS.WEB_URLS.TERMS)}
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
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(SignUpFBAccount);
