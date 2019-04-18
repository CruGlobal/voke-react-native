import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import {
  FlatList,
  RefreshControl,
  Flex,
  Button,
} from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj } from '../../utils/common';
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
      console.log('error getting org journeys');
    } finally {
      this.setState({ refreshing: false });
    }
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
    dispatch(navigatePush('voke.ShareEnterName', { item }));
  };

  handleAdventureCode = () => {
    // todo
    this.props.dispatch(navigatePush('voke.AdventureCode'));
  };

  renderRow = ({ item }) => {
    const { myJourneyOrgIds } = this.props;
    const startedWithMe = myJourneyOrgIds.find(id => id === item.id);
    return (
      <OrgJourney
        onPress={this.select}
        item={item}
        onInviteFriend={
          startedWithMe ? () => this.inviteFriend(item) : undefined
        }
      />
    );
  };

  renderHeader = () => {
    const { t } = this.props;
    return (
      <Flex justify="center" align="center">
        <Button
          text={t('haveCode')}
          style={[st.w(st.fullWidth - 40), st.aic, st.mv5, st.asc]}
          buttonTextStyle={[st.tac]}
          onPress={this.handleAdventureCode}
        />
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
        keyExtractor={item => item.id}
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

const mapStateToProps = ({ auth, journeys }) => ({
  me: auth.user,
  myJourneyOrgIds: (journeys.mine || []).map(j => j.organization_journey_id),
  items: journeys.org,
});

export default translate('adventuresTab')(
  connect(mapStateToProps)(AdventuresFind),
);
