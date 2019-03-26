import React, { Component } from 'react';
import { Alert } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import Analytics from '../../utils/analytics';

import { Flex, Text, Button, Triangle } from '../../components/common';
import { createMyJourney } from '../../actions/journeys';
import { navigatePush } from '../../actions/nav';
import st from '../../st';
import { buildTrackingObj } from '../../utils/common';

class OrgJourneyDetail extends Component {
  state = {
    myselfIsLoading: false,
    friendIsLoading: false,
  };

  componentDidMount() {
    Analytics.screen(Analytics.s.OrgJourneyDetail);
  }
  myself = async () => {
    const { dispatch, item } = this.props;
    this.setState({ myselfIsLoading: true });
    // TODO: Go to the new journey page
    try {
      const result = await dispatch(
        createMyJourney({ organization_journey_id: item.id }),
      );
      this.setState({ myselfIsLoading: false });
      this.props.dispatch(
        navigatePush(
          'voke.VideoContentWrap',
          {
            item: result,
            type: 'journeyDetail',
            trackingObj: buildTrackingObj('journey : mine', 'detail'),
          },
          'journeyDetail',
        ),
      );
    } catch (e) {
      console.log('Error starting adventure by myself', e);
      this.setState({ myselfIsLoading: false });
    }
  };
  friend = () => {
    this.setState({ friendIsLoading: true });
    Alert.alert('With a Friend! Coming soon', '', [
      { text: 'OK', onPress: () => this.setState({ friendIsLoading: false }) },
    ]);
    console.log('with a friend');
  };
  render() {
    const { item, myJourneys } = this.props;
    const { myselfIsLoading, friendIsLoading } = this.state;

    const haveStartedSolo = !!myJourneys.find(
      i => i.organization_journey_id === item.id,
    );

    return (
      <Flex value={1} style={[st.bgWhite]}>
        <Flex style={[st.pd3]}>
          <Text style={[st.fs2, st.blue]}>{item.name}</Text>
          <Text style={[st.pt5, st.charcoal]}>8-part Series</Text>
          <Text style={[st.charcoal, st.pv4]}>{item.description}</Text>
        </Flex>
        <Flex value={1} justify="end">
          <Triangle width={st.fullWidth} height={80} color={st.colors.blue} />
          <Flex style={[st.bgBlue, st.pv4]} align="center" justify="center">
            <Text style={[st.fs3, st.white, st.pb5]}>
              {haveStartedSolo
                ? 'Who can you take with you?'
                : `Start the ${item.name}`}
            </Text>
            <Flex direction="row" justify="center" style={[st.w100]}>
              {!haveStartedSolo ? (
                <Flex value={1} style={[st.ml3]}>
                  <Button
                    text="By Myself"
                    onPress={this.myself}
                    isLoading={myselfIsLoading}
                    style={[
                      st.bgOrange,
                      st.ph3,
                      st.pv5,
                      st.bw0,
                      st.br0,
                      st.brtl3,
                      st.brbl3,
                      st.aic,
                      { marginRight: 1 },
                    ]}
                  />
                </Flex>
              ) : null}
              <Flex value={1} style={[haveStartedSolo ? st.mh3 : st.mr3]}>
                <Button
                  text={haveStartedSolo ? 'Invite a Friend' : 'With a Friend'}
                  onPress={this.friend}
                  isLoading={friendIsLoading}
                  style={[
                    st.bgOrange,
                    st.ph3,
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
