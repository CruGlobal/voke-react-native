import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import { Flex, Text, Button, Triangle } from '../../components/common';
import { createMyJourney } from '../../actions/journeys';
import { navigatePush } from '../../actions/nav';
import st from '../../st';
import { buildTrackingObj } from '../../utils/common';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';

class OrgJourneyDetail extends Component {
  state = {
    myselfIsLoading: false,
    friendIsLoading: false,
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
    dispatch(navigatePush('voke.ShareEnterName', { item }));
  };

  render() {
    const { t, item, myJourneys } = this.props;
    const { myselfIsLoading, friendIsLoading } = this.state;

    const haveStartedSolo = !!myJourneys.find(
      i =>
        i.organization_journey_id === item.id &&
        i.conversation.messengers.length === 2,
    );

    return (
      <Flex value={1} style={[st.bgWhite]}>
        <Flex style={[st.pd3]}>
          <Text style={[st.fs2, st.blue]}>{item.name}</Text>
          <Text style={[st.pt5, st.charcoal]}>
            {item.total_steps}-{t('partSeries')}
          </Text>
          <Text style={[st.charcoal, st.pv4]}>{item.description}</Text>
        </Flex>
        <Flex value={1} justify="end">
          <Triangle width={st.fullWidth} height={80} color={st.colors.blue} />
          <Flex style={[st.bgBlue, st.pv4]} align="center" justify="center">
            <Text style={[st.fs3, st.white, st.pb5]}>
              {haveStartedSolo
                ? t('whoCanYouTake')
                : t('startThe')}
            </Text>
            <Flex direction="row" justify="center" style={[st.w100]}>
              {!haveStartedSolo ? (
                <Flex value={1} style={[st.ml3]}>
                  <Button
                    text={t('byMyself')}
                    onPress={this.myself}
                    isLoading={myselfIsLoading}
                    style={[
                      st.bgOrange,
                      st.ph6,
                      st.pv5,
                      st.bw0,
                      st.br0,
                      st.brtl3,
                      st.brbl3,
                      st.aic,
                      st.mr(1),
                    ]}
                  />
                </Flex>
              ) : null}
              <Flex value={1} style={[haveStartedSolo ? st.mh3 : st.mr3]}>
                <Button
                  text={haveStartedSolo ? t('inviteFriend') : t('withFriend')}
                  onPress={this.friend}
                  isLoading={friendIsLoading}
                  style={[
                    st.bgOrange,
                    st.ph6,
                    st.pv5,
                    st.bw0,
                    st.br0,
                    st.brtr3,
                    st.aic,
                    st.brbr3,
                    haveStartedSolo ? [st.brtl3, st.brbl3] : '',
                  ]}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
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
