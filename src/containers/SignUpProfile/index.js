import React, { Component } from 'react';
import { Image, TextInput, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { updateMe } from '../../actions/auth';
import { vokeIcons } from '../../utils/iconMap';
import ImagePicker from '../../components/ImagePicker';
import theme from '../../theme';
import Analytics from '../../utils/analytics';

import { Flex, Icon, VokeIcon, Button } from '../../components/common';
import StatusBar from '../../components/StatusBar';
import SignUpHeader from '../../components/SignUpHeader';

// function setButtons() {
//   return {
//     leftButtons: [{
//       id: 'back', // Android implements this already
//       icon: vokeIcons['back'], // For iOS only
//     }],
//   };
// }

class SignUpProfile extends Component {
  static navigatorStyle = {
    // screenBackgroundColor: theme.primaryColor,
    // navBarButtonColor: theme.lightText,
    // navBarTextColor: theme.headerTextColor,
    // navBarBackgroundColor: theme.primaryColor,
    // navBarNoBorder: true,
    // topBarElevationShadowEnabled: false,
    navBarHidden: true,
  };


  constructor(props) {
    super(props);
    this.state= {
      imageUri: null,
      firstName: '',
      lastName: '',
    };

    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }

  // onNavigatorEvent(event) {
  //   if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
  //     if (event.id == 'back') {
  //       this.props.navigateBack();
  //     }
  //   }
  // }

  componentWillMount() {
    // this.props.navigator.setButtons(setButtons());
  }

  componentDidMount() {
    Analytics.screen('SignUp Profile');
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
    LOG('image selected');
  }

  addProfile() {
    const { imageUri, firstName, lastName } = this.state;
    if (firstName && lastName) {
      let data = {
        me: {
          first_name: firstName,
          last_name: lastName,
        },
        avatar: imageUri,
      };
      this.props.dispatch(updateMe(data)).then(()=>{
        this.props.navigatePush('voke.SignUpNumber');
      });
    } else {
      Alert.alert('Please fill in your first and last name', '');
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
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex style={{paddingTop: 35, paddingLeft: 30, alignSelf: 'flex-start'}}>
          <Button
            onPress={()=> this.props.navigateBack()}
            type="transparent"
            style={{padding: 5}}
          >
            <VokeIcon name="back" />
          </Button>
        </Flex>
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
          <SignUpHeader title="Create Profile" />
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
            <Flex value={1} align="center" justify="end">
              <Button
                text="Next"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.addProfile}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

SignUpProfile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpProfile);
