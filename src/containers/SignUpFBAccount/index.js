import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Linking,
  Image,
} from 'react-native';
import ImagePicker from '../../components/ImagePicker';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';

import { Flex, Button, Icon } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import PrivacyToS from '../../components/PrivacyToS';
import CONSTANTS, { RESET_ANON_USER } from '../../constants';
import theme from '../../theme';

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
    Analytics.screen(Analytics.s.CreateFacebookAccount);
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
      const fileName = me
        ? `${me.first_name}_${me.last_name}.png`
        : `new_user_${Date.now()}.png`;
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
    const { t } = this.props;
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
        this.props.dispatch({ type: RESET_ANON_USER });

        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert(t('fillInFields'));
    }
  }

  renderImagePicker() {
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          {this.state.imageUri ? (
            <Image source={{ uri: this.state.imageUri }} style={styles.image} />
          ) : (
            <Flex align="center" justify="center">
              <Icon name="camera-alt" style={styles.photoIcon} size={32} />
            </Flex>
          )}
        </Flex>
      </ImagePicker>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <ScrollView
        style={styles.container}
        value={1}
        align="center"
        justify="center"
      >
        <KeyboardAvoidingView
          behavior={theme.isAndroid ? undefined : 'padding'}
        >
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <SignUpHeader title={t('title.createAccount')} />
          <Flex value={1} align="center" justify="start" style={styles.inputs}>
            {this.renderImagePicker()}
            <SignUpInput
              value={this.state.firstName}
              onChangeText={text => this.setState({ firstName: text })}
              placeholder={t('placeholder.firstName')}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
            <SignUpInput
              ref={c => (this.lastName = c)}
              value={this.state.lastName}
              onChangeText={text => this.setState({ lastName: text })}
              placeholder={t('placeholder.lastName')}
              autoCapitalize="words"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => this.email.focus()}
            />
            <SignUpInput
              ref={c => (this.email = c)}
              value={this.state.email}
              onChangeText={this.checkEmail}
              placeholder={t('placeholder.email')}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text={t('next')}
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.addProfile}
              />
            </Flex>
          </Flex>
          <Flex direction="column">
            <PrivacyToS style={styles.legalText} type="create" />
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

export default translate('signUp')(
  connect(
    mapStateToProps,
    nav,
  )(SignUpFBAccount),
);
