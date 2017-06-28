import React, { Component } from 'react';
import { Image, TextInput, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import { Flex, Icon, Button, Text, Separator } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { iconsMap } from '../../utils/iconMap';

import VOKE_LOGO from '../../../images/vokeLogo.png';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme, { COLORS } from '../../theme'

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
    }],
  };
}

const user = {
  fullName: 'Ben Gauthier',
  email: 'ben@ben.com',
};

class Profile extends Component {

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      editName: false,
      editEmail: false,
      editPassword: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.renderEditName = this.renderEditName.bind(this);
    this.renderEditEmail = this.renderEditEmail.bind(this);
    this.renderEditPassword = this.renderEditPassword.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
  }

  scrollEnd(isAnimated) {
    // Somehow check if the listview is in the middle
    // if (this.listView) {
    //   setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
    // }
    setTimeout(() => this.scrollView.scrollToEnd({ animated: isAnimated }), 50);
  }

  renderImagePicker() {
    const image = this.state.imageUri ? { uri: this.state.imageUri } : VOKE_LOGO;
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          <Image source={image}>
          </Image>
          <Flex align="center" justify="center" style={styles.imageCover}>
            <Icon name="camera-alt" style={styles.imageIcon} size={30} />
          </Flex>
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
        <Flex  direction="row" align="center" justify="center">
          <Flex direction="column" value={3} style={styles.inputRow}>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={COLORS.GREY}
              style={styles.inputBox}
              autoCorrect={true}
            />
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              multiline={false}
              placeholder="Last Name"
              placeholderTextColor={COLORS.GREY}
              style={styles.inputBox}
              autoCorrect={true}
            />
          </Flex>
          <Flex value={1} align="center">
            <Text style={{color: 'black'}}>SAVE</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  renderEditEmail() {
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={{color: 'black'}}>Change Email</Text>
        </Flex>
        <Flex  direction="row" align="center" justify="center">
          <Flex direction="column" value={3} style={styles.inputRow}>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
            />
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              multiline={false}
              placeholder="Last Name"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
            />
          </Flex>
          <Flex value={1} align="center">
            <Text style={{color: 'black'}}>SAVE</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  renderEditPassword() {
    return (
      <Flex direction="column" align="center" justify="center">
        <Flex>
          <Text style={{color: 'black'}}>Change Password</Text>
        </Flex>
        <Flex  direction="row" align="center" justify="center">
          <Flex direction="column" value={3} style={styles.inputRow}>
            <TextInput
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
            />
            <TextInput
              multiline={false}
              placeholder="First Name"
              placeholderTextColor={theme.primaryColor}
              style={styles.inputBox}
              autoCorrect={true}
            />
          </Flex>
          <Flex value={1} align="center">
            <Text style={{color: 'black'}}>SAVE</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }

  render() {
    const { editName, editEmail, editPassword } = this.state;

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
                        <Text style={styles.buttonText}>{user.fullName}</Text>
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
      </KeyboardAvoidingView>
    );
  }
}


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Profile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Profile);
