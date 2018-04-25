import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getVideos, getFeaturedVideos, getPopularVideos, getTags, getSelectedThemeVideos, getFavorites, clearChannelVideos } from '../../actions/videos';
// import { getMe } from '../../actions/auth';
import { getChannel, getChannelSubscriberData, subscribeChannel, unsubscribeChannel } from '../../actions/channels';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/nav';

import styles from './styles';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import ThemeSelect from '../ThemeSelect';
import VokeOverlays from '../VokeOverlays';
import Header, { HeaderIcon } from '../Header';
import PillButton from '../../components/PillButton';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';
import ChannelInfo from '../../components/ChannelInfo';
import { Flex } from '../../components/common';
import theme from '../../theme';

class Videos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedFilter: 'all',
      previousFilter: '',
      videos: [],
      selectedTag: null,
      channelSubscribeData: {
        id: '',
        isSubscribed: false,
        total: 0,
      },
    };

    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.updateVideoList = this.updateVideoList.bind(this);
    this.showThemes = this.showThemes.bind(this);
    this.handleThemeSelect = this.handleThemeSelect.bind(this);
    this.handleDismissTheme = this.handleDismissTheme.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleUnsubscribe = this.handleUnsubscribe.bind(this);
  }

  componentDidMount() {
    // this.props.dispatch(getMe()).then((results)=>{
    //   LOG(results);
    // });
    if (this.props.channel && this.props.channel.id) {
      this.props.dispatch(getVideos(undefined, this.props.channel.id)).then(() => {
        this.updateVideoList('all');
      });
      this.getSubscriberData();
      this.setState({ videos: this.props.channelVideos });
    } else if (this.props.all.length === 0) {
      // If there are no videos when the component mounts, get them, otherwise just set it
      this.props.dispatch(getVideos()).then(() => {
        this.updateVideoList('all');
      }).catch((err)=> {
        LOG(JSON.stringify(err));
        if (err.error === 'Messenger not configured') {
          setTimeout(() =>{
            this.props.dispatch(getVideos()).then(() => {
              this.updateVideoList('all');
            }).catch((err)=> {
              LOG(JSON.stringify(err));
              if (err.error === 'Messenger not configured') {
                if (this.props.user.first_name) {
                  this.props.navigateResetToNumber();
                } else {
                  this.props.navigateResetToProfile();
                }
              }
            });
          }, 3000);
        }
      });
    } else {
      this.setState({ videos: this.props.all });
    }

    Analytics.screen('Videos');
  }

  componentWillUnmount() {
    this.props.dispatch(clearChannelVideos());
  }

  handleRefresh() {
    if (this.state.selectedFilter === 'themes') {
      return Promise.resolve();
    }
    this.setState({ emptyRefreshing: true });
    return this.handleFilter(this.state.selectedFilter);
  }

  handleThemeSelect(tag) {
    this.setState({ selectedTag: tag });
    const channelId = this.props.channel ? this.props.channel.id : undefined;
    this.props.dispatch(getSelectedThemeVideos(tag, 1, channelId)).then(() => {
      this.setState({ videos: this.props.selectedThemeVideos});
      // Scroll to the top after selecting a theme
      this.videoList.scrollToBeginning();
    });
  }

  handleDismissTheme() {
    const shouldntScroll = true;
    if (this.state.previousFilter === 'themes') {
      this.handleFilter('all', shouldntScroll);
    } else {
      this.handleFilter(this.state.previousFilter, shouldntScroll);
    }
  }

  showThemes() {
    this.setState({ selectedTag: null, showThemeModal: true });
  }

  handleNextPage() {
    const pagination = this.props.pagination;
    const filter = this.state.selectedFilter;

    let page;
    let query = {};
    // Custom logic for channel pagination
    const channelId = this.props.channel ? this.props.channel.id : undefined;
    if (channelId) {
      // If there is a new filter for channel pagination, do nothing
      if (pagination.channel.type !== filter || !pagination.channel.hasMore) {
        return;
      }
      page = pagination.channel.page + 1;
      query.page = page;
    } else {
      if (!pagination[filter] || !pagination[filter].hasMore) {
        return;
      }
      page = pagination[filter].page + 1;
      query.page = page;
    }

    
    // LOG('next page', filter, pagination[filter]);
    
    


    if (filter === 'featured') {
      this.props.dispatch(getFeaturedVideos(query, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'popular') {
      this.props.dispatch(getPopularVideos(query, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'all') {
      this.props.dispatch(getVideos(query, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'favorites') {
      this.props.dispatch(getFavorites(query, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'themes') {
      if (this.state.videos.length === 0 || !this.state.selectedTag) {
        return;
      }
      this.props.dispatch(getSelectedThemeVideos(this.state.selectedTag, page, channelId)).then(() => {
        this.setState({ videos: this.props.selectedThemeVideos });
      });
    }
  }

  // This method should return a Promise so that it can handle refreshing correctly
  handleFilter(filter, shouldntScroll) {
    if (filter === 'themes') {
      // Prevent getting into the state of both previous and selected filter being 'themes'
      this.setState({
        previousFilter: this.state.selectedFilter === 'themes' ? 'all' : this.state.selectedFilter,
        selectedFilter: filter,
      });
    } else {
      this.setState({ selectedFilter: filter });
      if (!shouldntScroll) {
        this.videoList.scrollToBeginning();
      }
    }
    const channelId = this.props.channel ? this.props.channel.id : undefined;

    if (filter === 'featured') {
      return this.props.dispatch(getFeaturedVideos(undefined, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'popular') {
      return this.props.dispatch(getPopularVideos(undefined, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'all') {
      return this.props.dispatch(getVideos(undefined, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'themes') {
      return this.props.dispatch(getTags()).then((r) => {
        this.showThemes();
        return r;
      });
    } else if (filter === 'favorites') {
      return this.props.dispatch(getFavorites(undefined, channelId)).then((r) => {
        this.updateVideoList(filter);
        return r;
      });
    }
    return Promise.resolve();
  }

  updateVideoList(type) {
    if (this.props.channel && this.props.channel.id) {
      this.setState({ videos: this.props.channelVideos });
      return;
    }
    if (type === 'featured') {
      this.setState({ videos: this.props.featured });
    } else if (type === 'all') {
      this.setState({ videos: this.props.all });
    } else if (type === 'popular') {
      this.setState({ videos: this.props.popular });
    } else if (type === 'favorites') {
      this.setState({ videos: this.props.favorites });
    }
  }

  getSubscriberData() {
    // TODO: Get my subscription info for a channel
    this.props.dispatch(getChannel(this.props.channel.id)).then((channelResults) => {
      this.props.dispatch(getChannelSubscriberData(this.props.channel.id)).then((results) => {
        const subscriberId = channelResults.subscription_id;
        const isSubscribed = !!subscriberId;
        // Get the total from the 'total_subscriptions' field in one of the items
        let total = results && results.subscriptions && results.subscriptions[0] && results.subscriptions[0].total_subscriptions;
        if (!total) {
          total = results && results._links && results._links.root ? results._links.root.total_count : 0;
        }
        if (!total) {
          total = total || 0;
        }
        
        
        this.setState({
          channelSubscribeData: {
            id: subscriberId,
            isSubscribed,
            total,
          },
        });
      });
    });
  }
  
  handleSubscribe() {
    this.props.dispatch(subscribeChannel(this.props.channel.id)).then((results) => {
      this.setState({
        channelSubscribeData: {
          id: results.id,
          isSubscribed: true,
          total: this.state.channelSubscribeData.total + 1,
        },
      });
    });
  }
  
  handleUnsubscribe() {
    const subscriptionId = this.state.channelSubscribeData.id;
    this.props.dispatch(unsubscribeChannel(this.props.channel.id, subscriptionId)).then(() => {
      this.setState({
        channelSubscribeData: {
          id: '',
          isSubscribed: false,
          total: this.state.channelSubscribeData.total - 1,
        },
      });
    });
  }

  renderChannel() {
    const { channel } = this.props;
    if (!channel) return null;
    return (
      <ChannelInfo
        channel={channel}
        subscribeData={this.state.channelSubscribeData}
        onSubscribe={this.handleSubscribe}
        onUnsubscribe={this.handleUnsubscribe}
      />
    );
  }

  renderHeaderLeft() {
    const { onSelectVideo, channel } = this.props;
    const showBack = !!onSelectVideo || !!channel;
    if (theme.isAndroid && !showBack) {
      return null;
    } else if (theme.isAndroid && showBack) {
      return (
        <HeaderIcon
          type="back"
          onPress={() => this.props.navigateBack()} />
      );
    }
    return (
      <HeaderIcon
        type={showBack ? 'back' : undefined}
        image={vokeIcons['menu']}
        onPress={() => {
          if (showBack) {
            this.props.navigateBack();
          } else {
            this.props.navigatePush('voke.Menu');
          }
        }} />
    );
  }

  render() {
    const { onSelectVideo } = this.props;
    const { selectedFilter, videos } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={this.renderHeaderLeft()}
          right={
            <HeaderIcon
              type="search"
              onPress={() => this.handleFilter('themes')} />
          }
          title="Videos"
        />
        {this.renderChannel()}
        <Flex style={{height: 50}} align="center" justify="center">
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <Flex direction="row" style={{padding: 10}}>
              <PillButton
                text="All"
                filled={selectedFilter === 'all'}
                onPress={() => this.handleFilter('all')}
                animation="slideInUp"
              />
              <PillButton
                text="Featured"
                filled={selectedFilter === 'featured'}
                onPress={() => this.handleFilter('featured')}
                animation="slideInUp"
              />
              <PillButton
                text="Popular"
                filled={selectedFilter === 'popular'}
                onPress={() => this.handleFilter('popular')}
                animation="slideInUp"
              />
              <PillButton
                icon="favorite-border"
                style={{ alignItems: 'center' }}
                filled={selectedFilter === 'favorites'}
                onPress={() => this.handleFilter('favorites')}
                animation="slideInUp"
              />
            </Flex>
          </ScrollView>
        </Flex>
        <VideoList
          ref={(c) => this.videoList = c}
          items={videos}
          onSelect={(c) => {
            this.props.navigatePush('voke.VideoDetails', {
              video: c,
              onSelectVideo,
              conversation: this.props.conversation,
              onUpdateVideos: () => this.updateVideoList(selectedFilter),
            });
          }}
          onRefresh={this.handleRefresh}
          onLoadMore={this.handleNextPage}
        />
        <ApiLoading />
        {
          this.state.showThemeModal ? (
            <ThemeSelect
              onClose={() => this.setState({ showThemeModal: false })}
              themes={this.props.tags}
              onSelect={this.handleThemeSelect}
              onDismiss={this.handleDismissTheme}
            />
          ) : null
        }
        <VokeOverlays type="tryItNowIntro" />
      </View>
    );
  }
}

Videos.propTypes = {
  ...NavPropTypes,
  channel: PropTypes.object,
  onSelectVideo: PropTypes.func,
  conversation: PropTypes.object,
};

const mapStateToProps = ({ auth, videos }) => ({
  all: videos.all,
  user: auth.user,
  popular: videos.popular,
  featured: videos.featured,
  favorites: videos.favorites,
  tags: videos.tags,
  selectedThemeVideos: videos.selectedThemeVideos,
  channelVideos: videos.channelVideos,
  pagination: videos.pagination,
});

export default connect(mapStateToProps, nav)(Videos);
