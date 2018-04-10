import React, { Component } from 'react';
import { Alert, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { createMobileVerification } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';

import { Flex, Text, Button, Icon } from '../../components/common';

import ApiLoading from '../ApiLoading';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import theme from '../../theme';

class SignUpNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCountryOpen: false,
      phoneNumber: '',
      selectedCountryCode: '1',
      selectedCountry: 'United States',
      disableNext: false,
      isLoading: false,
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
            this.setState({ disableNext: true, isLoading: true });
            this.props.dispatch(createMobileVerification(data)).then(() => {
              this.setState({ disableNext: false, isLoading: false });
              this.props.navigatePush('voke.SignUpNumberVerify', {
                mobile: this.state.selectedCountryCode.concat(this.state.phoneNumber),
              });
            }).catch((err)=> {
              this.setState({ disableNext: false, isLoading: false });
              Alert.alert('Mobile number is invalid', err.errors[0]);
            });
          }},
        ]
      );
    }

    // // This is just for testing
    // this.props.navigatePush('voke.SignUpNumberVerify', {
    //   mobile: this.state.selectedCountryCode.concat(this.state.phoneNumber),
    // });
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
      <ScrollView style={styles.container} value={1} keyboardShouldPersistTaps="always" align="center" justify="start">
        <KeyboardAvoidingView behavior={theme.isAndroid ? undefined : 'padding'}>
          <SignUpHeaderBack
            onPress={() => {
              if (this.props.hideBack) {
                this.props.navigateResetLogin();
              } else {
                this.props.navigateBack();
              }
            }}
          />
          <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
            <SignUpHeader
              title="Mobile Number"
              description="Add your mobile number to invite your friends to a Voke chat via text message"
              onPress={()=> Keyboard.dismiss()}
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
              <Flex value={1} align="center" justify="start">
                <Button
                  text="Next"
                  disabled={this.state.disableNext}
                  buttonTextStyle={styles.signInButton}
                  style={styles.actionButton}
                  onPress={this.handleNext}
                />
              </Flex>
            </Flex>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {
          this.state.isLoading ? <ApiLoading force={true} /> : null
        }
      </ScrollView>
    );
  }
}

SignUpNumber.propTypes = {
  ...NavPropTypes,
  hideBack: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(SignUpNumber);
