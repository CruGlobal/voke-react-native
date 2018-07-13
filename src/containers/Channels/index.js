import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  getAllOrganizations,
  getMyOrganizations,
  getFeaturedOrganizations,
} from '../../actions/channels';
import Analytics from '../../utils/analytics';
import nav, { NavPropTypes } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import { vokeIcons } from '../../utils/iconMap';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import ChannelsList from '../../components/ChannelsList';
import StatusBar from '../../components/StatusBar';
import { Flex, Text, RefreshControl } from '../../components/common';
import theme from '../../theme';

class Channels extends Component {
  state = { refreshing: false };

  componentDidMount() {
    Analytics.screen(Analytics.s.ChannelsTab);

    LOG(
      'channels',
      this.props.myChannels,
      this.props.featuredChannels,
      this.props.allChannels,
    );
    if (this.props.allChannels.length > 0) {
      return;
    }
    this.handleRefreshAll();
  }

  handleRefreshAll = () => {
    this.props.dispatch(getAllOrganizations());
    this.props.dispatch(getMyOrganizations());
    this.props.dispatch(getFeaturedOrganizations());
  };

  handleNextPage = filter => {
    const pagination = this.props.pagination;
    if (!pagination[filter] || !pagination[filter].hasMore) {
      return;
    }
    const page = pagination[filter].page + 1;
    const query = { page };

    if (filter === 'featured') {
      this.props.dispatch(getFeaturedOrganizations(query));
    } else if (filter === 'myChannels') {
      this.props.dispatch(getMyOrganizations(query));
    } else if (filter === 'all') {
      this.props.dispatch(getAllOrganizations(query));
    }
  };

  render() {
    const {
      t,
      navigatePush,
      allChannels,
      myChannels,
      featuredChannels,
    } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? (
              undefined
            ) : (
              <HeaderIcon
                image={vokeIcons['menu']}
                onPress={() => navigatePush('voke.Menu')}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu actions={navMenuOptions(this.props)} />
            ) : null
          }
          title={t('title.channels')}
        />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefreshAll}
            />
          }
        >
          <Text style={styles.title}>{t('myChannels').toUpperCase()}</Text>
          <ChannelsList
            items={myChannels}
            onSelect={c => {
              navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('myChannels')}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>{t('featured').toUpperCase()}</Text>
          <ChannelsList
            items={featuredChannels}
            onSelect={c => {
              navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('featured')}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>{t('browse').toUpperCase()}</Text>
          <ChannelsList
            items={allChannels}
            onSelect={c => {
              navigatePush('voke.VideosTab', {
                channel: c,
              });
            }}
            onLoadMore={() => this.handleNextPage('all')}
          />
          <Flex self="stretch" style={styles.separator} />
        </ScrollView>
        <ApiLoading />
      </View>
    );
  }
}

Channels.propTypes = {
  ...NavPropTypes,
};

const mapStateToProps = ({ auth, channels }) => ({
  user: auth.user,
  allChannels: channels.all,
  featuredChannels: channels.featured,
  myChannels: channels.myChannels,
  pagination: channels.pagination,
  isAnonUser: auth.isAnonUser,
});

export default translate('channels')(
  connect(
    mapStateToProps,
    nav,
  )(Channels),
);
