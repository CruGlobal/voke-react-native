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
  getMyJourney,
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
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      language: props.language,
    };
  }

  componentDidMount() {
    const { me, dispatch } = this.props;
    this.load();
    const code = ((me || {}).language || {}).language_code;
    if (code) {
      this.setState({ language: code });
      i18n.changeLanguage(code.toLowerCase());
    }
    this.startupTimeout = setTimeout(() => {
      dispatch(startupAction());
    }, 50);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.language !== this.state.language) {
      this.setState({ language: nextProps.language });
      i18n.changeLanguage(nextProps.language.toLowerCase());
    }
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
    if (item.code) {
      dispatch(getMyJourney(item.messenger_journey_id)).then(r => {
        dispatch(
          navigatePush('voke.VideoContentWrap', {
            item: r,
            inviteName: item.name,
            type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
            trackingObj: buildTrackingObj('journey : mine', 'detail'),
          }),
        );
      });
    } else {
      dispatch(
        navigatePush('voke.VideoContentWrap', {
          item,
          type: VIDEO_CONTENT_TYPES.JOURNEYDETAIL,
          trackingObj: buildTrackingObj('journey : mine', 'detail'),
        }),
      );
    }
  };

  handleResendInvite = item => {
    const { dispatch } = this.props;
    dispatch(resendJourneyInvite(item.id)).then(r => {
      dispatch(
        navigatePush('voke.ShareJourneyInvite', {
          journeyInvite: r,
          friendName: r.name,
          isResend: true,
        }),
      );
    });
  };

  handleDeleteInvite = item => {
    const { t, dispatch } = this.props;
    dispatch(
      confirmAlert(
        t('areYouSureDelete', { name: item.name }),
        t('deleteCannotBeUndone'),
        async () => {
          await dispatch(deleteJourneyInvite(item.id));
          this.load();
        },
      ),
    );
  };

  renderAdventureCode = () => {
    const { t } = this.props;
    return (
      <Flex justify="center">
        <Button
          text={t('haveCode')}
          isLoading={this.state.isLoading}
          style={[st.w(st.fullWidth - 40), st.aic, st.mv5, st.asc]}
          buttonTextStyle={[st.tac]}
          onPress={this.handleAdventureCode}
        />
      </Flex>
    );
  };

  renderNull = () => {
    const { t, me } = this.props;
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
              {t('welcomeToAdventures', { name: me.first_name })}
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
  language: auth.language,
  myJourneys: journeys.mine,
  invites: journeys.invites,
});

export default translate('adventuresTab')(
  connect(mapStateToProps)(AdventuresMine),
);
