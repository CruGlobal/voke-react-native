import React, { Component } from 'react';
import { Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { RefreshControl, Flex, Text } from '../../components/common';
import { getOrgJourneys } from '../../actions/journeys';
import OrgJourney from '../../components/OrgJourney';
import { navigatePush } from '../../actions/nav';
import { buildTrackingObj } from '../../utils/common';
import VOKE_LINK from '../../../images/vokebot_whole.png';

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

  renderHeader = () => {
    const { me } = this.props;
    return (
      <Flex align="center" direction="row" style={styles.vokebotWrap}>
        <Image resizeMode="contain" source={VOKE_LINK} style={styles.vokebot} />
        <Flex style={styles.chatTriangle} />
        <Flex value={1} style={styles.chatBubble}>
          <Text style={styles.chatText}>
            Hi{me.first_name ? ` ${me.first_name}` : ''}, welcome to Voke!
            Browse for an Adventure that you want to start, then head on over to
            My Adventures to manage it!
          </Text>
        </Flex>
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
