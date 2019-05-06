import React, { Component } from 'react';
import { Share, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Analytics from '../../utils/analytics';
import { buildTrackingObj } from '../../utils/common';
import styles from './styles';
import { navigateResetHome } from '../../actions/nav';
import { getMyJourney, getMyJourneySteps } from '../../actions/journeys';
import { Image, Flex, Button, Text, Triangle } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import { determinePushOverlay } from '../../actions/socket';
import { toastAction } from '../../actions/auth';

const APP_URL = 'https://voke.page.link/app';
function buildMessage(t, code, friend) {
  return t('downloadMessage', { code, friend, appUrl: APP_URL });
}

class ShareJourneyInvite extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.ShareJourneyInvite);
    this.overlay();
  }

  overlay = () => {
    const { dispatch } = this.props;
    dispatch(determinePushOverlay('adventurePushPermissions'));
  };

  share = () => {
    const { t, journeyInvite, friendName } = this.props;

    Share.share(
      {
        message: buildMessage(t, journeyInvite.code, friendName),
      },
      {
        dialogTitle: t('share'),
      },
    )
      .then(({ action, activityType }) => {
        if (action === Share.sharedAction) {
          LOG('shared!', activityType);
        } else {
          LOG('not shared!');
        }
      })
      .catch(err => LOG('Share Error', err));
  };

  done = async () => {
    const { dispatch, journeyInvite } = this.props;
    const journey = await dispatch(
      getMyJourney(journeyInvite.messenger_journey_id),
    );
    const { steps } = await dispatch(getMyJourneySteps(journey.id));
    dispatch(
      navigateResetHome({
        navTo: {
          routeName: 'voke.VideoContentWrap',
          params: {
            item: steps[0],
            journey: journey,
            type: VIDEO_CONTENT_TYPES.JOURNEYSTEPDETAIL,
            trackingObj: buildTrackingObj('journey : mine', 'detail', 'step'),
          },
        },
      }),
    );
  };

  copy = () => {
    const { t, dispatch, journeyInvite } = this.props;
    Clipboard.setString(`${journeyInvite.code}`);
    dispatch(toastAction(t('copied')));
  };

  render() {
    const { t, journeyInvite } = this.props;
    return (
      <Flex value={1}>
        <SafeArea style={[st.f1, st.bgBlue]}>
          <Flex style={[st.rel]} value={1}>
            <Flex align="center" justify="center">
              <Flex style={[st.mt1, st.pt1]} />
              <Flex style={styles.chatBubble}>
                <Text style={styles.chatText}>{t('codeReady')}</Text>
              </Flex>
              <Triangle
                width={10}
                height={20}
                color={st.colors.offBlue}
                style={[st.mt(-10), st.rotate('45deg')]}
              />
            </Flex>
            <Image
              resizeMode="contain"
              source={VOKE_FIRST_NAME}
              style={styles.imageLogo}
            />
            <Text selectable={true} style={[st.white, st.fs1, st.w100, st.tac]}>
              {journeyInvite.code}
            </Text>
            <Button
              text={t('copy')}
              type="transparent"
              buttonTextStyle={styles.signInButtonText}
              style={styles.signInButton}
              onPress={this.copy}
            />
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text={t('share')}
                type="filled"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.share}
              />
            </Flex>
            <Flex style={[st.abstr, st.ph3, st.pv4]}>
              <Button type="transparent" text={t('done')} onPress={this.done} />
            </Flex>
          </Flex>
        </SafeArea>
      </Flex>
    );
  }
}

ShareJourneyInvite.propTypes = {
  journeyInvite: PropTypes.object,
  friendName: PropTypes.string,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('share')(connect(mapStateToProps)(ShareJourneyInvite));
