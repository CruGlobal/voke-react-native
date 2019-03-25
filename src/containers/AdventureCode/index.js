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
import { navigateBack, navigatePush } from '../../actions/nav';
import { getJourneyInvite } from '../../actions/journeys';
import { Flex, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import theme, { COLORS } from '../../theme';
import st from '../../st';

class AdventureCode extends Component {
  state = {
    isLoading: false,
    adventureCode: '',
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.AdventureCode);
  }

  handleCodeSearch = () => {
    const { dispatch, onboarding } = this.props;
    const { adventureCode } = this.state;
    if (!adventureCode && onboarding) {
      this.goToName();
      this.setState({ isLoading: false });
    } else {
      dispatch(getJourneyInvite(adventureCode))
        .then(r => {
          console.log('journey invite code results', r);
          this.setState({ isLoading: false });
        })
        .catch(err => {
          console.log('error getting journey invite', err);
          this.setState({ isLoading: false });
        });
    }
  };

  goToName = () => {
    this.setState({ isLoading: true });
    this.props.dispatch(navigatePush('voke.TryItNowName'));
  };

  render() {
    const { t, onboarding, dispatch } = this.props;
    return (
      <View style={[st.f1, st.bgBlue]} align="center">
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={[st.f1, st.bgBlue]}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={theme.isAndroid ? undefined : 45}
          >
            <Flex value={3} align="center" justify="center" style={[st.pb3]}>
              <Text style={styles.inputLabel}>Adventure Code</Text>
              <SignUpInput
                value={this.state.adventureCode}
                type="new"
                onChangeText={t => this.setState({ adventureCode: t })}
                placeholder="Adventure Code"
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text={
                  onboarding && !this.state.adventureCode
                    ? `I Don't Have One`
                    : 'Continue'
                }
                type="filled"
                disabled={
                  this.state.isLoading ||
                  (!onboarding && !this.state.adventureCode)
                }
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.handleCodeSearch}
              />
            </Flex>
          </KeyboardAvoidingView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          </Flex>
          {!onboarding ? (
            <Flex style={[st.abstr, st.pr3, st.pt3]}>
              <Button
                type="transparent"
                text="Cancel"
                onPress={() => dispatch(navigateBack())}
              />
            </Flex>
          ) : null}
        </SafeArea>
      </View>
    );
  }
}

AdventureCode.propTypes = {
  onboarding: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('tryItNow')(connect(mapStateToProps)(AdventureCode));
