import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import i18n from '../../i18n';
import { Text, VokeIcon, Flex } from '../../components/common';
import { getMyJourneys, createMyJourney } from '../../actions/journeys';
import { startupAction } from '../../actions/auth';
import MyAdventuresList from '../../components/MyAdventuresList';

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
    return (
      <Flex value={1} align="center" justify="center" style={styles.container}>
        <VokeIcon name="adventure" size={90} />
        <Text style={styles.nullText}>
          Your Adventures will show up here once you start one!
        </Text>
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
