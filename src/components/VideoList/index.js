
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
    setTimeout(() => {
      // this.props.onRefresh();
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow({ item }) {
    const video = item;
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelect(video)}>
        <Flex
          style={styles.container}
          direction="column"
          align="start"
          justify="center"
          animation="slideInUp">
          <Image resizeMode="contain" source={require('../../../images/nav_voke_logo.png')} style={styles.videoThumbnail}>
            <Icon name="play-circle-filled" size={64} style={styles.playIcon} />
          </Image>
          <Flex direction="column" align="start" justify="start" style={styles.videoDetails}>
            <Text numberOfLines={2} style={styles.videoTitle}>
              {video.title}
            </Text>
            <Text numberOfLines={2} style={styles.videoDescription}>
              {video.description}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    return (
      <FlatList
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
