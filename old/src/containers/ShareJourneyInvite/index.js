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
import {
  Image,
  Flex,
  Button,
  Text,
  Triangle,
  Touchable,
} from '../../components/common';
import SafeArea from '../../components/SafeArea';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import { determinePushOverlay } from '../../actions/socket';
import { toastAction } from '../../actions/auth';

const APP_URL = 'https://voke.page.link/app';
function buildMessage(t, code, friend, isGroup) {
  if (isGroup) {
    return `Download Voke and join my ${friend} Adventure. Use code: ${code} ${APP_URL}`;
  }
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
    const { t, journeyInvite, friendName, isGroup } = this.props;

    Share.share(
      {
        message: buildMessage(t, journeyInvite.code, friendName, isGroup),
      },
      {
        dialogTitle: t('share'),
      },
    ).catch(err => LOG('Share Error', err));
  };

  done = async () => {
    const { dispatch, journeyInvite, friendName } = this.props;
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
            inviteName: friendName,
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
    const { t, journeyInvite, friendName, isResend, isGroup } = this.props;
    const newJourneyInvite = journeyInvite || {};
    return (
      <Flex value={1}>
        <SafeArea style={[st.f1, st.bgBlue]}>
          <Flex style={[st.rel]} value={1} align="center" justify="center">
            <Flex align="center" justify="center">
              <Flex style={[st.mt1, st.pt1]} />
              <Flex style={styles.chatBubble}>
                <Text style={styles.chatText}>
                  {isGroup
                    ? `${friendName ||
                        'Your group'}’s  invite code is ready! Hit Share and choose how you’d like to send this invite code to each of your group members.`
                    : t(isResend ? 'codeReadyResend' : 'codeReady', {
                        name: friendName || 'Your friend',
                      })}
                </Text>
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
            <Touchable
              onPress={this.copy}
              style={[
                st.bw1,
                st.borderWhite,
                st.bgOffBlue,
                st.br6,
                st.mt3,
                st.pd6,
                st.ph3,
              ]}
            >
              <Text
                selectable={true}
                style={[st.white, st.fs1, st.w100, st.tac]}
              >
                {newJourneyInvite.code}
              </Text>
            </Touchable>
            <Flex value={1} justify="center" align="center" self="stretch">
              <Button
                text={t('share')}
                type="filled"
                buttonTextStyle={styles.signInButtonText}
                style={[
                  st.bgOrange,
                  st.pv5,
                  st.bw0,
                  st.br3,
                  st.aic,
                  st.jcc,
                  {
                    paddingHorizontal: 90,
                  },
                ]}
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
  isResend: PropTypes.bool,
  isGroup: PropTypes.bool,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate('share')(connect(mapStateToProps)(ShareJourneyInvite));
