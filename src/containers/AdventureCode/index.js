import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { navigateBack, navigatePush } from '../../actions/nav';
import { acceptJourneyInvite, getMyJourneys } from '../../actions/journeys';
import { Flex, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import { determinePushOverlay } from '../../actions/socket';
import { buildTrackingObj } from '../../utils/common';
import theme from '../../theme';
import st from '../../st';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';

class AdventureCode extends Component {
  state = {
    isLoading: false,
    adventureCode: '',
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.AdventureCode);
  }

  handleCodeSearch = async () => {
    const { t, dispatch, onboarding } = this.props;
    const { adventureCode } = this.state;
    this.setState({ isLoading: true });

    if (!adventureCode && onboarding) {
      this.goToPhoto();
      this.setState({ isLoading: false });
    } else {
      if (!adventureCode) {
        this.setState({ isLoading: false });
        return;
      }
      try {
        await dispatch(acceptJourneyInvite(adventureCode));

        if (onboarding) {
          dispatch(determinePushOverlay('adventurePushPermissions'));
          this.goToPhoto();
        } else {
          const r = await dispatch(getMyJourneys());

          dispatch(navigateBack(1, { immediate: true }));
          if (r.journeys[r.journeys.length - 1]) {
            dispatch(
              navigatePush('voke.VideoContentWrap', {
                item: r.journeys[r.journeys.length - 1],
                type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
                trackingObj: buildTrackingObj('journey : mine', 'detail'),
              }),
            );
          }
        }
        this.setState({ isLoading: false });
      } catch (err) {
        this.setState({ isLoading: false });
        let message = err.error;
        if (!message && err.errors && err.errors[0]) {
          message = err.errors[0];
        }
        Alert.alert(t('ohNo'), message);
      }
    }
  };

  goToPhoto = () => {
    this.setState({ isLoading: true });
    this.props.dispatch(navigatePush('voke.TryItNowProfilePhoto'));
  };

  render() {
    const { t, onboarding, dispatch } = this.props;
    const { adventureCode, isLoading } = this.state;
    return (
      <Flex value={1}>
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <KeyboardAvoidingView
            style={[st.f1, st.bgBlue]}
            behavior={theme.isAndroid ? undefined : 'padding'}
            keyboardVerticalOffset={
              theme.isAndroid ? undefined : st.hasNotch ? 45 : 20
            }
          >
            <Flex value={3} align="center" justify="center" style={[st.pb3]}>
              <Text style={styles.inputLabel}>{t('adventureCode')}</Text>
              <SignUpInput
                value={adventureCode}
                type="new"
                onChangeText={t => this.setState({ adventureCode: t })}
                placeholder={t('adventureCode')}
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
              />
            </Flex>
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text={
                  onboarding && !adventureCode
                    ? t('dontHaveOne')
                    : t('continue')
                }
                type="filled"
                isLoading={isLoading}
                disabled={isLoading || (!onboarding && !adventureCode)}
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
                text={t('cancel')}
                onPress={() => dispatch(navigateBack())}
              />
            </Flex>
          ) : null}
        </SafeArea>
      </Flex>
    );
  }
}

AdventureCode.propTypes = {
  onboarding: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('adventureCode')(
  connect(mapStateToProps)(AdventureCode),
);
