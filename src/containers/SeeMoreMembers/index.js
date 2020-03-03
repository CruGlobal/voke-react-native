import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { updateMe } from '../../actions/auth';
import ImagePicker from '../../components/ImagePicker';
import Analytics from '../../utils/analytics';
import {
  navigateBack,
  navigateResetHome,
  navigatePush,
} from '../../actions/nav';

import {
  Image,
  View,
  Flex,
  Icon,
  Button,
  Text,
  Touchable,
  VokeIcon,
} from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import messages from '../../reducers/messages';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import { buildTrackingObj } from '../../utils/common';
const defaultAvatar =
  'https://assets-stage.vokeapp.com/images/user/medium/avatar.jpg';
class SeeMoreMembers extends Component {
  goToPhoto = () => {
    this.props.dispatch(
      navigatePush('voke.TryItNowProfilePhoto', { disableBack: true }),
    );
  };

  joinGroup = () => {
    const { dispatch, me, journeyItem } = this.props;
    if (((me || {}).avatar || {}).medium === defaultAvatar) {
      this.goToPhoto();
    } else {
      dispatch(navigateBack(3, { immediate: true }));
      if (journeyItem) {
        dispatch(
          navigatePush('voke.VideoContentWrap', {
            item: journeyItem,
            type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
            trackingObj: buildTrackingObj('journey : mine', 'detail'),
          }),
        );
      }
    }
  };

  render() {
    const { t, dispatch, journeyItem, me, isAlreadyJoined } = this.props;
    const users = ((journeyItem || {}).conversation || {}).messengers || [];
    const usersWithoutVokeOrMe = users.filter(
      i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
    );
    const usersWithoutVoke = users.filter(i => i.first_name !== 'VokeBot');

    const usersToMap = !isAlreadyJoined
      ? usersWithoutVokeOrMe
      : usersWithoutVoke;
    const groupName = (journeyItem.journey_invite || {}).name || '';
    const code = (journeyItem.journey_invite || {}).code || '';
    return (
      <View style={styles.container}>
        <SafeArea style={[st.f1, st.bgBlue]} top={[st.bgBlue]}>
          <ScrollView style={[st.bgBlue, st.f1]}>
            <Flex direction="column" style={[st.mt(40)]}>
              <Flex align="center" justify="center">
                <Text style={styles.chatText}>{groupName}</Text>
              </Flex>
              {!isAlreadyJoined ? (
                <Flex align="center" self="stretch">
                  <Button
                    onPress={this.joinGroup}
                    style={[
                      st.bgOrange,
                      st.ph6,
                      st.pv5,
                      st.bw0,
                      st.br3,
                      st.m5,
                      st.aic,
                      { width: st.fullWidth - 90 },
                    ]}
                  >
                    <Flex direction="row" align="center">
                      <Text>Join the Group</Text>
                    </Flex>
                  </Button>
                </Flex>
              ) : (
                <Text style={styles.chatText}>Group Code: {code}</Text>
              )}
            </Flex>
            <Flex direction="column">
              <Flex direction="row" align="center" justify="center" wrap="wrap">
                {(usersToMap || []).map((user, index) => (
                  <Flex
                    direction="column"
                    align="center"
                    style={[
                      st.bgOffBlue,
                      { [st.bgDarkerBlue]: index === 0 },
                      st.pd5,
                      st.m5,
                      {
                        width: st.fullWidth / 2 - 50,
                        height: st.fullWidth / 2 - 50,
                      },
                    ]}
                  >
                    <Image
                      resizeMode="contain"
                      source={{
                        uri:
                          ((user || {}).avatar || {}).medium || defaultAvatar,
                      }}
                      style={[
                        {
                          height: st.fullWidth / 2 - 90,
                          width: st.fullWidth / 2 - 90,
                          borderRadius: (st.fullWidth / 2 - 90) / 2,
                        },
                        {
                          [{
                            borderWidth: 1,
                            borderColor: st.colors.red,
                          }]: index === 0,
                        },
                      ]}
                    />
                    <Text style={[st.fs5, st.white, st.tac]}>
                      {`${(user || {}).first_name || ''} ${(user || {})
                        .last_name || ''}`}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
          </ScrollView>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
          </Flex>
        </SafeArea>
      </View>
    );
  }
}

SeeMoreMembers.propTypes = {
  journeyItem: PropTypes.object,
  isAlreadyJoined: PropTypes.bool,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user || {},
});

export default translate('tryItNow')(connect(mapStateToProps)(SeeMoreMembers));
