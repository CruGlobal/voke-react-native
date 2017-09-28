
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image } from 'react-native';
import styles, { THUMBNAIL_HEIGHT } from './styles';

import { Flex, Text, Touchable, Icon } from '../common';

const ITEM_HEIGHT = THUMBNAIL_HEIGHT + 100 + 20;

class VideoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
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
    this.list.scrollToIndex({ index: 0 });
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
          <Image resizeMode="cover" source={{uri: video.media.thumbnails.large}} style={styles.videoThumbnail}>
            <Icon name="play-circle-filled" size={64} style={styles.playIcon} />
          </Image>
          <Flex direction="column" align="start" justify="start" style={styles.videoDetails}>
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
        refreshing={this.state.refreshing}
        onRefresh={this.handleRefresh}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
      />
    );
  }
}

VideoList.propTypes = {
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

export default VideoList;
