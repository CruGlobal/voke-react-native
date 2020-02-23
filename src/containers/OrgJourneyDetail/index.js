import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import {
  Flex,
  Text,
  Button,
  Triangle,
  Touchable,
  VokeIcon,
} from '../../components/common';
import { createMyJourney } from '../../actions/journeys';
import { navigatePush } from '../../actions/nav';
import st from '../../st';
import { buildTrackingObj } from '../../utils/common';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';
import { vokeIcons, vokeImages } from '../../utils/iconMap';

class OrgJourneyDetail extends Component {
  state = {
    myselfIsLoading: false,
    friendIsLoading: false,
    groupIsLoading: false,
    isModalShowing: false,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.OrgJourneyDetail);
  }
  myself = async () => {
    const { dispatch, item, onPause } = this.props;
    this.setState({ myselfIsLoading: true });
    onPause();

    try {
      const result = await dispatch(
        createMyJourney({ organization_journey_id: item.id }),
      );
      this.setState({ myselfIsLoading: false });
      dispatch(
        navigatePush(
          'voke.VideoContentWrap',
          {
            item: result,
            journey: item,
            shouldNavigateHome: true,
            type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
            trackingObj: buildTrackingObj('journey : mine', 'detail'),
          },
          VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
        ),
      );
    } catch (e) {
      LOG('Error starting adventure by myself', e);
      this.setState({ myselfIsLoading: false });
    }
  };

  friend = async () => {
    const { dispatch, item, onPause } = this.props;
    onPause();
    try {
      dispatch(navigatePush('voke.ShareEnterName', { item }));
    } catch {}
  };

  group = async () => {
    const { dispatch, item, onPause } = this.props;
    onPause();
    try {
      dispatch(navigatePush('voke.ShareEnterName', { item, isGroup: true }));
    } catch {}
  };

  render() {
    const { t, item, myJourneys } = this.props;
    const { myselfIsLoading, friendIsLoading, groupIsLoading } = this.state;
    const newItem = item || {};
    let haveStartedSolo = false;
    if ((myJourneys || []).length > 0) {
      haveStartedSolo = !!myJourneys.find(
        i =>
          i.organization_journey_id === item.id &&
          i.conversation.messengers.length === 2,
      );
    }
    return (
      <Fragment>
        <Flex value={1} style={[st.bgWhite]}>
          <Flex style={[st.pd3]}>
            <Text style={[st.fs2, st.blue]}>{newItem.name}</Text>
            <Text style={[st.pt5, st.charcoal]}>
              {newItem.total_steps}-{t('partSeries')}
            </Text>
            <Text style={[st.charcoal, st.pv4]}>{newItem.description}</Text>
          </Flex>
          <Flex value={1} justify="end">
            <Triangle width={st.fullWidth} height={80} color={st.colors.blue} />
            <Flex style={[st.bgBlue, st.pv4]} align="center" justify="center">
              <Text style={[st.fs3, st.white, st.pb5]}>
                {haveStartedSolo ? t('whoCanYouTake') : t('startThe')}
              </Text>
              <Flex direction="row" justify="center" style={[st.w100]}>
                <Flex value={1} align="center" style={[]}>
                  <Button
                    text={'Start'}
                    onPress={() => this.setState({ isModalShowing: true })}
                    isLoading={friendIsLoading}
                    style={[
                      st.bgOrange,
                      st.ph6,
                      st.pv5,
                      st.bw0,
                      st.br3,
                      { width: st.fullWidth - 60 },
                      st.aic,
                    ]}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        {this.state.isModalShowing ? (
          <Flex direction="column" style={[st.absfill, { zIndex: 100000 }]}>
            <Flex self="stretch" justify="end" value={1}>
              <Touchable
                style={[{ width: st.fullWidth, height: st.fullHeight }]}
                onPress={() => this.setState({ isModalShowing: false })}
              />
              <Flex
                direction="column"
                justify="end"
                align="center"
                style={[st.bgBlue, st.ph2, st.pt2]}
              >
                <Text style={[st.aic, st.fs4, st.mb4, st.ph1, st.tac]}>
                  How would you like to start this adventure?
                </Text>
                <Button
                  onPress={this.friend}
                  isLoading={friendIsLoading}
                  style={[
                    st.bgOrange,
                    st.ph6,
                    st.pv5,
                    st.bw0,
                    st.br3,
                    st.aic,
                    { width: st.fullWidth - 60 },
                  ]}
                >
                  <Flex direction="row" align="center">
                    <VokeIcon
                      type="image"
                      style={[{ height: 20 }, st.mr5]}
                      name={'withFriend'}
                    />
                    <Text>With a Friend</Text>
                    <VokeIcon
                      type="image"
                      style={[{ height: 15 }, st.ml5]}
                      name={'buttonArrow'}
                    />
                  </Flex>
                </Button>
                <Button
                  onPress={this.group}
                  isLoading={groupIsLoading}
                  style={[
                    st.bgOrange,
                    st.ph6,
                    st.pv5,
                    st.bw0,
                    st.br3,
                    st.mv4,
                    st.aic,
                    { width: st.fullWidth - 60 },
                  ]}
                >
                  <Flex direction="row" align="center">
                    <VokeIcon
                      type="image"
                      style={[{ height: 20 }, st.mr5]}
                      name={'withGroup'}
                    />
                    <Text>With a Group</Text>
                    <VokeIcon
                      type="image"
                      style={[{ height: 15 }, st.ml5]}
                      name={'buttonArrow'}
                    />
                  </Flex>
                </Button>

                {!haveStartedSolo ? (
                  <Button
                    text={t('byMyself')}
                    onPress={this.myself}
                    isLoading={myselfIsLoading}
                    style={[
                      st.bgOrange,
                      st.ph6,
                      st.pv5,
                      st.bw0,
                      st.br3,
                      st.aic,
                      { width: st.fullWidth - 60 },
                    ]}
                  >
                    <Flex direction="row" align="center">
                      <VokeIcon
                        type="image"
                        style={[{ height: 15 }, st.mr5]}
                        name={'byMyself'}
                      />
                      <Text>By Myself</Text>
                      <VokeIcon
                        type="image"
                        style={[{ height: 15 }, st.ml5]}
                        name={'buttonArrow'}
                      />
                    </Flex>
                  </Button>
                ) : null}
              </Flex>
            </Flex>
          </Flex>
        ) : null}
      </Fragment>
    );
  }
}

OrgJourneyDetail.propTypes = {
  item: PropTypes.object.isRequired,
  onPause: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, journeys }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  myJourneys: journeys.mine,
});

export default translate('journey')(connect(mapStateToProps)(OrgJourneyDetail));
