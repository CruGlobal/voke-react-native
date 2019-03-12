import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { RefreshControl } from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj } from '../../utils/common';

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
        type: 'orgJourney',
        trackingObj: buildTrackingObj('journey', 'detail'),
      }),
    );
  };

  renderRow = ({ item }) => {
    return <OrgJourney onPress={this.select} item={item} />;
  };

  render() {
    const { items } = this.props;
    const { refreshing } = this.state;
    return (
      <FlatList
        data={items}
        renderItem={this.renderRow}
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
