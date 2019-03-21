import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import i18n from '../../i18n';
import { Text, VokeIcon, Flex, Button } from '../../components/common';
import { getMyJourneys, createMyJourney } from '../../actions/journeys';
import { navigatePush } from '../../actions/nav';
import { startupAction } from '../../actions/auth';
import MyAdventuresList from '../../components/MyAdventuresList';
import VOKE_LINK from '../../../images/vokebot_whole.png';
import { buildTrackingObj } from '../../utils/common';

class AdventuresMine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    const { me, dispatch } = this.props;
    this.props.dispatch(getMyJourneys());
    if (me && me.language && me.language.language_code) {
      i18n.changeLanguage(me.language.language_code.toLowerCase());
    }

    this.startupTimeout = setTimeout(() => {
      dispatch(startupAction());
    }, 50);
  }

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

  handleRefresh() {
    // todo
  }

  handleAdventureCode = () => {
    // todo
    this.props.dispatch(navigatePush('voke.AdventureCode'));
  };

  handleSelect = item => {
    const { dispatch } = this.props;
    dispatch(
      navigatePush('voke.VideoContentWrap', {
        item,
        type: 'journeyDetail',
        trackingObj: buildTrackingObj('journey : mine', 'detail'),
      }),
    );
  };

  renderNull = () => {
    const { me } = this.props;
    return (
      <Flex value={1} align="center" justify="end" direction="column">
        <Flex justify="center">
          <Button
            text="I have an Adventure Code"
            isLoading={this.state.isLoading}
            style={styles.inviteCodeButton}
            buttonTextStyle={{ textAlign: 'center' }}
            onPress={this.handleAdventureCode}
          />
        </Flex>
        <Flex
          value={1}
          align="center"
          justify="end"
          direction="column"
          style={styles.vokebotWrap}
        >
          <Flex style={styles.chatTriangle} />
          <Flex style={styles.chatBubble}>
            <Text style={styles.chatText}>
              Welcome{me.first_name ? ` ${me.first_name}` : ''}! This is where
              you will find all of your adventures with your friends.
            </Text>
          </Flex>
          <Image
            resizeMode="contain"
            source={VOKE_LINK}
            style={styles.vokebot}
          />
        </Flex>
      </Flex>
    );
  };

  render() {
    const { isLoading } = this.state;
    return (
      <View style={styles.container}>
        {this.props.myJourneys < 1 ? (
          this.renderNull()
        ) : (
          <MyAdventuresList
            items={this.props.myJourneys}
            onSelect={this.handleSelect}
            onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
            isLoading={isLoading}
          />
        )}
      </View>
    );
  }
}

const mapStateToProps = ({ auth, journeys }) => ({
  me: auth.user,
  myJourneys: journeys.mine,
});

export default translate()(connect(mapStateToProps)(AdventuresMine));
