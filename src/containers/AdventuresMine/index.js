import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import i18n from '../../i18n';
import {
  View,
  Image,
  Text,
  Flex,
  Button,
  Triangle,
} from '../../components/common';
import {
  getMyJourneys,
  getJourneyInvites,
  deleteJourneyInvite,
  resendJourneyInvite,
} from '../../actions/journeys';
import { navigatePush } from '../../actions/nav';
import { startupAction, confirmAlert } from '../../actions/auth';
import MyAdventuresList from '../../components/MyAdventuresList';
import VOKE_LINK from '../../../images/vokebot_whole.png';
import { buildTrackingObj } from '../../utils/common';
import st from '../../st';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';

const VB_WIDTH = st.fullWidth * 0.2;
const VB_MARGIN = -35;

class AdventuresMine extends Component {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    const { me, dispatch } = this.props;
    this.load();
    if (me && me.language && me.language.language_code) {
      i18n.changeLanguage(me.language.language_code.toLowerCase());
    }
    this.startupTimeout = setTimeout(() => {
      dispatch(startupAction());
    }, 50);
  }

  load = async () => {
    const { dispatch } = this.props;
    return Promise.all([
      await dispatch(getMyJourneys()),
      await dispatch(getJourneyInvites()),
    ]);
  };

  handleNextPage = () => {
    // // TODO:
    // const pagination = this.props.pagination;
    //
    // let page;
    // let query = {};
    // // Custom logic for channel pagination
    // const channelId = this.props.channel ? this.props.channel.id : undefined;
    // if (channelId) {
    //   // If there is a new filter for channel pagination, do nothing
    //   if (pagination.channel.type !== filter || !pagination.channel.hasMore) {
    //     return;
    //   }
    //   page = pagination.channel.page + 1;
    //   query.page = page;
    // } else {
    //   if (!pagination[filter] || !pagination[filter].hasMore) {
    //     return;
    //   }
    //   page = pagination[filter].page + 1;
    //   query.page = page;
    // }
  };

  handleRefresh = () => {
    return this.load();
  };

  handleAdventureCode = () => {
    this.props.dispatch(navigatePush('voke.AdventureCode'));
  };

  handleSelect = item => {
    const { dispatch } = this.props;
    dispatch(
      navigatePush('voke.VideoContentWrap', {
        item,
        type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
        trackingObj: buildTrackingObj('journey : mine', 'detail'),
      }),
    );
  };

  handleResendInvite = item => {
    const { dispatch } = this.props;
    dispatch(resendJourneyInvite(item.id));
  };

  handleDeleteInvite = item => {
    const { dispatch } = this.props;
    dispatch(
      confirmAlert(
        `Are you sure you want to delete ${item.name ||
          'your friend'}'s invite?`,
        `This cannot be undone. You can always invite them again by using "Invite a Friend".`,
        async () => {
          await dispatch(deleteJourneyInvite(item.id));
          this.load();
        },
      ),
    );
  };

  renderAdventureCode = () => {
    return (
      <Flex justify="center">
        <Button
          text="I have an Adventure Code"
          isLoading={this.state.isLoading}
          style={[st.w(st.fullWidth - 40), st.aic, st.mv5, st.asc]}
          buttonTextStyle={{ textAlign: 'center' }}
          onPress={this.handleAdventureCode}
        />
      </Flex>
    );
  };

  renderNull = () => {
    const { me } = this.props;
    return (
      <Flex value={1} align="center" justify="end" direction="column">
        {this.renderAdventureCode()}
        <Flex value={1} align="center" justify="end" direction="column">
          <Triangle
            width={15}
            height={30}
            color={st.colors.offBlue}
            style={[
              st.abs,
              st.right(st.fullWidth - 170),
              st.bottom(60),
              st.rotate('45deg'),
            ]}
          />
          <Flex style={[st.br6, st.bgOffBlue, st.pd4, st.mh5]}>
            <Text style={[st.white, st.fs5, st.tac]}>
              Welcome{me.first_name ? ` ${me.first_name}` : ''}! This is where
              you will find all of your adventures with your friends.
            </Text>
          </Flex>
          <Image
            resizeMode="contain"
            source={VOKE_LINK}
            style={[st.asc, st.w(VB_WIDTH), { marginBottom: VB_MARGIN }]}
          />
        </Flex>
      </Flex>
    );
  };

  render() {
    const { isLoading } = this.state;
    const { me, myJourneys, invites, dispatch } = this.props;
    const data = [].concat(invites, myJourneys);
    return (
      <View style={[st.f1, st.bgBlue]}>
        {myJourneys.length < 1 && invites.length < 1 ? (
          this.renderNull()
        ) : (
          <MyAdventuresList
            items={data}
            onSelect={this.handleSelect}
            onResendInvite={this.handleResendInvite}
            onDeleteInvite={this.handleDeleteInvite}
            onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
            isLoading={isLoading}
            header={this.renderAdventureCode}
            me={me}
            onClickProfile={() => dispatch(navigatePush('voke.Profile'))}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth, journeys }) => ({
  me: auth.user,
  myJourneys: journeys.mine,
  invites: journeys.invites,
});

export default translate()(connect(mapStateToProps)(AdventuresMine));
