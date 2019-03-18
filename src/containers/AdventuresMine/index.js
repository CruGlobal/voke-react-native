import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import i18n from '../../i18n';
import { Text, VokeIcon, Flex, Button } from '../../components/common';
import { getMyJourneys, createMyJourney } from '../../actions/journeys';
import { startupAction } from '../../actions/auth';
import MyAdventuresList from '../../components/MyAdventuresList';
import VOKE_LINK from '../../../images/vokebot_whole.png';

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

  renderNull = () => {
    const { me } = this.props;
    return (
      <Flex value={1} align="center" justify="center" style={styles.container}>
        <Flex
          value={1}
          align="center"
          direction="row"
          style={styles.vokebotWrap}
        >
          <Image
            resizeMode="contain"
            source={VOKE_LINK}
            style={styles.vokebot}
          />
          <Flex style={styles.chatTriangle} />
          <Flex value={1} style={styles.chatBubble}>
            <Text style={styles.chatText}>
              Hi{me.first_name ? ` ${me.first_name}` : ''}, welcome to Voke!
              Once you find an Adventure to start it will show up on this
              screen!
            </Text>
          </Flex>
        </Flex>
        <Flex
          align="center"
          justify="start"
          value={3}
          style={{ marginTop: 20 }}
        >
          <Flex value={1} align="center">
            <VokeIcon name="adventure" size={140} />
            <Text style={styles.nullText}>
              Click below to explore the Adventures
            </Text>
          </Flex>
          <Flex value={1}>
            <Button
              text="Browse Adventures"
              style={styles.browseButton}
              buttonTextStyle={styles.browseText}
              onPress={() => {}}
            />
          </Flex>
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
            onSelect={() => {}}
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
