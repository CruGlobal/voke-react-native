import React, { Component } from 'react';
import { Share } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Analytics from '../../utils/analytics';
import styles from './styles';
import { navigatePush } from '../../actions/nav';
import { Image, Flex, Button, Text, Triangle } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import { determinePushOverlay } from '../../actions/socket';

const APP_URL = 'https://www.vokeapp.com/';
function buildMessage(code, friend) {
  return `Hi ${friend}. Download Voke and use this code: ${code} ${APP_URL}`;
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
    const { journeyInvite, friendName } = this.props;

    Share.share(
      {
        message: buildMessage(journeyInvite.code, friendName),
      },
      {
        dialogTitle: 'Share',
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

  done = () => {
    const { dispatch } = this.props;
    dispatch(navigatePush('voke.Adventures', { index: 0 }));
  };

  render() {
    const { journeyInvite } = this.props;
    return (
      <Flex value={1}>
        <SafeArea style={[st.f1, st.bgBlue]}>
          <Flex style={[st.rel]} value={1}>
            <Flex align="center" justify="center">
              <Flex style={[st.mt1, st.pt1]} />
              <Flex style={styles.chatBubble}>
                <Text style={styles.chatText}>
                  Your friend's invite code is ready. Share it by clicking below
                  or copy the code below and send it to them.
                </Text>
              </Flex>
              <Triangle
                width={10}
                height={20}
                color={st.colors.offBlue}
                style={[{ marginTop: -10 }, st.rotate('45deg')]}
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
            <Flex value={1} justify="end" style={[styles.buttonWrapper]}>
              <Button
                text="Share"
                type="filled"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.share}
              />
            </Flex>
            <Flex style={[st.abstr, st.ph3, st.pv6]}>
              <Button type="transparent" text="Done" onPress={this.done} />
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

export default translate('tryItNow')(
  connect(mapStateToProps)(ShareJourneyInvite),
);
