
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image } from 'react-native';
import styles, { THUMBNAIL_HEIGHT } from './styles';

import { Flex, Text, Touchable, Icon, RefreshControl } from '../common';

const ITEM_HEIGHT = 120;

class ChannelsList extends Component {

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
    if (this.props.items.length > 0) {
      this.list.scrollToIndex({ index: 0 });
    }
  }

  renderRow({ item }) {
    const channel = item;
    return (
      <Touchable highlight={false} activeOpacity={0.8} onPress={() => this.props.onSelect(channel)}>
        <Flex
          style={styles.container}
          direction="column"
          align="start"
          justify="center"
          animation="slideInLeft">
          <Image resizeMode="contain" source={{uri: channel.avatar.large}} style={styles.videoThumbnail}>
          </Image>
          <Flex self="stretch" direction="column" align="start" justify="center" style={styles.channelName}>
            <Text numberOfLines={1} style={styles.channelTitle}>
              {channel.name}
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
        horizontal={true}
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
      />
    );
  }
}

ChannelsList.propTypes = {
  onLoadMore: PropTypes.func.isRequired, // Redux
  onRefresh: PropTypes.func.isRequired, // Redux
  onSelect: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

export default ChannelsList;
