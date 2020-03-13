import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  ScrollView,
} from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import messages from '../../reducers/messages';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import { buildTrackingObj } from '../../utils/common';
const defaultAvatar = 'https://stage.vokeapp.com/images/user/medium/avatar.jpg';

const smallCircle = st.fullWidth / 2 - 90;
const smallBox = st.fullWidth / 2 - 50;
const largeCircle = st.fullWidth / 2 - 80;
const largeBox = st.fullWidth / 2 - 30;

class JoinGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  goToPhoto = () => {
    this.props.dispatch(
      navigatePush('voke.TryItNowProfilePhoto', { disableBack: true }),
    );
  };

  seeMoreMembers = journeyItem => {
    const { dispatch } = this.props;
    dispatch(navigatePush('voke.SeeMoreMembers', { journeyItem }));
  };

  joinGroup = () => {
    const { dispatch, me, myJourneys, newJourney } = this.props;
    if ((((me || {}).avatar || {}).medium || '').includes('/avatar.jpg')) {
      this.goToPhoto();
    } else {
      // dispatch(navigateBack(2, { immediate: true }));
      dispatch(navigateResetHome());

      let journeyItem = ((myJourneys || {}).journeys || []).find(
        j => j.id === newJourney.messenger_journey_id,
      );
      if (!journeyItem) {
        journeyItem = ((myJourneys || {}).journeys || [])[0];
      }
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
    const { t, dispatch, newJourney, myJourneys, me } = this.props;
    let journeyItem = ((myJourneys || {}).journeys || []).find(
      j => j.id === newJourney.messenger_journey_id,
    );
    if (!journeyItem) {
      journeyItem = ((myJourneys || {}).journeys || [])[0];
    }
    const users = ((journeyItem || {}).conversation || {}).messengers || [];
    const usersWithoutVokeOrMe = users.filter(
      i => i.first_name !== 'VokeBot' && (i || {}).id !== (me || {}).id,
    );
    const meUser = users.find(i => (i || {}).id === (me || {}).id);
    const hasMoreMembers = usersWithoutVokeOrMe.length > 5;
    const square1User = {
      image:
        ((usersWithoutVokeOrMe[0] || {}).avatar || {}).medium || defaultAvatar,
      name: `${(usersWithoutVokeOrMe[0] || {}).first_name || ''} ${(
        usersWithoutVokeOrMe[0] || {}
      ).last_name || ''}`,
    };
    const square2User = {
      image:
        ((usersWithoutVokeOrMe[1] || {}).avatar || {}).medium || defaultAvatar,
      name: `${(usersWithoutVokeOrMe[1] || {}).first_name || ''} ${(
        usersWithoutVokeOrMe[1] || {}
      ).last_name || ''}`,
    };
    const square3User = {
      image:
        ((usersWithoutVokeOrMe[2] || {}).avatar || {}).medium || defaultAvatar,
      name: `${(usersWithoutVokeOrMe[2] || {}).first_name || ''} ${(
        usersWithoutVokeOrMe[2] || {}
      ).last_name || ''}`,
    };
    const square4User = {
      image:
        ((usersWithoutVokeOrMe[3] || {}).avatar || {}).medium || defaultAvatar,
      name: `${(usersWithoutVokeOrMe[3] || {}).first_name || ''} ${(
        usersWithoutVokeOrMe[3] || {}
      ).last_name || ''}`,
    };
    const square5User = {
      image:
        ((usersWithoutVokeOrMe[4] || {}).avatar || {}).medium || defaultAvatar,
      name: `${(usersWithoutVokeOrMe[4] || {}).first_name || ''} ${(
        usersWithoutVokeOrMe[4] || {}
      ).last_name || ''}`,
    };
    const square6User = {
      image: ((meUser || {}).avatar || {}).medium,
      name: `${(meUser || {}).first_name || ''} ${(meUser || {}).last_name ||
        ''}`,
    };

    return (
      <View style={styles.container}>
        <SafeArea style={[st.f1, st.bgBlue]} top={[st.bgBlue]}>
          <ScrollView style={[st.bgBlue, st.f1]}>
            <Flex style={[st.mt(40)]}>
              <Flex align="center" justify="center">
                <Flex style={styles.chatBubble}>
                  <Text style={styles.chatText}>
                    Welcome to {newJourney.name}!
                  </Text>
                </Flex>
                <Flex style={styles.chatTriangle} />
              </Flex>
            </Flex>
            <Flex direction="column">
              <Flex direction="row" align="center" justify="center">
                <Flex
                  direction="column"
                  align="center"
                  style={[
                    st.bgDarkerBlue,
                    st.pd5,
                    st.m5,
                    st.ml0,
                    {
                      width: largeBox,
                      height: largeBox,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: square1User.image }}
                    style={[
                      {
                        height: largeCircle,
                        width: largeCircle,
                        borderRadius: largeCircle / 2,
                        borderWidth: st.isAndroid ? 0 : 1,
                        borderColor: st.colors.red,
                      },
                    ]}
                  />
                  <Text style={[st.fs5, st.white, st.tac]}>
                    {square1User.name}
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  align="center"
                  style={[
                    st.bgOffBlue,
                    st.pd5,
                    st.m5,
                    {
                      width: smallBox,
                      height: smallBox,
                      marginRight: 15,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: square2User.image }}
                    style={[
                      {
                        height: smallCircle,
                        width: smallCircle,
                        borderRadius: smallCircle / 2,
                      },
                    ]}
                  />
                  <Text style={[st.fs5, st.white, st.tac]}>
                    {square2User.name}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="row" align="center" justify="center">
                <Flex
                  direction="column"
                  align="center"
                  style={[
                    st.bgOffBlue,
                    st.pd5,
                    st.m5,
                    {
                      width: smallBox,
                      height: smallBox,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: square3User.image }}
                    style={[
                      {
                        height: smallCircle,
                        width: smallCircle,
                        borderRadius: smallCircle / 2,
                      },
                    ]}
                  />
                  <Text style={[st.fs5, st.white, st.tac]}>
                    {square3User.name}
                  </Text>
                </Flex>
                <Flex
                  direction="column"
                  align="center"
                  style={[
                    st.bgOffBlue,
                    st.pd5,
                    st.m5,
                    {
                      width: smallBox,
                      height: smallBox,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: square4User.image }}
                    style={[
                      {
                        height: smallCircle,
                        width: smallCircle,
                        borderRadius: smallCircle / 2,
                      },
                    ]}
                  />
                  <Text style={[st.fs5, st.white, st.tac]}>
                    {square4User.name}
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="row" align="center" justify="center">
                <Flex
                  direction="column"
                  align="center"
                  style={[
                    st.bgOffBlue,
                    st.pd5,
                    st.m5,
                    {
                      width: smallBox,
                      height: smallBox,
                    },
                  ]}
                >
                  <Image
                    resizeMode="contain"
                    source={{ uri: square5User.image }}
                    style={[
                      {
                        height: smallCircle,
                        width: smallCircle,
                        borderRadius: smallCircle / 2,
                      },
                    ]}
                  />
                  <Text style={[st.fs5, st.white, st.tac]}>
                    {square5User.name}
                  </Text>
                </Flex>
                <Touchable
                  isAndroidOpacity={true}
                  onPress={this.joinGroup}
                  style={[
                    st.bgOrange,
                    st.pd5,
                    st.m5,
                    {
                      width: smallBox,
                      height: smallBox,
                    },
                  ]}
                >
                  <Flex direction="column" align="start" justify="center">
                    <Flex align="end" self="stretch">
                      <Image
                        resizeMode="contain"
                        source={{ uri: square6User.image }}
                        style={[
                          {
                            height: st.fullWidth / 2 - 140,
                            width: st.fullWidth / 2 - 140,
                            borderRadius: (st.fullWidth / 2 - 140) / 2,
                          },
                        ]}
                      />
                    </Flex>
                    <Flex direction="row" align="end" justify="end">
                      <Text
                        style={[
                          st.white,
                          st.tal,
                          { fontSize: st.isAndroid ? 16 : 20, maxWidth: 80 },
                        ]}
                      >
                        Join the Group
                      </Text>
                      <VokeIcon
                        type="image"
                        style={[{ height: 30 }, st.ml4]}
                        name={'buttonArrow'}
                      />
                    </Flex>
                  </Flex>
                </Touchable>
              </Flex>
              {hasMoreMembers ? (
                <Flex align="center" self="stretch">
                  <Button
                    onPress={() => this.seeMoreMembers(journeyItem)}
                    style={[
                      st.bgOrange,
                      st.ph6,
                      st.pv5,
                      st.bw0,
                      st.br3,
                      st.mt5,
                      st.aic,
                      { width: st.fullWidth - 90 },
                    ]}
                  >
                    <Flex direction="row" align="center">
                      <Text>See all members</Text>
                    </Flex>
                  </Button>
                </Flex>
              ) : null}
            </Flex>
          </ScrollView>
        </SafeArea>
      </View>
    );
  }
}

JoinGroup.propTypes = {
  newJourney: PropTypes.object,
  myJourneys: PropTypes.object,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user || {},
});

export default translate('tryItNow')(connect(mapStateToProps)(JoinGroup));
