import React, { Component } from 'react';
import {
  Alert,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import PropTypes from 'prop-types';
import { createMobileVerification } from '../../actions/auth';
import Analytics from '../../utils/analytics';

import styles from './styles';
import nav, { NavPropTypes } from '../../actions/nav';

import { Flex, Text, Button, Icon } from '../../components/common';

import ApiLoading from '../ApiLoading';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeader from '../../components/SignUpHeader';
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
    const { t, navigatePush, dispatch } = this.props;
    if (!this.state.phoneNumber) {
      Alert.alert(t('enterNumber'));
    } else {
      let data = {
        mobile: {
          mobile: this.state.selectedCountryCode.concat(this.state.phoneNumber),
        },
      };
      Alert.alert(
        t('isNumber', { number: this.state.phoneNumber }),
        t('messageSent'),
        [
          { text: 'Edit' },
          {
            text: 'Yes',
            onPress: () => {
              this.setState({ disableNext: true, isLoading: true });
              dispatch(createMobileVerification(data))
                .then(() => {
                  this.setState({ disableNext: false, isLoading: false });
                  navigatePush('voke.SignUpNumberVerify', {
                    mobile: this.state.selectedCountryCode.concat(
                      this.state.phoneNumber,
                    ),
                  });
                })
                .catch(err => {
                  this.setState({ disableNext: false, isLoading: false });
                  Alert.alert(t('mobileInvalid'), err.errors[0]);
                });
            },
          },
        ],
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

  skip = () => {
    this.props.navigateBack(3);
  };

  render() {
    const { t } = this.props;
    const { selectedCountry, selectedCountryCode, phoneNumber } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={theme.isAndroid ? undefined : 'padding'}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => Keyboard.dismiss()}
            >
              <SignUpHeader
                title={t('title.number')}
                description={t('numberDescription')}
                onPress={() => Keyboard.dismiss()}
              />
              <Flex
                value={1}
                align="center"
                justify="center"
                style={styles.inputs}
              >
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
                  onChangeText={text => this.setState({ phoneNumber: text })}
                  keyboardType="phone-pad"
                  placeholder={t('placeholder.mobileNumber')}
                  onSubmitEditing={this.handleNext}
                  returnKeyType="send"
                />
                <Text style={styles.sharingText}>{t('sharing')}</Text>
                <Flex value={1} align="center" justify="start">
                  <Button
                    text={t('next')}
                    disabled={this.state.disableNext}
                    buttonTextStyle={styles.signInButton}
                    style={styles.actionButton}
                    onPress={this.handleNext}
                  />
                  <Button
                    text={t('skip')}
                    type="transparent"
                    buttonTextStyle={styles.signInButton}
                    style={styles.actionButton}
                    onPress={this.skip}
                  />
                </Flex>
              </Flex>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
        {this.state.isLoading ? <ApiLoading force={true} /> : null}
      </View>
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

export default translate('signUp')(
  connect(
    mapStateToProps,
    nav,
  )(SignUpNumber),
);
