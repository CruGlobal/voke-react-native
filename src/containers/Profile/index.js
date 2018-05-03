import React, { Component } from 'react';
import { Image, TextInput, ScrollView, View, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { Flex, Icon, Button, Text, Separator } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { updateMe, getMe } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import ApiLoading from '../ApiLoading';
import Header from '../Header';
import VokeOverlays from '../VokeOverlays';
import SignUpButtons from '../SignUpButtons';
import ProfileProgress from '../ProfileProgress';
import VOKE_LOGO from '../../../images/nav_voke_logo.png';
import nav, { NavPropTypes } from '../../actions/nav';
import theme, { COLORS } from '../../theme';
import { SET_OVERLAY } from '../../constants';

const defaultState = {
  imageUri: null,
  editName: false,
  editEmail: false,
  editPassword: false,
  firstName: '',
  lastName: '',
  newEmail: '',
  confirmEmail: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  hideAnonFields: false,
};

class Profile extends Component {

  state = defaultState;

  componentDidMount() {
    Analytics.screen('Profile');
    this.props.dispatch(getMe());
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler = () => {
    if (this.state.editName || this.state.editEmail || this.state.editPassword) {
      this.resetState();
      return true;
    }
    return false;
  }

  handleUpdate = () => {
    const { firstName, lastName, currentPassword, newEmail, confirmEmail, newPassword, confirmPassword } = this.state;
    let data = {};

    if (firstName && lastName) {
      data = {
        me: {
          first_name: firstName,
          last_name: lastName,
        },
      };
    } else if (newEmail && confirmEmail && currentPassword) {
      if (newEmail != confirmEmail) {
        Alert.alert('The emails do not match','');
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
        Alert.alert('The passwords do not match','');
        return;
      }
      if (newPassword.length < 8) {
        Alert.alert('Passwords must be at least 8 characters','');
        return;
      }
      data = {
        me: {
          current_password: currentPassword,
          password: newPassword,
        },
      };
    }
    this.props.dispatch(updateMe(data)).then(() => {
      this.resetState();
    });
  }

  resetState() {
    this.setState(defaultState);
  }

  handleImageChange = (data) => {
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
  }

  toggleEdit = (type) => {
    const newValue = !this.state[type];
    // If we are toggling the edit ON and the user is anonymous, show the popup
    // if (newValue && this.props.isAnonUser) {
    if (newValue && (this.props.isAnonUser && type !== 'editName')) {
      this.setState({ hideAnonFields: true });
      this.props.dispatch({ type: SET_OVERLAY, value: 'tryItNowSignUp' });
      return;
    }
    const newData = {
      editName: false,
      editEmail: false,
      editPassword: false,
      ...({ [type]: newValue }),
    };
    this.setState(newData);

  }

  renderImagePicker() {
    let image;

    if (this.state.imageUri) {
      image = { uri: this.state.imageUri} ;
    } else if (this.props.user && this.props.user.avatar && this.props.user.avatar.large) {
      image = { uri: this.props.user.avatar.large };
    } else {
      image= VOKE_LOGO;
    }

    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <ProfileRow
          text="Change Photo"
          right={<Image resizeMode="cover" source={image} style={styles.image} />}
        />
      </ImagePicker>
    );
  }

  renderEditName() {
    if (!this.state.editName) return null;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>Change Name</Text>
        </Flex>
        <Flex  value={1} direction="row" align="center" justify="center">
          <Flex direction="column" value={2} style={styles.inputRow}>
            <TextInput
              ref={(c) => this.firstName = c}
              value={this.state.firstName}
              onChangeText={(text) => this.setState({ firstName: text })}
              multiline={false}
              autoCapitalize="words"
              placeholder="First Name"
              placeholderTextColor={COLORS.GREY}
              returnKeyType="next"
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.lastName.focus()}
            />
            <TextInput
              ref={(c) => this.lastName = c}
              onChangeText={(text) => this.setState({ lastName: text })}
              value={this.state.lastName}
              multiline={false}
              autoCapitalize="words"
              placeholder="Last Name"
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
              text="SAVE"
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
    if (!this.state.editEmail) return null;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>Change Email</Text>
        </Flex>
        <Flex  direction="row" align="center" justify="center">
          <Flex direction="column" value={3} style={styles.inputRow}>
            <TextInput
              ref={(c) => this.newEmail = c}
              onChangeText={(text) => this.setState({ newEmail: text })}
              value={this.state.newEmail}
              multiline={false}
              placeholder="New Email"
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
              ref={(c) => this.confirmEmail = c}
              value={this.state.confirmEmail}
              onChangeText={(text) => this.setState({ confirmEmail: text })}
              multiline={false}
              returnKeyType="next"
              placeholder="Confirm Email"
              keyboardType="email-address"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={false}
              onSubmitEditing={() => this.currentPassword.focus()}
            />
            <TextInput
              ref={(c) => this.currentPassword = c}
              value={this.state.currentPassword}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ currentPassword: text })}
              returnKeyType="done"
              multiline={false}
              placeholder="Password"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              blurOnSubmit={true}
              underlineColorAndroid="transparent"
            />
          </Flex>
          <Flex value={1} align="center">
            <Button
              text="SAVE"
              disabled={!this.state.currentPassword && !this.state.newEmail && !this.state.confirmEmail}
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
    if (!this.state.editPassword) return null;
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={styles.changeTitle}>Change Password</Text>
        </Flex>
        <Flex  direction="row" align="center" justify="center">
          <Flex direction="column" value={3} style={styles.inputRow}>
            <TextInput
              ref={(c) => this.passwordCurrent = c}
              multiline={false}
              placeholder="Current Password"
              onChangeText={(text) => this.setState({ currentPassword: text })}
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
              ref={(c) => this.passwordNew = c}
              multiline={false}
              secureTextEntry={true}
              placeholder="New Password"
              onChangeText={(text) => this.setState({ newPassword: text })}
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
              ref={(c) => this.passwordNewConfirm = c}
              multiline={false}
              placeholder="Confirm New Password"
              returnKeyType="done"
              secureTextEntry={true}
              value={this.state.confirmPassword}
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
              blurOnSubmit={true}
            />
          </Flex>
          <Flex value={1} align="center">
            <Button
              text="SAVE"
              style={styles.saveButton}
              buttonTextStyle={styles.saveButtonText}
              disabled={!this.state.currentPassword && !this.state.newPassword && !this.state.confirmPassword}
              onPress={this.handleUpdate}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { editName, editEmail, editPassword, hideAnonFields } = this.state;
    let { user, isAnonUser } = this.props;

    const name = `${user.first_name} ${user.last_name}`;

    const isEditing = editName || editEmail || editPassword;

    return (
      <View style={styles.container}>
        <Header
          leftBack={true}
          title="Profile"
          light={true}
          shadow={false}
        />
        <Flex direction="column" style={styles.content}>
          <ScrollView
            ref={(c) => this.scrollView = c}
            style={{flex: 2}}
            keyboardShouldPersistTaps="handled"
          >
            <ProfileProgress />
            <Separator />
            {
              isAnonUser || isEditing ? null : this.renderImagePicker()
            }
            {
              isEditing && !editName ? null : (
                <View>
                  <ProfileRow
                    text={name}
                    right={<Button
                      isAndroidOpacity={true}
                      text={editName ? 'Cancel' : (!name ? 'Add' : 'Edit')}
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editName')}
                    />}
                  />
                  {this.renderEditName()}
                </View>
              )
            }
            {
              isAnonUser || (isEditing && !editEmail) ? null : (
                <View>
                  <ProfileRow
                    text={user.email || 'Add Email'}
                    right={<Button
                      isAndroidOpacity={true}
                      text={editEmail ? 'Cancel' : (!user.email ? 'Add' : 'Edit')}
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editEmail')}
                    />}
                  />
                  {this.renderEditEmail()}
                </View>
              )
            }
            {
              isAnonUser || (isEditing && !editPassword) ? null : (
                <View>
                  <ProfileRow
                    text={user.email ? '********' : 'Add Password'}
                    right={<Button
                      isAndroidOpacity={true}
                      text={editPassword ? 'Cancel' : (!user.email ? 'Add' : 'Edit')}
                      buttonTextStyle={styles.editText}
                      style={styles.inputButton}
                      onPress={() => this.toggleEdit('editPassword')}
                    />}
                  />
                  {this.renderEditPassword()}
                </View>
              )
            }
            {
              isAnonUser || isEditing ? null : (
                <ProfileRow
                  text={user.mobile ? 'Mobile Verified' : 'Verify Mobile Number'}
                  right={<Button
                    isAndroidOpacity={true}
                    text={user.mobile ? '' : 'Add'}
                    buttonTextStyle={styles.editText}
                    style={styles.inputButton}
                    onPress={() => user.mobile ? undefined : this.props.navigatePush('voke.SignUpNumber')}
                  />}
                />
              )
            }
            {
              isAnonUser && !hideAnonFields ? (
                <Flex value={1} align="center" style={{ paddingHorizontal: 50, marginTop: 100 }}>
                  <Text style={styles.signUpText}>
                    Sign up to save your progress and access your account from anywhere.
                  </Text>
                  <SignUpButtons filled={true} />
                </Flex>
              ) : null
            }
          </ScrollView>
        </Flex>
        <ApiLoading />
        <VokeOverlays type="tryItNowSignUp" onClose={() => this.setState({ hideAnonFields: false })} />
      </View>
    );
  }
}


function ProfileRow({ text, left, right }) {
  return (
    <Flex direction="column">
      <Flex direction="row" align="center">
        <Flex value={3}>
          {left ? left : (
            <Text style={styles.changeTitle}>{text}</Text>
          )}
        </Flex>
        <Flex value={1} align="center">{right}</Flex>
      </Flex>
      <Separator />
    </Flex>
  );
}


// Check out actions/nav.js to see the prop types and mapDispatchToProps
Profile.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
  isAnonUser: auth.isAnonUser,
});

export default connect(mapStateToProps, nav)(Profile);
