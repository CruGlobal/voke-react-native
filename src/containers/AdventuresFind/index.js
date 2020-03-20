import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import {
  FlatList,
  RefreshControl,
  Flex,
  Button,
  Touchable,
  Text,
  VokeIcon,
} from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj, keyExtractorId } from '../../utils/common';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';

import st from '../../st';

class AdventuresFind extends Component {
  state = { refreshing: false };

  componentDidMount() {
    this.getJourneys();
  }

  getJourneys() {
    const { dispatch } = this.props;
    dispatch(getOrgJourneys());
  }

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    try {
      await this.getJourneys();
    } catch (e) {
      // LOG('error getting org journeys');
    } finally {
      this.setState({ refreshing: false });
    }
  };

  group = async () => {
    const { dispatch, items } = this.props;
    const item = items.find(i => i.name === 'The Faith Adventure');
    try {
      dispatch(navigatePush('voke.ShareEnterName', { item, isGroup: true }));
    } catch {}
  };

  select = item => {
    this.props.dispatch(
      navigatePush('voke.VideoContentWrap', {
        item,
        type: VIDEO_CONTENT_TYPES.ORGJOURNEY,
        trackingObj: buildTrackingObj('journey', 'detail'),
      }),
    );
  };

  inviteFriend = item => {
    const { dispatch } = this.props;
    if (!item) return;
    dispatch(navigatePush('voke.ShareEnterName', { item }));
  };

  handleAdventureCode = () => {
    this.props.dispatch(
      navigatePush('voke.AdventureCode', { autoShowKeyboard: true }),
    );
  };

  renderRow = ({ item }) => {
    const { myJourneyOrgIds } = this.props;
    item = item || {};
    const startedWithMe = myJourneyOrgIds.find(id => id === item.id);
    return (
      <OrgJourney
        onPress={this.select}
        item={item}
        onInviteFriend={
          startedWithMe ? () => this.inviteFriend(item) : undefined
        }
        onInviteFriendFirstTime={
          startedWithMe ? undefined : () => this.inviteFriend(item)
        }
      />
    );
  };

  renderHeader = () => {
    const { t } = this.props;
    return (
      <Flex direction="column" align="center" justify="center" self="stretch">
        <Touchable
          style={[
            st.bgWhite,
            st.p4,
            st.br5,
            st.mv6,
            st.mt5,
            { width: st.fullWidth - 30 },
          ]}
          onPress={this.handleAdventureCode}
        >
          <Flex direction="column" align="center" justify="center">
            <Text style={[st.darkBlue, st.fs18]}>Enter an Adventure Code</Text>
            <Text style={[st.fs14, st.grey]}>Did someone send you a code?</Text>
          </Flex>
        </Touchable>
        <Touchable
          style={[
            st.bgWhite,
            st.p4,
            st.br5,
            st.mv6,
            { width: st.fullWidth - 30 },
          ]}
          onPress={this.group}
        >
          <Flex
            direction="row"
            align="center"
            justify="between"
            style={[st.ph4]}
          >
            <VokeIcon
              type="image"
              name="groupDark"
              style={[st.w(40), st.h(40)]}
            />
            <Flex direction="column" align="center" justify="center">
              <Text style={[st.darkBlue, st.fs18]}>Start a Group</Text>
              <Text style={[st.fs14, st.grey]}>
                Do The Faith Adventure together!
              </Text>
            </Flex>
            <VokeIcon
              type="image"
              name="buttonArrowDark"
              style={[st.w(20), st.h(20)]}
            />
          </Flex>
        </Touchable>
      </Flex>
    );
  };

  render() {
    const { items } = this.props;
    const { refreshing } = this.state;
    return (
      <FlatList
        data={items}
        renderItem={this.renderRow}
        ListHeaderComponent={this.renderHeader()}
        keyExtractor={keyExtractorId}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        removeClippedSubviews={false}
      />
    );
  }
}

const mapStateToProps = ({ auth, journeys }) => {
  if (
    !journeys ||
    !journeys.mine ||
    !journeys.org ||
    !Array.isArray(journeys.mine)
  ) {
    return {
      me: auth.user,
      myJourneyOrgIds: null,
      items: null,
    };
  } else {
    return {
      me: auth.user,
      myJourneyOrgIds: (journeys.mine || []).map(
        j => j.organization_journey_id,
      ),
      items: journeys.org,
    };
  }
};

export default translate('adventuresTab')(
  connect(mapStateToProps)(AdventuresFind),
);
