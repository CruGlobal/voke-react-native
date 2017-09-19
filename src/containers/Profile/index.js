import React, { Component } from 'react';
import { Image, TextInput, KeyboardAvoidingView, ScrollView, View, Alert, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import { Flex, Icon, Button, Text, Separator } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { updateMe } from '../../actions/auth';
import { vokeIcons } from '../../utils/iconMap';
import Analytics from '../../utils/analytics';

import ApiLoading from '../ApiLoading';
import VOKE_LOGO from '../../../images/nav_voke_logo.png';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
  };
}

class Profile extends Component {

  static navigatorStyle = {
    navBarNoBorder: true,
    topBarElevationShadowEnabled: false,
    tabBarHidden: true,
    navBarButtonColor: theme.lightText,
    navBarBackgroundColor: theme.primaryColor,
    navBarTextColor: theme.headerTextColor,
  };

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

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
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

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
    // LOG(JSON.stringify(this.props.user));
  }

  componentDidMount() {
    Analytics.screen('Profile');
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler() {
    if (this.state.editName || this.state.editEmail || this.state.editPassword) {
      this.setState({
        editName: false,
        editEmail: false,
        editPassword: false,
      });
    }
    return true;
  }
  

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  handleUpdate() {
    LOG('updating');
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
    // LOG(JSON.stringify(data));
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
    LOG('image selected');
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
              value={this.state.firstName}
              onChangeText={(text) => this.setState({ firstName: text })}
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={COLORS.GREY}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
            />
            <TextInput
              onChangeText={(text) => this.setState({ lastName: text })}
              value={this.state.lastName}
              multiline={false}
              placeholder="Last Name"
              placeholderTextColor={COLORS.GREY}
              style={styles.inputBox}
              autoCorrect={true}
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
              onChangeText={(text) => this.setState({ newEmail: text })}
              value={this.state.newEmail}
              multiline={false}
              placeholder="New Email"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
            />
            <TextInput
              value={this.state.confirmEmail}
              onChangeText={(text) => this.setState({ confirmEmail: text })}
              multiline={false}
              placeholder="Confirm Email"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
            />
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={this.state.currentPassword}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({ currentPassword: text })}
              multiline={false}
              placeholder="Password"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
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
              multiline={false}
              placeholder="Current Password"
              onChangeText={(text) => this.setState({ currentPassword: text })}
              secureTextEntry={true}
              value={this.state.currentPassword}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
            />
            <TextInput
              multiline={false}
              secureTextEntry={true}
              placeholder="New Password"
              onChangeText={(text) => this.setState({ newPassword: text })}
              value={this.state.newPassword}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
            />
            <TextInput
              multiline={false}
              placeholder="Confirm New Password"
              secureTextEntry={true}
              value={this.state.confirmPassword}
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
              underlineColorAndroid="transparent"
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
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={50}>
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


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Profile.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth }) => ({
  user: auth.user,
});

export default connect(mapStateToProps, nav)(Profile);
