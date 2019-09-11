import React, { Component } from 'react';
import {
  Image,
  TextInput,
  ScrollView,
  View,
  Alert,
  BackHandler,
  Picker,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import {
  Flex,
  Button,
  Text,
  Separator,
  Touchable,
} from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import {
  updateMe,
  getMe,
  deleteAccount,
  logoutAction,
  confirmAlert,
} from '../../actions/auth';
import Analytics from '../../utils/analytics';

import ApiLoading from '../ApiLoading';
import Header from '../Header';
import SignUpButtons from '../SignUpButtons';
import ProfileProgress from '../ProfileProgress';
import VOKE_LOGO from '../../../images/voke_logo_words.png';
import {
  navigateResetLogin,
  navigateResetHome,
  navigatePush,
} from '../../actions/nav';
import theme, { COLORS } from '../../theme';
import { SET_OVERLAY } from '../../constants';
import i18n from '../../i18n';
import { buildTrackingObj } from '../../utils/common';

const defaultState = {
  imageUri: null,
  editName: false,
  editEmail: false,
  editPassword: false,
  newEmail: '',
  confirmEmail: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  hideAnonFields: false,
};

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...defaultState,
      firstName: props.user ? props.user.first_name || '' : '',
      lastName: props.user ? props.user.last_name || '' : '',
      language:
        props.user && props.user.language && props.user.language.language_code
          ? props.user.language.language_code
          : 'en',
      showPicker: false,
    };
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.Profile);
    this.props.dispatch(getMe());
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  handleLanguageChange = lang => {
    const { dispatch } = this.props;
    let data = {
      me: {
        language: {
          language_code: lang,
        },
      },
    };
    dispatch(updateMe(data)).then(results => {
      dispatch(getMe());
      i18n.changeLanguage(lang.toLowerCase(), (err, key) => {
        LOG('Translation error', err, key);
        setTimeout(() => dispatch(navigateResetHome()), 500);
      });
    });
  };

  getLanguage(lang) {
    if (lang.toLowerCase().includes('en')) {
      return 'English';
    } else if (lang.toLowerCase().includes('pt')) {
      return 'Portuguese';
    } else if (lang.toLowerCase().includes('es')) {
      return 'Spanish';
    } else {
      return 'English';
    }
  }

  backHandler = () => {
    if (
      this.state.editName ||
      this.state.editEmail ||
      this.state.editPassword
    ) {
      this.resetState();
      return true;
    }
    return false;
  };

  handleUpdate = () => {
    const { t, dispatch } = this.props;
    const user = this.props.user || {};
    const {
      firstName,
      lastName,
      currentPassword,
      newEmail,
      confirmEmail,
      newPassword,
      confirmPassword,
    } = this.state;
    let data = {};

    if (
      (firstName || lastName) &&
      (user.first_name !== firstName || user.last_name !== lastName)
    ) {
      data = {
        me: {
          first_name: firstName,
          last_name: lastName,
        },
      };
    } else if (newEmail && confirmEmail && currentPassword) {
      if (newEmail != confirmEmail) {
        Alert.alert(t('emailsMatch'));
        return;
      }
      data = {
        me: {
          email: newEmail,
          current_password: currentPassword,
        },
      };
    } else if (currentPassword && newPassword && confirmPassword) {
      if (newPassword != confirmPassword) {
        Alert.alert(t('passwordsMatch'));
        return;
      }
      if (newPassword.length < 8) {
        Alert.alert(t('passwordsLength'));
        return;
      }
      data = {
        me: {
          current_password: currentPassword,
          password: newPassword,
        },
      };
    }
    dispatch(updateMe(data)).then(() => {
      this.resetState();
    });
  };

  resetState() {
    this.setState(defaultState);
  }

  handleDeleteAccount = () => {
    const { dispatch, t } = this.props;
    dispatch(
      confirmAlert(t('deleteSure'), t('deleteDescription'), this.deleteAccount),
    );
  };

  deleteAccount = async () => {
    const { dispatch } = this.props;
    await dispatch(deleteAccount());
    await dispatch(logoutAction(true));
    dispatch(navigateResetLogin());
  };

  handleImageChange = data => {
    this.setState({
      imageUri: data.uri,
    });
    if (data.uri) {
      const updateData = {
        avatar: {
          fileName: `${this.props.user.first_name}_${this.props.user.last_name}.png`,
          uri: data.uri,
          // base64: data.imageBinary,
        },
      };
      this.props.dispatch(updateMe(updateData)).then(() => {
        this.resetState();
      });
    }
  };

  toggleEdit = type => {
    const newValue = !this.state[type];
    // If we are toggling the edit ON and the user is anonymous, show the popup
    // if (newValue && this.props.isAnonUser) {
    if (newValue && (this.props.isAnonUser && type !== 'editName')) {
      this.setState({ hideAnonFields: true });
      this.props.dispatch({
        type: SET_OVERLAY,
        value: 'tryItNowSignUp',
        props: { onClose: () => this.setState({ hideAnonFields: false }) },
      });
      return;
    }
    const newData = {
      editName: false,
      editEmail: false,
      editPassword: false,
      ...{ [type]: newValue },
    };
    this.setState(newData);
  };

  renderImagePicker() {
    const { t, user } = this.props;
    let image;

    if (this.state.imageUri) {
      image = { uri: this.state.imageUri };
    } else if (user && user.avatar && user.avatar.large) {
      image = { uri: user.avatar.large };
    } else {
      image = VOKE_LOGO;
    }

    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <ProfileRow
          text={t('changePhoto')}
          right={
            <Image resizeMode="cover" source={image} style={styles.image} />
          }
        />
      </ImagePicker>
    );
  }

  renderEditName() {
    if (!this.state.editName) return null;
    const { t, user } = this.props;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>{t('changeName')}</Text>
        </Flex>
        <Flex value={1} direction="row" align="center" justify="center">
          <Flex
            direction="column"
            value={2}
            style={styles.inputRow}
            ref={x => Analytics.markSensitive(x)}
          >
            <TextInput
              ref={c => (this.firstName = c)}
              value={this.state.firstName}
              onChangeText={text => this.setState({ firstName: text })}
              multiline={false}
              autoCapitalize="words"
              placeholder={t('placeholder.firstName')}
              placeholderTextColor={COLORS.GREY}
              returnKeyType="next"
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
            <TextInput
              ref={c => (this.lastName = c)}
              onChangeText={text => this.setState({ lastName: text })}
              value={this.state.lastName || user.last_name || ''}
              multiline={false}
              autoCapitalize="words"
              placeholder={t('placeholder.lastName')}
              returnKeyType="done"
              placeholderTextColor={COLORS.GREY}
              style={styles.inputBox}
              autoCorrect={true}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
            />
          </Flex>
          <Flex value={1} align="center">
            <Button
              text={t('save').toUpperCase()}
              style={styles.saveButton}
              buttonTextStyle={styles.saveButtonText}
              disabled={!this.state.firstName && !this.state.lastName}
              onPress={this.handleUpdate}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  renderEditEmail() {
    const { t } = this.props;
    if (!this.state.editEmail) return null;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>{t('changeEmail')}</Text>
        </Flex>
        <Flex direction="row" align="center" justify="center">
          <Flex
            direction="column"
            value={3}
            style={styles.inputRow}
            ref={x => Analytics.markSensitive(x)}
          >
            <TextInput
              ref={c => (this.newEmail = c)}
              onChangeText={text => this.setState({ newEmail: text })}
              value={this.state.newEmail}
              multiline={false}
              placeholder={t('placeholder.newEmail')}
              keyboardType="email-address"
              returnKeyType="next"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.confirmEmail.focus()}
            />
            <TextInput
              ref={c => (this.confirmEmail = c)}
              value={this.state.confirmEmail}
              onChangeText={text => this.setState({ confirmEmail: text })}
              multiline={false}
              returnKeyType="next"
              placeholder={t('placeholder.confirmEmail')}
              keyboardType="email-address"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.currentPassword.focus()}
            />
            <TextInput
              ref={c => (this.currentPassword = c)}
              value={this.state.currentPassword}
              secureTextEntry={true}
              onChangeText={text => this.setState({ currentPassword: text })}
              returnKeyType="done"
              multiline={false}
              placeholder={t('placeholder.password')}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
            />
          </Flex>
          <Flex value={1} align="center">
            <Button
              text={t('save').toUpperCase()}
              disabled={
                !this.state.currentPassword &&
                !this.state.newEmail &&
                !this.state.confirmEmail
              }
              style={styles.saveButton}
              buttonTextStyle={styles.saveButtonText}
              onPress={this.handleUpdate}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  renderEditPassword() {
    const { t } = this.props;
    if (!this.state.editPassword) return null;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>{t('changePassword')}</Text>
        </Flex>
        <Flex direction="row" align="center" justify="center">
          <Flex
            direction="column"
            value={3}
            style={styles.inputRow}
            ref={x => Analytics.markSensitive(x)}
          >
            <TextInput
              ref={c => (this.passwordCurrent = c)}
              multiline={false}
              placeholder={t('placeholder.currentPassword')}
              onChangeText={text => this.setState({ currentPassword: text })}
              secureTextEntry={true}
              returnKeyType="next"
              value={this.state.currentPassword}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.passwordNew.focus()}
            />
            <TextInput
              ref={c => (this.passwordNew = c)}
              multiline={false}
              secureTextEntry={true}
              placeholder={t('placeholder.newPassword')}
              onChangeText={text => this.setState({ newPassword: text })}
              returnKeyType="next"
              value={this.state.newPassword}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.passwordNewConfirm.focus()}
            />
            <TextInput
              ref={c => (this.passwordNewConfirm = c)}
              multiline={false}
              placeholder={t('placeholder.confirmNewPassword')}
              returnKeyType="done"
              secureTextEntry={true}
              value={this.state.confirmPassword}
              onChangeText={text => this.setState({ confirmPassword: text })}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
            />
          </Flex>
          <Flex value={1} align="center">
            <Button
              text={t('save').toUpperCase()}
              style={styles.saveButton}
              buttonTextStyle={styles.saveButtonText}
              disabled={
                !this.state.currentPassword &&
                !this.state.newPassword &&
                !this.state.confirmPassword
              }
              onPress={this.handleUpdate}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { dispatch } = this.props;
    const { editName, editEmail, editPassword, hideAnonFields } = this.state;
    let { t, user, isAnonUser } = this.props;
    let name = null;
    if (user.first_name || user.last_name) {
      name = `${user.first_name || ''} ${user.last_name || ''}`;
    }

    const isEditing = editName || editEmail || editPassword;

    return (
      <View style={styles.container}>
        <Header
          leftBack={true}
          title={t('title.profile')}
          light={true}
          shadow={false}
        />
        <Flex direction="column" style={styles.content}>
          <ScrollView
            ref={c => (this.scrollView = c)}
            style={{ flex: 2 }}
            keyboardShouldPersistTaps="handled"
          >
            <ProfileProgress
              onHandleSignUpAccount={() =>
                dispatch(
                  navigatePush('voke.SignUpAccount', {
                    trackingObj: buildTrackingObj('profile', 'signup'),
                  }),
                )
              }
              onHandleVerifyNumber={() =>
                dispatch(navigatePush('voke.SignUpNumber'))
              }
            />
            <Separator />
            {isEditing ? null : this.renderImagePicker()}
            {isEditing && !editName ? null : (
              <View>
                <ProfileRow
                  text={name || t('addName')}
                  right={
                    <Button
                      isAndroidOpacity={true}
                      text={
                        editName ? t('cancel') : !name ? t('add') : t('edit')
                      }
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editName')}
                    />
                  }
                />
                {this.renderEditName()}
              </View>
            )}
            {isAnonUser || (isEditing && !editEmail) ? null : (
              <View>
                <ProfileRow
                  text={user.email || t('addEmail')}
                  right={
                    <Button
                      isAndroidOpacity={true}
                      text={
                        editEmail
                          ? t('cancel')
                          : !user.email
                          ? t('add')
                          : t('edit')
                      }
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editEmail')}
                    />
                  }
                />
                {this.renderEditEmail()}
              </View>
            )}
            {isAnonUser || (isEditing && !editPassword) ? null : (
              <View>
                <ProfileRow
                  text={user.email ? '********' : t('addPassword')}
                  right={
                    <Button
                      isAndroidOpacity={true}
                      text={
                        editPassword
                          ? t('cancel')
                          : !user.email
                          ? t('add')
                          : t('edit')
                      }
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editPassword')}
                    />
                  }
                />
                {this.renderEditPassword()}
              </View>
            )}
            {isAnonUser || isEditing ? null : (
              <ProfileRow
                text={user.mobile ? t('mobileVerified') : t('verifyMobile')}
                right={
                  <Button
                    isAndroidOpacity={true}
                    text={user.mobile ? '' : t('add')}
                    buttonTextStyle={styles.editText}
                    style={styles.inputButton}
                    onPress={() =>
                      user.mobile
                        ? undefined
                        : dispatch(navigatePush('voke.SignUpNumber'))
                    }
                  />
                }
              />
            )}
            {isEditing ? null : !theme.isAndroid ? (
              <Touchable
                onPress={() =>
                  this.setState({ showPicker: !this.state.showPicker })
                }
              >
                <Flex>
                  <Separator style={styles.settingsSeparator} />
                  <Flex style={styles.row} direction="row" align="center">
                    <Text style={styles.link}>{t('language')}</Text>
                    <Flex value={1} align="end" justify="end">
                      <Text style={styles.link}>
                        ({this.getLanguage(this.state.language)})
                      </Text>
                    </Flex>
                  </Flex>
                  {this.state.showPicker ? (
                    <Flex style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                      <Flex
                        style={styles.row}
                        direction="row"
                        align="center"
                        justify="end"
                      >
                        <Button
                          text={t('setLanguage')}
                          buttonTextStyle={styles.actionButtonText}
                          style={styles.actionButton}
                          onPress={() => {
                            this.handleLanguageChange(this.state.language);
                            this.setState({ showPicker: false });
                          }}
                        />
                      </Flex>
                      <Picker
                        selectedValue={this.state.language}
                        style={{ height: 50, width: 100 }}
                        onValueChange={(itemValue, itemIndex) =>
                          this.setState({ language: itemValue })
                        }
                        style={{ width: '100%' }}
                        itemStyle={{ color: 'black' }}
                      >
                        <Picker.Item label="English" value="EN" />
                        <Picker.Item label="Portuguese" value="PT" />
                        <Picker.Item label="Spanish" value="ES" />
                      </Picker>
                    </Flex>
                  ) : null}
                </Flex>
              </Touchable>
            ) : (
              <Picker
                selectedValue={this.state.language}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ language: itemValue }, () => {
                    this.handleLanguageChange(this.state.language);
                  });
                }}
                style={{ width: '100%' }}
                itemStyle={{ color: 'black' }}
              >
                <Picker.Item label="English" value="EN" />
                <Picker.Item label="Portuguese" value="PT" />
                <Picker.Item label="Spanish" value="ES" />
              </Picker>
            )}
            <Separator />

            <ProfileRow
              text={t('deleteAccount')}
              right={
                <Button
                  isAndroidOpacity={true}
                  text={t('delete')}
                  buttonTextStyle={styles.editText}
                  style={styles.inputButton}
                  onPress={this.handleDeleteAccount}
                />
              }
            />
            {isAnonUser && !hideAnonFields ? (
              <Flex
                value={1}
                align="center"
                style={{ paddingHorizontal: 50, marginTop: 100 }}
              >
                <Text style={styles.signUpText}>{t('signUp')}</Text>
                <SignUpButtons
                  isSignIn={true}
                  filled={true}
                  trackingPage="profile"
                />
              </Flex>
            ) : null}
          </ScrollView>
        </Flex>
        <ApiLoading />
      </View>
    );
  }
}

function ProfileRow({ text, left, right }) {
  return (
    <Flex direction="column">
      <Flex direction="row" align="center">
        <Flex value={3}>
          {left ? left : <Text style={styles.changeTitle}>{text}</Text>}
        </Flex>
        <Flex value={2} align="end">
          {right}
        </Flex>
      </Flex>
      <Separator />
    </Flex>
  );
}

// Check out actions/nav.js to see the prop types and mapDispatchToProps
Profile.propTypes = {};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
  isAnonUser: auth.isAnonUser,
});

export default translate('profile')(connect(mapStateToProps)(Profile));
