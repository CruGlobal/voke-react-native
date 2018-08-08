import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';

class TryItNowName extends Component {
  state = {
    isLoading: false,
    name: '',
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.TryItName);
  }

  login = () => {
    const { t } = this.props;
    Keyboard.dismiss();
    if (this.state.name) {
      this.setState({ isLoading: true });
      // TODO: Figure out how to determine the user's first/last name
      let nameData = {
        me: {
          first_name: this.state.name,
        },
      };
      this.props
        .dispatch(updateMe(nameData))
        .then(() => {
          this.setState({ isLoading: false });
          this.props.onComplete();
        })
        .catch(() => {
          this.setState({ isLoading: false });
          Alert.alert('', t('error.tryAgain'));
        });
    } else {
      Alert.alert('', t('enterName'));
    }
  };

  render() {
    const { t } = this.props;
    return (
      <View style={styles.container} align="center">
        <KeyboardAvoidingView behavior="position" style={{ paddingTop: 50 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => Keyboard.dismiss()}
          >
            <Image
              resizeMode="contain"
              source={VOKE_FIRST_NAME}
              style={styles.imageLogo}
            />
            <Flex align="center" justify="center">
              <Flex style={styles.chatTriangle} />
              <Flex style={styles.chatBubble}>
                <Text style={styles.chatText}>
                  {t('whatsYourName')}
                </Text>
              </Flex>
            </Flex>
          </TouchableOpacity>
          <Flex align="center" justify="start" style={styles.actions}>
            <SignUpInput
              value={this.state.name}
              onChangeText={t => this.setState({ name: t })}
              placeholder={t('placeholder.firstName')}
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text={t('next')}
                type="filled"
                disabled={this.state.isLoading || !this.state.name}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.login}
              />
            </Flex>
          </Flex>
        </KeyboardAvoidingView>
        <Flex style={{ position: 'absolute', top: 0, left: 0 }} align="start">
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
        </Flex>
      </View>
    );
  }
}

TryItNowName.propTypes = {
  ...NavPropTypes,
  onComplete: PropTypes.func.isRequired,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('tryItNow')(
  connect(
    mapStateToProps,
    nav,
  )(TryItNowName),
);
