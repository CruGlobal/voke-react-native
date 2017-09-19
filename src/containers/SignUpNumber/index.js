import React, { Component } from 'react';
import { Alert, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { createMobileVerification } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';

import { Flex, Text, Button, Icon } from '../../components/common';

import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';

class SignUpNumber extends Component {
  static navigatorStyle = {
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
    this.handleNext = this.handleNext.bind(this);
    this.handleOpenCountry = this.handleOpenCountry.bind(this);
    this.handleSelectCountry = this.handleSelectCountry.bind(this);
  }

  componentDidMount() {
    Analytics.screen('SignUp Enter Number');
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
            this.props.dispatch(createMobileVerification(data)).then(() => {
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
        <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
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
            <SignUpInput
              value={phoneNumber}
              onChangeText={(text) => this.setState({ phoneNumber: text })}
              keyboardType="phone-pad"
              placeholder="Your Mobile Number"
              onSubmitEditing={this.handleNext}
              returnKeyType="send"
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
