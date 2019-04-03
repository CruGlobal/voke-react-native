import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
  Keyboard,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { navigatePush } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import { createAccountAction, setupFirebaseLinks } from '../../actions/auth';
import styles from './styles';
import { updateMe } from '../../actions/auth';
import { navigateBack } from '../../actions/nav';
import { Flex, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import theme from '../../theme';
import st from '../../st';
import { sendJourneyInvite } from '../../actions/journeys';

class ShareEnterName extends Component {
  state = {
    isLoading: false,
    firstName: '',
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.ShareEnterName);
  }

  continue = async () => {
    const { dispatch, item } = this.props;
    try {
      this.setState({ isLoading: true });
      const result = await dispatch(
        sendJourneyInvite({
          organization_journey_id: item.id,
          code: new Array(5)
            .fill(1)
            .map(() => Math.floor(Math.random() * 10) + 1)
            .join(''),
        }),
      );
      dispatch(
        navigatePush('voke.ShareJourneyInvite', { journeyInvite: result }),
      );
      console.log('result', result);
    } catch (error) {
      console.log('error', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { dispatch } = this.props;
    const { isLoading, firstName } = this.state;
    return (
      <View style={styles.container} align="center">
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={theme.isAndroid ? undefined : 45}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ paddingTop: 60 }}
              onPress={() => Keyboard.dismiss()}
            >
              <Flex align="center" justify="center">
                <Flex style={styles.chatBubble}>
                  <Text style={styles.chatText}>
                    What is your friend's name?
                  </Text>
                </Flex>
                <Flex style={styles.chatTriangle} />
              </Flex>
              <Image
                resizeMode="contain"
                source={VOKE_FIRST_NAME}
                style={styles.imageLogo}
              />
            </TouchableOpacity>
            <Flex
              align="center"
              justify="start"
              style={[styles.actions, st.mb4]}
            >
              <Text style={styles.inputLabel}>First Name (Required)</Text>
              <SignUpInput
                value={firstName}
                type="new"
                onChangeText={t => this.setState({ firstName: t })}
                placeholder="First"
                autoCorrect={false}
                autoCapitalize="words"
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text="Continue"
                type="filled"
                isLoading={isLoading}
                disabled={isLoading || !firstName}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.continue}
              />
            </Flex>
          </KeyboardAvoidingView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          </Flex>
        </SafeArea>
      </View>
    );
  }
}

ShareEnterName.propTypes = {
  item: PropTypes.object,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('tryItNow')(connect(mapStateToProps)(ShareEnterName));
