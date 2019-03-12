import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, ImageBackground, Image, View } from 'react-native';
import { translate } from 'react-i18next';

import styles from './styles';
import ANIMATION from '../../../images/VokeBotAnimation.gif';

import { Flex, Text, Touchable, Icon, RefreshControl, Button } from '../common';

const ITEM_HEIGHT = 64 + 20;

class MyAdventuresList extends Component {
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
    this.props
      .onRefresh()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(() => {
        this.setState({ refreshing: false });
      });
  }

  scrollToBeginning(animated = true) {
    if (this.props.items.length > 0) {
      this.list.scrollToIndex({ index: 0, animated });
    }
  }

  renderRow({ item }) {
    const { t } = this.props;
    return (
      <Touchable
        highlight={false}
        activeOpacity={0.8}
        onPress={() => this.props.onSelect(item)}
      >
        <Flex
          style={styles.container}
          direction="row"
          align="center"
          justify="start"
          animation="slideInUp"
        >
          <Image
            source={{ uri: item.item.content.thumbnails.small }}
            style={styles.adventureThumbnail}
          />
          <Flex
            direction="column"
            align="start"
            justify="start"
            style={{ paddingHorizontal: 10 }}
          >
            <Text numberOfLines={1} style={styles.adventureTitle}>
              {item.name}
            </Text>
            <Text numberOfLines={2} style={styles.adventureUser}>
              {item.description}
            </Text>
          </Flex>
          <Flex
            value={1}
            align="end"
            justify="end"
            style={{ paddingHorizontal: 10 }}
          >
            <Flex align="center" justify="center" style={styles.notification}>
              <Text>1</Text>
            </Flex>
          </Flex>
        </Flex>
      </Touchable>
    );
  }

  renderNoText() {
    const { t, isLoading, items } = this.props;
    if (isLoading) {
      return (
        <Flex align="center" justify="center">
          <Text style={styles.blankText}>{t('loading.videos')}</Text>
          <Image
            style={{ marginBottom: 20, height: 100 }}
            resizeMode="contain"
            source={ANIMATION}
          />
        </Flex>
      );
    } else if (items.length === 0) {
      return (
        <Flex align="center" justify="center">
          <Text style={styles.blankText}>{t('empty.noVideos')}</Text>
        </Flex>
      );
    }
    return null;
  }

  render() {
    return (
      <FlatList
        ref={c => (this.list = c)}
        initialNumToRender={10}
        data={this.props.items}
        renderItem={this.renderRow}
        keyExtractor={item => item.id}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh}
          />
        }
        onEndReached={this.props.onLoadMore}
        ListHeaderComponent={this.renderNoText}
      />
    );
  }
}

MyAdventuresList.propTypes = {
  onLoadMore: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default translate('videos', { wait: true, withRef: true })(
  MyAdventuresList,
);
