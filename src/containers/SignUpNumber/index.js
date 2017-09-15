import React, { Component } from 'react';
import { TextInput, Alert, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { connect } from 'react-redux';

import { createMobileVerification } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme';
import { vokeIcons } from '../../utils/iconMap';

import { Flex, Text, Button, Icon, VokeIcon } from '../../components/common';
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

class SignUpNumber extends Component {
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
    this.state = {
      isCountryOpen: false,
      phoneNumber: '',
      selectedCountryCode: '1',
      selectedCountry: 'United States',
    };
    // this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleNext = this.handleNext.bind(this);
    this.handleOpenCountry = this.handleOpenCountry.bind(this);
    this.handleSelectCountry = this.handleSelectCountry.bind(this);
  }

  // onNavigatorEvent(event) {
  //   if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
  //     if (event.id == 'back') {
  //       this.props.navigateBack();
  //     }
  //   }
  // }

  componentDidMount() {
    Analytics.screen('SignUp Enter Number');
  }

  componentWillMount() {
    // this.props.navigator.setButtons(setButtons());
  }

  handleNext() {
    if (!this.state.phoneNumber) {
      Alert.alert('Please enter your phone number','');
    } else {
      let data = {
        mobile: {
          mobile: this.state.selectedCountryCode.concat(this.state.phoneNumber),
        },
      };
      Alert.alert(
        `Is this your correct number? ${this.state.phoneNumber}`,
        'A text message with your access code will be sent to this number.',
        [
          { text: 'Edit' },
          { text: 'Yes', onPress: () => {
            this.props.dispatch(createMobileVerification(data)).then(()=>{
              this.props.navigatePush('voke.SignUpNumberVerify', {
                mobile: this.state.selectedCountryCode.concat(this.state.phoneNumber),
              });
            });
          }},
        ]
      );
    }
  }

  handleOpenCountry() {
    this.props.navigatePush('voke.CountrySelect', {
      onSelect: this.handleSelectCountry,
    });
  }

  handleSelectCountry(country) {
    if (country && country.name && country.code) {
      this.setState({
        selectedCountry: country.name,
        selectedCountryCode: country.code,
      });
    }
  }

  render() {
    const { selectedCountry, selectedCountryCode, phoneNumber } = this.state;
    return (
      <Flex style={styles.container} value={1} align="center" justify="start">
        <StatusBar />
        <Flex
          style={{
            paddingTop: Platform.OS === 'android' ? 10 : 35,
            paddingLeft: Platform.OS === 'android' ? 15 : 30,
            alignSelf: 'flex-start',
          }}
        >
          <Button
            onPress={() => this.props.navigateBack()}
            type="transparent"
            style={{ padding: 5 }}
          >
            {
              Platform.OS === 'android' ? (
                <Icon name="arrow-back" size={30} />
              ) : (
                <VokeIcon name="back" />
              )
            }
          </Button>
        </Flex>
        <TouchableOpacity activeOpacity={1} onPress={()=> Keyboard.dismiss()}>
          <SignUpHeader
            title="Mobile Number"
            description="Add your mobile number to invite your friends to a Voke chat via text message"
          />
          <Flex value={1} align="center" justify="center" style={styles.inputs}>
            <Button
              style={styles.dropDown}
              onPress={this.handleOpenCountry}
            >
              <Flex direction="row" align="center">
                <Text style={styles.countrySelect}>
                  {selectedCountry} (+{selectedCountryCode})
                </Text>
                <Icon name="keyboard-arrow-down" size={30} />
              </Flex>
            </Button>
            <TextInput
              onFocus={() => {}}
              onBlur={() => {}}
              value={phoneNumber}
              onChangeText={(text) => this.setState({ phoneNumber: text })}
              multiline={false}
              keyboardType="phone-pad"
              placeholder="Your Mobile Number"
              placeholderTextColor={theme.accentColor}
              style={styles.inputBox}
              autoCorrect={false}
              onSubmitEditing={this.handleNext}
              returnKeyType= "send"
            />
            <Text style={styles.sharingText}>We love sharing, but we won't share your number.</Text>
            <Flex value={1} align="center" justify="end">
              <Button
                text="Next"
                buttonTextStyle={styles.signInButton}
                style={styles.actionButton}
                onPress={this.handleNext}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

SignUpNumber.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(SignUpNumber);
