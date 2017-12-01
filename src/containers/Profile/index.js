import React, { Component } from 'react';
import { Platform, Image, TextInput, KeyboardAvoidingView, ScrollView, View, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import { Flex, Icon, Button, Text, Separator } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { updateMe, getMe } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import ApiLoading from '../ApiLoading';
import Header from '../Header';
import VOKE_LOGO from '../../../images/nav_voke_logo.png';
import nav, { NavPropTypes } from '../../actions/nav';
import theme, { COLORS } from '../../theme';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
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
    };

    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.renderEditName = this.renderEditName.bind(this);
    this.renderEditEmail = this.renderEditEmail.bind(this);
    this.renderEditPassword = this.renderEditPassword.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.resetState = this.resetState.bind(this);
    this.backHandler = this.backHandler.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Profile');
    this.props.dispatch(getMe());
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler() {
    if (this.state.editName || this.state.editEmail || this.state.editPassword) {
      this.resetState();
      return true;
    }
    return false;
  }

  handleUpdate() {
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
    this.setState({
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
    });
  }

  handleImageChange(data) {
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

  scrollEnd(isAnimated) {
    // Somehow check if the listview is in the middle
    // if (this.listView) {
    //   setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
    // }
    setTimeout(() => this.scrollView.scrollToEnd({ animated: isAnimated }), 50);
  }

  renderImagePicker() {
    let image;

    if (this.state.imageUri) {
      image = { uri: this.state.imageUri} ;
    } else if (this.props.user.avatar.large) {
      image = { uri: this.props.user.avatar.large };
    } else {
      image= VOKE_LOGO;
    }

    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          <Image source={image} style={styles.image} />
        </Flex>
      </ImagePicker>
    );
  }

  renderEditName() {
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
    const { editName, editEmail, editPassword } = this.state;
    const { user } = this.props;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}
        keyboardVerticalOffset={Platform.OS === 'android' ? undefined : 50}
      >
        <Header
          leftBack={true}
          title="Profile"
          light={true}
          shadow={false}
        />
        <Flex direction="column" style={styles.container}>
          {
            editName || editEmail || editPassword ? null : (
              <Flex value={1} align="center" justify="center" style={styles.imageWrapper}>
                {this.renderImagePicker()}
              </Flex>
            )
          }
          <Flex value={2} style={styles.infoWrapper}>
            <ScrollView
              ref={(c) => this.scrollView = c}
              style={{flex: 2}}
              keyboardShouldPersistTaps="handled"
            >
              {
                editEmail || editPassword ? null : (
                  <View>
                    <Flex direction="row" align="center" justify="center" style={{padding: 2, paddingHorizontal: 20}}>
                      <Flex direction="row" align="center" justify="start" value={1}>
                        <Icon style={styles.inputIcon} name="person" size={20} />
                        <Text style={styles.buttonText}>{`${user.first_name} ${user.last_name}`}</Text>
                      </Flex>
                      <Button
                        isAndroidOpacity={true}
                        text={editName ? 'cancel' : 'edit'}
                        buttonTextStyle={styles.editText}
                        icon={editName ? 'close' : 'edit'}
                        iconStyle={styles.inputIcon}
                        style={styles.inputButton}
                        onPress={() => this.setState({ editName: !editName, editEmail: false, editPassword: false })}
                      />
                    </Flex>
                    <Separator />
                    {
                      editName ? this.renderEditName() : null
                    }
                  </View>
                )
              }
              {
                editName || editPassword ? null : (
                  <View>
                    <Flex direction="row" align="center" justify="center" style={{padding: 2, paddingHorizontal: 20}}>
                      <Flex direction="row" align="center" justify="start" value={1}>
                        <Icon style={styles.inputIcon} name="mail-outline" size={20} />
                        <Text style={styles.buttonText}>{user.email}</Text>
                      </Flex>
                      <Button
                        isAndroidOpacity={true}
                        text={editEmail ? 'cancel' : 'edit'}
                        icon={editEmail ? 'close' : 'edit'}
                        buttonTextStyle={styles.editText}
                        iconStyle={styles.inputIcon}
                        style={styles.inputButton}
                        onPress={() => this.setState({ editEmail: !editEmail, editName: false, editPassword: false })}
                      />
                    </Flex>
                    <Separator />
                    {
                      editEmail ? this.renderEditEmail() : null
                    }
                  </View>
                )
              }
              {
                editName || editEmail ? null : (
                  <View>
                    <Flex direction="row" align="center" justify="center" style={{padding: 2, paddingHorizontal: 20}}>
                      <Flex direction="row" align="center" justify="start" value={1}>
                        <Icon style={styles.inputIcon} name="security" size={20} />
                        <Text style={styles.buttonText}>*********</Text>
                      </Flex>
                      <Button
                        isAndroidOpacity={true}
                        text={editPassword ? 'cancel' : 'edit'}
                        icon={editPassword ? 'close' : 'edit'}
                        buttonTextStyle={styles.editText}
                        iconStyle={styles.inputIcon}
                        style={styles.inputButton}
                        onPress={() => this.setState({ editPassword: !editPassword, editName: false, editEmail: false })}
                      />
                    </Flex>
                    <Separator />
                    {
                      editPassword ? this.renderEditPassword() : null
                    }
                  </View>
                )
              }
            </ScrollView>
          </Flex>
        </Flex>
        <ApiLoading />
      </KeyboardAvoidingView>
    );
  }
}


// Check out actions/nav.js to see the prop types and mapDispatchToProps
Profile.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps, nav)(Profile);
