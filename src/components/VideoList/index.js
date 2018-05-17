
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Image } from 'react-native';
import styles, { THUMBNAIL_HEIGHT } from './styles';
import TO_CHAT from '../../../images/to-chat-button.png';

import { Flex, Text, Touchable, Icon, RefreshControl } from '../common';

const ITEM_HEIGHT = THUMBNAIL_HEIGHT + 100 + 20;

class VideoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderNoText = this.renderNoText.bind(this);
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    this.props.onRefresh().then(() => {
      this.setState({ refreshing: false });
    }).catch(() => {
      this.setState({ refreshing: false });
    });
  }

  scrollToBeginning() {
    if (this.props.items.length > 0) {
      this.list.scrollToIndex({ index: 0 });
    }
  }

  formatDuration(seconds) {
    if (!seconds) return '00:00';
    // Hours, minutes and seconds
    var hrs = ~~(seconds / 3600);
    var mins = ~~((seconds % 3600) / 60);
    var secs = seconds % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  renderRow({ item }) {
    const video = item;
    const description = (video.description || '').replace(/^\s+|\s+$/g, '');
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelect(video)}>
        <Flex
          style={styles.container}
          direction="column"
          align="start"
          justify="center"
          animation="slideInUp">
          <ImageBackground resizeMode="cover" source={{uri: video.media.thumbnails.large}} style={styles.videoThumbnail} >
            <Icon name="play-circle-filled" size={64} style={styles.playIcon} />
            <Flex direction="row" align="center" justify="center" style={styles.detailsBackground}>
              <Flex value={1} align="start">
                <Text style={styles.detailsText}>{this.formatDuration(video.media.duration)}</Text>
              </Flex>
              <Flex value={2} align="end">
                <Text style={[styles.detailsText, styles.sharesText]}>{video.shares} Shares</Text>
              </Flex>
            </Flex>
          </ImageBackground>
          <Flex direction="column" align="start" justify="start" style={styles.videoDetails}>
            <Touchable
              isAndroidOpacity={true}
              onPress={() => this.props.handleShareVideo(video)}
              activeOpacity={0.6}
              style={styles.shareCircleButton}>
              <Image
                resizeMode="cover"
                source={TO_CHAT}
                style={{ width: 50, height: 50, borderRadius: 25 }}
              />
            </Touchable>
            <Text numberOfLines={1} style={styles.videoTitle}>
              {video.name}
            </Text>
            <Text numberOfLines={2} style={styles.videoDescription}>
              {description}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  renderNoText() {
    if (this.props.items.length === 0) {
      return (
        <Flex align="center" justify="center">
          <Text style={styles.blankText}>
            No videos to show
          </Text>
        </Flex>
      );
    }
    return null;
  }

  render() {
    return (
      <FlatList
        ref={(c) => this.list = c}
        initialNumToRender={4}
        data={this.props.items}
        renderItem={this.renderRow}
        keyExtractor={(item) => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh}
        />}
        onEndReached={this.props.onLoadMore}
        ListHeaderComponent={this.renderNoText}
      />
    );
  }
}

VideoList.propTypes = {
  onLoadMore: PropTypes.func.isRequired, // Redux
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
  handleShareVideo: PropTypes.func.isRequired,
};

export default VideoList;
