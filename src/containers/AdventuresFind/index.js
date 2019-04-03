import React, { Component } from 'react';
import { Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { RefreshControl, Flex, Button } from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj } from '../../utils/common';
import VOKE_LINK from '../../../images/vokebot_whole.png';
import { VIDEO_CONTENT_TYPES } from '../VideoContentWrap';

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

  handleAdventureCode = () => {
    // todo
    this.props.dispatch(navigatePush('voke.AdventureCode'));
  };

  renderRow = ({ item }) => {
    return <OrgJourney onPress={this.select} item={item} />;
  };

  renderHeader = () => {
    const { me } = this.props;
    return (
      <Flex justify="center" align="center">
        <Button
          text="I have an Adventure Code"
          isLoading={this.state.isLoading}
          style={styles.inviteCodeButton}
          buttonTextStyle={{ textAlign: 'center' }}
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
      />
    );
  }
}

const mapStateToProps = ({ auth, journeys }) => ({
  me: auth.user,
  items: journeys.org,
});

export default translate()(connect(mapStateToProps)(AdventuresFind));
