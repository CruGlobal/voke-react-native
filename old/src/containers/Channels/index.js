import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import {
  getAllOrganizations,
  getMyOrganizations,
  getFeaturedOrganizations,
} from '../../actions/channels';
import Analytics from '../../utils/analytics';
import { navigatePush } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import ChannelsList from '../../components/ChannelsList';
import StatusBar from '../../components/StatusBar';
import {
  View,
  ScrollView,
  Flex,
  Text,
  RefreshControl,
} from '../../components/common';
import theme from '../../theme';
import { buildTrackingObj } from '../../utils/common';

class Channels extends Component {
  state = { refreshing: false, loadingMore: false };

  componentDidMount() {
    Analytics.screen(Analytics.s.ChannelsTab);

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

  dispatchLoadMore = action => {
    this.setState({ loadingMore: true });
    this.props
      .dispatch(action)
      .then(() => {
        this.setState({ loadingMore: false });
      })
      .catch(() => {
        this.setState({ loadingMore: false });
      });
  };

  handleNextPage = filter => {
    const pagination = this.props.pagination;
    if (!pagination[filter] || !pagination[filter].hasMore) {
      return;
    }
    const page = pagination[filter].page + 1;
    const query = { page };
    if (filter === 'featured') {
      this.dispatchLoadMore(getFeaturedOrganizations(query));
    } else if (filter === 'myChannels') {
      this.dispatchLoadMore(getMyOrganizations(query));
    } else if (filter === 'all') {
      this.dispatchLoadMore(getAllOrganizations(query));
    }
  };

  render() {
    const {
      t,
      dispatch,
      allChannels,
      myChannels,
      featuredChannels,
      pagination,
    } = this.props;
    const { loadingMore } = this.state;

    return (
      <View style={styles.container}>
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
              dispatch(
                navigatePush('voke.VideosTab', {
                  trackingObj: buildTrackingObj('channel', 'preview', 'all'),
                  channel: c,
                }),
              );
            }}
            onLoadMore={() => this.handleNextPage('myChannels')}
            hasMore={
              pagination['myChannels'] && pagination['myChannels'].hasMore
            }
            isLoading={loadingMore}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>{t('featured').toUpperCase()}</Text>
          <ChannelsList
            items={featuredChannels}
            onSelect={c => {
              dispatch(
                navigatePush('voke.VideosTab', {
                  trackingObj: buildTrackingObj('channel', 'preview', 'all'),
                  channel: c,
                }),
              );
            }}
            onLoadMore={() => this.handleNextPage('featured')}
            hasMore={pagination['featured'] && pagination['featured'].hasMore}
            isLoading={loadingMore}
          />
          <Flex self="stretch" style={styles.separator} />
          <Text style={styles.title}>{t('browse').toUpperCase()}</Text>
          <ChannelsList
            items={allChannels}
            onSelect={c => {
              dispatch(
                navigatePush('voke.VideosTab', {
                  trackingObj: buildTrackingObj('channel', 'preview', 'all'),
                  channel: c,
                }),
              );
            }}
            onLoadMore={() => this.handleNextPage('all')}
            hasMore={pagination['all'] && pagination['all'].hasMore}
            isLoading={loadingMore}
          />
          <Flex self="stretch" style={styles.separator} />
        </ScrollView>
        <ApiLoading showMS={15000} />
      </View>
    );
  }
}

Channels.propTypes = {};

const mapStateToProps = ({ auth, channels }) => ({
  user: auth.user,
  allChannels: channels.all,
  featuredChannels: channels.featured,
  myChannels: channels.myChannels,
  pagination: channels.pagination,
  isAnonUser: auth.isAnonUser,
});

export default translate('channels')(connect(mapStateToProps)(Channels));
