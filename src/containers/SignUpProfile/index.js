import React, { Component } from 'react';
import {
  Image,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { navigatePush } from '../../actions/nav';
import { updateMe } from '../../actions/auth';
import ImagePicker from '../../components/ImagePicker';
import Analytics from '../../utils/analytics';

import ApiLoading from '../ApiLoading';
import { Flex, Icon, Button } from '../../components/common';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpInput from '../../components/SignUpInput';
import theme from '../../theme';
import st from '../../st';

class SignUpProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUri: null,
      firstName: props.user.first_name,
      lastName: props.user.last_name,
      disableNext: false,
      isLoading: false,
      disableSecondClick: false,
    };

    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
    this.skip = this.skip.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.SignUpProfile);
  }

  uploadImage(uri) {
    if (!uri) return;
    const updateData = {
      avatar: {
        fileName: `${this.props.user.first_name}_${this.props.user.last_name}.png`,
        // fileName: `new_user_${Date.now()}.png`,
        uri,
        // base64: data.imageBinary,
      },
    };
    this.props.dispatch(updateMe(updateData));
  }

  handleImageChange(data) {
    this.setState({ imageUri: data.uri });
    // this.uploadImage(data.uri);
  }

  addProfile() {
    const { t, dispatch } = this.props;
    const { firstName, lastName } = this.state;

    if (firstName) {
      if (this.state.disableSecondClick) {
        return;
      }
      this.setState({ disableNext: true, isLoading: true });
      const data = {
        me: {
          first_name: firstName,
          last_name: lastName || '',
        },
      };
      dispatch(updateMe(data))
        .then(() => {
          if (this.state.imageUri) {
            this.uploadImage(this.state.imageUri);
          }
          this.setState({
            disableNext: false,
            disableSecondClick: true,
            isLoading: false,
          });
          dispatch(navigatePush('voke.SignUpNumber'));
          // Enable the second click after a second
          setTimeout(() => this.setState({ disableSecondClick: false }), 1000);
        })
        .catch(() => {
          this.setState({ disableNext: false, isLoading: false });
        });
    } else {
      Alert.alert('', t('fillInName'));
    }
    // // This is just for testing
    // this.props.dispatch(navigatePush('voke.SignUpNumber'));
  }

  skip() {
    this.props.dispatch(navigatePush('voke.SignUpNumber'));
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
      <View style={[st.f1]}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView
            style={[st.f1]}
            behavior={theme.isAndroid ? undefined : 'padding'}
          >
            {/* {
              // hideBack just means that we're resetting to this page because the
              // user has to fill in more info before they can continue
              this.props.hideBack ? (
                <SignUpHeaderBack
                  onPress={() => this.props.dispatch(navigateResetLogin())}
                />
              ) : null
            } */}
            <SignUpHeader
              title={t('title.createProfile')}
              onPress={() => Keyboard.dismiss()}
            />
            <Flex
              value={1}
              align="center"
              justify="start"
              self="stretch"
              style={styles.inputs}
            >
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
              />
              <Flex
                direction="column"
                value={1}
                align="center"
                justify="end"
                style={{ paddingTop: 40 }}
              >
                <Button
                  text={t('next')}
                  disabled={this.state.disableNext}
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButton}
                  onPress={this.addProfile}
                />
                <Button
                  text={t('skip')}
                  type="transparent"
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButtonSkip}
                  onPress={this.skip}
                />
              </Flex>
            </Flex>
          </KeyboardAvoidingView>
        </ScrollView>
        {this.state.isLoading ? (
          <ApiLoading showMS={15000} force={true} />
        ) : null}
      </View>
    );
  }
}

SignUpProfile.propTypes = {
  hideBack: PropTypes.bool,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  user: auth.user || {},
});

export default translate('signUp')(connect(mapStateToProps)(SignUpProfile));
