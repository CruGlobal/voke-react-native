import React, { Component, Fragment } from 'react';
import { View, Alert, FlatList, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Orientation from 'react-native-orientation';

import { navigatePush } from '../../actions/nav';
import styles from './styles';
import { navMenuOptions } from '../../utils/menu';
import ApiLoading from '../ApiLoading';
import Header, { HeaderIcon } from '../Header';
import PopupMenu from '../../components/PopupMenu';
import StatusBar from '../../components/StatusBar';
import theme from '../../theme';
import NotificationToast from '../NotificationToast';
import { Flex, Text } from '../../components/common';
import {
  getConversation,
  getMessages,
  getConversations,
  createMessageInteraction,
  markReadAction,
} from '../../actions/messages';
import { keyExtractorId } from '../../utils/common';
import CONSTANTS from '../../constants';
import NotificationItem from '../../components/NotificationItem';
import LoadMore from '../../components/LoadMore';
import NotificationVideoPlayer from '../../components/NotificationVideoPlayer';
import debounce from 'lodash/debounce';

class Notifications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      scrollEnabled: true,
      selectedVideo: null,
      loadingMore: false,
      isLandscape: false,
    };

    this.orientationDidChange = debounce(
      this.orientationDidChange.bind(this),
      50,
    );
  }

  componentWillMount() {
    // The getOrientation method is async. It happens sometimes that
    // you need the orientation at the moment the JS runtime starts running on device.
    // `getInitialOrientation` returns directly because its a constant set at the
    // beginning of the JS runtime.

    // Run getInitial and getOrientations
    const initial = Orientation.getInitialOrientation();
    this.orientationDidChange(initial);
    this.checkOrientation();
  }

  componentDidMount() {
    const { dispatch, me } = this.props;
    if (!me.vokebot_conversation_id) {
      Alert.alert('There was an error getting your conversations');
    }
    dispatch(getConversations());
    dispatch(getConversation(me.vokebot_conversation_id)).then(() =>
      this.getMessages(),
    );

    this.focusListener = this.props.navigation.addListener('willFocus', () => {
      if (this.props.notificationCount > 0) {
        this.markAsRead((this.props.notifications[0] || {}).id);
      }
    });

    // this.toggleOrientation();
    // This doesn't work on Android...because of the navigation stuff
    Orientation.addOrientationListener(this.orientationDidChange);

    // Android is having issues with the orientation stuff, use this workaround
    if (theme.isAndroid) {
      Dimensions.addEventListener('change', ({ window: { width, height } }) => {
        const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
        if (this.state.isLandscape && orientation !== 'LANDSCAPE') {
          this.orientationDidChange(orientation);
        } else if (!this.state.isLandscape && orientation !== 'PORTRAIT') {
          this.orientationDidChange(orientation);
        }
      });
    }
    setTimeout(() => {
      this.setState({ showVideo: true }, () => {
        // For iOS margin
        this.webview &&
          this.webview.getWrappedInstance &&
          this.webview.getWrappedInstance() &&
          this.webview.getWrappedInstance().removeMargin &&
          this.webview.getWrappedInstance().removeMargin();
      });
    }, 1000);

    // Check that the interval is correct every few seconds to fix it if it get's messed up.
    this.orientationInterval = setInterval(this.checkOrientation, 3000);
  }

  componentWillUnmount() {
    Orientation.lockToPortrait();
    Orientation.removeOrientationListener(this.orientationDidChange);
    clearTimeout(this.orientationInterval);
  }

  checkOrientation = () => {
    Orientation.getOrientation((err, orientation) => {
      this.orientationDidChange(orientation);
    });
  };

  orientationDidChange(orientation) {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
      // LOG('landscape');
      if (!this.state.isLandscape) {
        this.setState({ isLandscape: true });
      }
    } else if (orientation === 'PORTRAIT') {
      // LOG('portrait');
      // do something with portrait layout
      if (this.state.isLandscape) {
        this.setState({ isLandscape: false });
      }
    }
  }

  toggleOrientation() {
    // if (!this.state.selectedVideo) {
    Orientation.lockToPortrait();
    // } else {
    // Orientation.unlockAllOrientations();
    // }
  }

  renderLoadMore = () => {
    if (this.props.hasMore) {
      return (
        <LoadMore
          isLoading={this.state.loadingMore}
          onLoad={this.handleLoadMore}
        />
      );
    }
    return null;
  };

  renderRow = ({ item }) => {
    if (!item) return null;
    return (
      <Flex value={1} style={{}}>
        <NotificationItem
          item={item}
          onSelectVideo={() => this.handleSelectVideo(item)}
          onShareVideo={this.handleShareVideo}
        />
      </Flex>
    );
  };

  handleLoadMore() {
    if (this.props.pagination.hasMore) {
      // Loading more messages
      this.getMessages(this.props.pagination.page + 1);
    }
  }

  getMessages(page = undefined) {
    const { dispatch, me } = this.props;
    this.setState({ loadingMore: true });
    dispatch(getMessages(me.vokebot_conversation_id, page))
      .then(results => {
        this.markAsRead(
          ((results || {}).messages || {}).id ||
            (this.props.notifications[0] || {}).id,
        );
        this.setState({ loadingMore: false });
      })
      .catch(() => {
        this.setState({ loadingMore: false });
      });
  }

  markAsRead = async msgId => {
    const { dispatch, me } = this.props;

    const interaction = {
      action: 'read',
      conversationId: me.vokebot_conversation_id,
      messageId: msgId,
    };
    await dispatch(createMessageInteraction(interaction));
    dispatch(getConversations());
  };

  clearSelectedVideo = () => {
    this.setState({ selectedVideo: null });
  };

  handleSelectVideo = m => {
    this.setState({ selectedVideo: m }, () => {
      // this.toggleOrientation();
    });
  };

  handleShareVideo = video => {
    const { dispatch, me } = this.props;
    if (!me.first_name) {
      dispatch(
        navigatePush('voke.TryItNowName', {
          onComplete: () =>
            dispatch(
              navigatePush('voke.ShareFlow', {
                video: video,
              }),
            ),
        }),
      );
    } else {
      dispatch(
        navigatePush('voke.ShareFlow', {
          video: video,
        }),
      );
    }
  };

  render() {
    const { t, dispatch, notifications } = this.props;
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <Header
          left={
            theme.isAndroid ? (
              undefined
            ) : (
              <HeaderIcon
                icon="menu"
                onPress={() => dispatch(navigatePush('voke.Menu'))}
              />
            )
          }
          right={
            theme.isAndroid ? (
              <PopupMenu actions={navMenuOptions(this.props)} />
            ) : (
              undefined
            )
          }
          title={t('title.notifications')}
          shadow={false}
        />
        <NotificationToast />
        {this.state.selectedVideo ? (
          <NotificationVideoPlayer
            ref={c => (this.videoPlayer = c)}
            message={this.state.selectedVideo}
            onClose={this.clearSelectedVideo}
          />
        ) : null}
        {notifications.length > 0 ? (
          <FlatList
            ref={c => (this.listView = c)}
            ListFooterComponent={this.renderLoadMore}
            keyExtractor={keyExtractorId}
            initialNumToRender={CONSTANTS.PAGE_SIZE + 1}
            data={notifications}
            renderItem={this.renderRow}
            contentContainerStyle={styles.content}
            removeClippedSubviews={false}
            bounces={true}
          />
        ) : (
          <Flex align="center" justify="center">
            <Text>{t('noNotifications')}</Text>
          </Flex>
        )}
        <ApiLoading showMS={15000} />
      </View>
    );
  }
}

Notifications.propTypes = {};

const mapStateToProps = ({ auth, messages }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
  isAnonUser: auth.isAnonUser, // Need this for the Android PopupMenu to determine which menu options to show
  notifications: messages.messages[auth.user.vokebot_conversation_id] || [],
  notificationCount: messages.unReadBadgeCount,
  pagination:
    messages.pagination.messages[auth.user.vokebot_conversation_id] || {},
});

export default translate()(connect(mapStateToProps)(Notifications));
