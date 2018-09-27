import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Image } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import { Flex, Text, Touchable, RefreshControl } from '../common';
import LoadMore from '../LoadMore';

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
    this.props
      .onRefresh()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  }

  renderRow({ item }) {
    const channel = item;
    console.log(channel);
    const avatar = channel.avatar || {};
    return (
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(channel)}
      >
        <Flex
          style={styles.container}
          direction="column"
          align="start"
          justify="center"
        >
          <Image
            resizeMode="cover"
            source={{ uri: avatar.large }}
            style={styles.videoThumbnail}
          />
          <Flex
            self="stretch"
            direction="column"
            align="start"
            justify="center"
            style={styles.channelName}
          >
            <Text numberOfLines={1} style={styles.channelTitle}>
              {channel.name}
            </Text>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  render() {
    const { t, items, onLoadMore, isLoading, hasMore } = this.props;
    if (items.length === 0) {
      return (
        <Flex align="center" justify="center">
          <Text>{t('empty.nothingToShow')}</Text>
        </Flex>
      );
    }
    return (
      <FlatList
        ref={c => (this.list = c)}
        initialNumToRender={4}
        horizontal={true}
        data={items}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        // getItemLayout={(data, index) => ({
        //   length: ITEM_HEIGHT,
        //   offset: ITEM_HEIGHT * index,
        //   index,
        // })}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        ListFooterComponent={
          hasMore
            ? () => (
                <Flex
                  align="center"
                  justify="center"
                  style={{ height: '100%', paddingRight: 15 }}
                >
                  <LoadMore isLoading={isLoading} onLoad={onLoadMore} />
                </Flex>
              )
            : undefined
        }
      />
    );
  }
}

ChannelsList.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
};

export default translate()(ChannelsList);
