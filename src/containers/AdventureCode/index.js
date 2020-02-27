import React, { Component } from 'react';
import { Alert, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { navigateBack, navigatePush } from '../../actions/nav';
import { acceptJourneyInvite, getMyJourneys } from '../../actions/journeys';
import { Flex, Button, Text, Touchable } from '../../components/common';
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
    showWhatsThis: false,
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
        const newJourney = await dispatch(acceptJourneyInvite(adventureCode));
        const isGroup = newJourney.kind === 'multiple';
        const myJourneys = await dispatch(getMyJourneys());
        if (onboarding) {
          dispatch(determinePushOverlay('adventurePushPermissions'));
          if (isGroup) {
            this.goToGroup(newJourney, myJourneys);
          } else {
            this.goToPhoto(true);
          }
        } else {
          if (!isGroup) {
            dispatch(navigateBack(1, { immediate: true }));
            let journeyItem = (myJourneys.journeys || []).find(
              j => j.id === newJourney.messenger_journey_id,
            );
            if (!journeyItem) {
              journeyItem = myJourneys.journeys[0];
            }
            if (journeyItem && !isGroup) {
              dispatch(
                navigatePush('voke.VideoContentWrap', {
                  item: journeyItem,
                  type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
                  trackingObj: buildTrackingObj('journey : mine', 'detail'),
                }),
              );
            }
          } else {
            this.goToGroup(newJourney, myJourneys);
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

  goToPhoto = (disableBack = false) => {
    this.setState({ isLoading: false });
    this.props.dispatch(
      navigatePush('voke.TryItNowProfilePhoto', { disableBack }),
    );
  };

  goToGroup = async (newJourney, myJourneys) => {
    this.setState({ isLoading: false });
    this.props.dispatch(
      navigatePush('voke.JoinGroup', { newJourney, myJourneys }),
    );
  };

  render() {
    const { t, onboarding, dispatch, autoShowKeyboard } = this.props;
    const { adventureCode, isLoading, showWhatsThis } = this.state;
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
            <Flex value={1} align="center" justify="end" style={[st.pb3]}>
              <Text style={styles.inputLabel}>
                {t('adventureCodeHaveCode')}
              </Text>
              <SignUpInput
                autoFocus={autoShowKeyboard}
                value={adventureCode}
                type="new"
                onChangeText={t => this.setState({ adventureCode: t })}
                placeholder={t('adventureCode')}
                autoCorrect={false}
                returnKeyType="done"
                blurOnSubmit={true}
                keyboardType={'numeric'}
              />
              <Touchable
                onPress={() => this.setState({ showWhatsThis: !showWhatsThis })}
              >
                {showWhatsThis ? (
                  <Text style={styles.inputLabelExplanation}>
                    {t('adventureCodeWhatsThisExplanation')}
                  </Text>
                ) : (
                  <Text style={styles.inputLabel}>
                    {t('adventureCodeWhatsThis')}
                  </Text>
                )}
              </Touchable>
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
                disabled={!onboarding && !adventureCode}
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
  autoShowKeyboard: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('adventureCode')(
  connect(mapStateToProps)(AdventureCode),
);
