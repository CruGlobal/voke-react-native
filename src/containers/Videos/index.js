import React, { Component } from 'react';
import { Alert, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';

import {
  getVideos,
  getFeaturedVideos,
  getPopularVideos,
  getTags,
  getSelectedThemeVideos,
  getFavorites,
  clearChannelVideos,
} from '../../actions/videos';
// import { getMe } from '../../actions/auth';
import {
  getChannel,
  getChannelSubscriberData,
  subscribeChannel,
  unsubscribeChannel,
} from '../../actions/channels';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/nav';
import { startupAction } from '../../actions/auth';

import styles from './styles';
import { vokeIcons } from '../../utils/iconMap';

import ApiLoading from '../ApiLoading';
import ThemeSelect from '../ThemeSelect';
import Header, { HeaderIcon } from '../Header';
import PillButton from '../../components/PillButton';
import VideoList from '../../components/VideoList';
import StatusBar from '../../components/StatusBar';
import ChannelInfo from '../../components/ChannelInfo';
import { Flex } from '../../components/common';
import theme from '../../theme';
import { momentUtc, buildTrackingObj } from '../../utils/common';
import { trackState } from '../../actions/analytics';

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
      isLoading: false,
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
    const {
      onSelectVideo,
      channel,
      dispatch,
      channelVideos,
      all,
      navigateResetToNumber,
      navigateResetToProfile,
      user,
      isAnonUser,
    } = this.props;

    this.startupTimeout = setTimeout(() => {
      dispatch(startupAction());
    }, 50);

    // When the user first does "Try it Now", their user is not set up, but they ARE an anon user
    // Check if the user is new within the past few days
    const isNewUser =
      (!user.id && isAnonUser) ||
      momentUtc(user.created_at) > moment().subtract(2, 'days');

    if (channel && channel.id) {
      this.setState({ isLoading: true });
      dispatch(getVideos(undefined, channel.id))
        .then(() => {
          dispatch(trackState(buildTrackingObj('video', 'all')));
          this.updateVideoList('all');
          this.setState({ isLoading: false });
        })
        .catch(() => {
          this.setState({ isLoading: false });
        });
      this.getSubscriberData();
      this.setState({ videos: channelVideos });
    } else if (onSelectVideo) {
      this.handleFilter('all', true);
    } else if (isNewUser) {
      this.handleFilter('popular', true);
    } else {
      // Always make an API call when the videos tab mounts
      // Show existing videos if they're there
      if (all.length > 0) {
        this.setState({ videos: all });
      }
      // If there are no videos when the component mounts, get them, otherwise just set it
      dispatch(getVideos())
        .then(() => {
          dispatch(trackState(buildTrackingObj('video', 'all')));
          this.updateVideoList('all');
        })
        .catch(err => {
          LOG(JSON.stringify(err));
          if (err.error === 'Messenger not configured') {
            setTimeout(() => {
              dispatch(getVideos())
                .then(() => {
                  dispatch(trackState(buildTrackingObj('video', 'all')));
                  this.updateVideoList('all');
                })
                .catch(err => {
                  LOG(JSON.stringify(err));
                  if (err.error === 'Messenger not configured') {
                    if (user.first_name) {
                      navigateResetToNumber();
                    } else {
                      navigateResetToProfile();
                    }
                  }
                });
            }, 3000);
          }
        });
    }

    // TODO: Handle filter

    if (onSelectVideo) {
      Analytics.screen(Analytics.s.VideosMessage);
    } else if (channel && channel.id) {
      Analytics.screen(Analytics.s.ChannelsPage);
    } else {
      Analytics.screen(Analytics.s.VideosTab);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(clearChannelVideos());
  }

  handleRefresh() {
    if (this.state.selectedFilter === 'themes') {
      return Promise.resolve();
    }
    return this.handleFilter(this.state.selectedFilter, undefined, true);
  }

  handleThemeSelect(tag) {
    this.setState({ selectedTag: tag });
    const channelId = this.props.channel ? this.props.channel.id : undefined;
    this.props.dispatch(getSelectedThemeVideos(tag, 1, channelId)).then(() => {
      this.setState({ videos: this.props.selectedThemeVideos });
      // Scroll to the top after selecting a theme
      this.videoList &&
        this.videoList.getWrappedInstance &&
        this.videoList.getWrappedInstance().scrollToBeginning();
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

  closeThemeModal = () => {
    this.setState({ showThemeModal: false });
  };

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
      this.props.dispatch(getFeaturedVideos(query, channelId)).then(r => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'popular') {
      this.props.dispatch(getPopularVideos(query, channelId)).then(r => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'all') {
      this.props.dispatch(getVideos(query, channelId)).then(r => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'favorites') {
      this.props.dispatch(getFavorites(query, channelId)).then(r => {
        this.updateVideoList(filter);
        return r;
      });
    } else if (filter === 'themes') {
      if (this.state.videos.length === 0 || !this.state.selectedTag) {
        return;
      }
      this.props
        .dispatch(
          getSelectedThemeVideos(this.state.selectedTag, page, channelId),
        )
        .then(() => {
          this.setState({ videos: this.props.selectedThemeVideos });
        });
    }
  }

  // This method should return a Promise so that it can handle refreshing correctly
  handleFilter(filter, shouldntScroll, isRefreshing) {
    const { dispatch, channel, onSelectVideo } = this.props;
    const { selectedFilter, videos } = this.state;
    if (filter === 'themes') {
      // Prevent getting into the state of both previous and selected filter being 'themes'
      this.setState({
        previousFilter: selectedFilter === 'themes' ? 'all' : selectedFilter,
        selectedFilter: filter,
      });
    } else {
      this.setState({ selectedFilter: filter });
      if (!shouldntScroll) {
        this.videoList &&
          this.videoList.getWrappedInstance &&
          this.videoList.getWrappedInstance().scrollToBeginning();
      }
    }
    const channelId = channel ? channel.id : undefined;
    this.setState({
      isLoading: isRefreshing ? false : true,
      videos: isRefreshing ? videos : [],
    });

    // Track the channel or video page state
    if (channelId) {
      dispatch(trackState(buildTrackingObj('channel', 'preview', filter)));
    } else if (onSelectVideo) {
      dispatch(trackState(buildTrackingObj('chat', 'addvideo', filter)));
    } else {
      dispatch(trackState(buildTrackingObj('video', filter)));
    }

    if (filter === 'featured') {
      return dispatch(getFeaturedVideos(undefined, channelId))
        .then(r => {
          this.setState({ isLoading: false });
          this.updateVideoList(filter);
          return r;
        })
        .catch(() => this.setState({ isLoading: false }));
    } else if (filter === 'popular') {
      return dispatch(getPopularVideos(undefined, channelId))
        .then(r => {
          this.setState({ isLoading: false });
          this.updateVideoList(filter);
          return r;
        })
        .catch(() => this.setState({ isLoading: false }));
    } else if (filter === 'all') {
      return dispatch(getVideos(undefined, channelId))
        .then(r => {
          this.setState({ isLoading: false });
          this.updateVideoList(filter);
          return r;
        })
        .catch(() => this.setState({ isLoading: false }));
    } else if (filter === 'themes') {
      return dispatch(getTags())
        .then(r => {
          this.setState({ isLoading: false });
          this.showThemes();
          return r;
        })
        .catch(() => this.setState({ isLoading: false }));
    } else if (filter === 'favorites') {
      return dispatch(getFavorites(undefined, channelId))
        .then(r => {
          this.setState({ isLoading: false });
          this.updateVideoList(filter);
          return r;
        })
        .catch(() => this.setState({ isLoading: false }));
    } else {
      this.setState({ isLoading: false });
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

    this.videoList &&
      this.videoList.getWrappedInstance &&
      this.videoList.getWrappedInstance().scrollToBeginning(false);
  }

  getSubscriberData() {
    this.props
      .dispatch(getChannel(this.props.channel.id))
      .then(channelResults => {
        this.props
          .dispatch(getChannelSubscriberData(this.props.channel.id))
          .then(results => {
            const subscriberId = channelResults.subscription_id;
            const isSubscribed = !!subscriberId;
            // Get the total from the 'total_subscriptions' field in one of the items
            let total =
              results &&
              results.subscriptions &&
              results.subscriptions[0] &&
              results.subscriptions[0].total_subscriptions;
            if (!total) {
              total =
                results && results._links && results._links.root
                  ? results._links.root.total_count
                  : 0;
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
    this.props
      .dispatch(subscribeChannel(this.props.channel))
      .then(results => {
        this.setState({
          channelSubscribeData: {
            id: results.id,
            isSubscribed: true,
            total: this.state.channelSubscribeData.total + 1,
          },
        });
      })
      .catch(() => {
        LOG('did not subscribe');
      });
  }

  handleUnsubscribe() {
    const subscriptionId = this.state.channelSubscribeData.id;
    this.props
      .dispatch(unsubscribeChannel(this.props.channel.id, subscriptionId))
      .then(() => {
        this.setState({
          channelSubscribeData: {
            id: '',
            isSubscribed: false,
            total: this.state.channelSubscribeData.total - 1,
          },
        });
      })
      .catch(() => {
        LOG('did not unsubscribe');
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
        <HeaderIcon type="back" onPress={() => this.props.navigateBack()} />
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
        }}
      />
    );
  }

  handleShareVideo = video => {
    const {
      t,
      onSelectVideo,
      conversation,
      navigateBack,
      user,
      navigatePush,
      navigateResetMessage,
    } = this.props;
    // This logic exists in the VideoDetails and the VideoList
    if (onSelectVideo) {
      Alert.alert(
        t('addToChat'),
        t('areYouSureAdd', {
          name: video.name.substr(0, 25).trim(),
        }),
        [
          { text: t('cancel') },
          {
            text: t('add'),
            onPress: () => {
              onSelectVideo(video.id);
              // Navigate back after selecting the video
              if (conversation) {
                navigateResetMessage({
                  conversation: conversation,
                });
              } else {
                navigateBack();
              }
            },
          },
        ],
      );
    } else {
      if (!user.first_name) {
        navigatePush('voke.TryItNowName', {
          onComplete: () =>
            navigatePush('voke.ShareFlow', {
              video: video,
            }),
        });
      } else {
        navigatePush('voke.ShareFlow', {
          video: video,
        });
      }
    }
  };

  render() {
    const {
      t,
      onSelectVideo,
      navigatePush,
      conversation,
      tags,
      channel,
    } = this.props;
    const { selectedFilter, videos } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <StatusBar hidden={false} />
          <Header
            left={this.renderHeaderLeft()}
            right={
              <HeaderIcon
                type="search"
                onPress={() => this.handleFilter('themes')}
              />
            }
            title={t('title.videos')}
          />
          {this.renderChannel()}
          <Flex style={{ height: 50 }} align="center" justify="center">
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Flex direction="row" style={{ padding: 10 }}>
                <PillButton
                  text={t('all')}
                  filled={selectedFilter === 'all'}
                  onPress={() => this.handleFilter('all')}
                  animation="slideInUp"
                />
                <PillButton
                  text={t('featured')}
                  filled={selectedFilter === 'featured'}
                  onPress={() => this.handleFilter('featured')}
                  animation="slideInUp"
                />
                <PillButton
                  text={t('popular')}
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
            ref={c => (this.videoList = c)}
            items={videos}
            onSelect={c => {
              navigatePush('voke.VideoDetails', {
                video: c,
                onSelectVideo,
                conversation: conversation,
                onUpdateVideos: () => this.updateVideoList(selectedFilter),
              });
            }}
            onRefresh={this.handleRefresh}
            onLoadMore={this.handleNextPage}
            handleShareVideo={this.handleShareVideo}
            isLoading={this.state.isLoading}
          />
          <ApiLoading />
          {this.state.showThemeModal ? (
            <ThemeSelect
              onClose={this.closeThemeModal}
              themes={tags}
              onSelect={this.handleThemeSelect}
              onDismiss={this.handleDismissTheme}
            />
          ) : null}
          {/* This is here for the channel page to show when clicking the "Subscribe" button */}
        </View>
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
  isAnonUser: auth.isAnonUser,
  popular: videos.popular,
  featured: videos.featured,
  favorites: videos.favorites,
  tags: videos.tags,
  selectedThemeVideos: videos.selectedThemeVideos,
  channelVideos: videos.channelVideos,
  pagination: videos.pagination,
});

export default translate('videos')(connect(mapStateToProps, nav)(Videos));
