import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../../constants';
import styles from './styles';
import MessageItem from '../MessageItem';
import LoadMore from '../../components/LoadMore';
import { View, FlatList, Flex } from '../../components/common';

class MessagesList extends Component {
  state = {
    refreshing: false,
    scrollEnabled: true,
  };

  renderLoadMore = () => {
    if (this.props.hasMore) {
      return (
        <LoadMore
          isLoading={this.props.isLoading}
          onLoad={this.props.onLoadMore}
        />
      );
    }
    return null;
  };

  renderRow = ({ item }) => {
    return (
      <Flex value={1} style={{}}>
        <MessageItem
          item={item}
          user={this.props.user}
          messengers={this.props.messengers}
          onSelectVideo={() => this.props.onSelectVideo(item)}
          onShareVideo={this.props.onShareVideo}
          onSendAnswer={this.props.onSendAnswer}
          relevanceHasBeenAswered={
            !!this.props.items.find(m => m.kind === 'answer')
          }
        />
      </Flex>
    );
  };

  renderTypeState() {
    const {
      typeState,
      user,
      messengers,
      onSelectVideo,
      onShareVideo,
    } = this.props;
    if (typeState) {
      const item = { type: 'typeState' };
      return (
        <View style={{ zIndex: 100 }}>
          <MessageItem
            item={item}
            user={user}
            messengers={messengers}
            onSelectVideo={() => onSelectVideo(item)}
            onShareVideo={onShareVideo}
            onSendAnswer={this.props.onSendAnswer}
          />
        </View>
      );
    }
    return null;
  }

  scrollEnd() {
    // scrollEnd(isAnimated) {
    //   // Somehow check if the listview is in the middle
    //   if (this.listView) {
    //     setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
    //   }
    //   setTimeout(() => {
    //     this.listView.scrollToEnd({ animated: isAnimated });
    //   }, !theme.isAndroid ? 50 : 250);
  }

  render() {
    return (
      <Fragment>
        <FlatList
          ref={c => (this.listView = c)}
          ListFooterComponent={this.renderLoadMore}
          keyExtractor={item => item.id}
          initialNumToRender={CONSTANTS.PAGE_SIZE + 1}
          data={this.props.items}
          renderItem={this.renderRow}
          inverted={true}
          contentContainerStyle={styles.content}
          removeClippedSubviews={false}
          bounces={false}
        />
        {this.renderTypeState()}
      </Fragment>
    );
  }
}

MessagesList.propTypes = {
  items: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  messengers: PropTypes.array.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
  onSendAnswer: PropTypes.func,
  typeState: PropTypes.bool,
  onEndReached: PropTypes.func.isRequired,
};

export default MessagesList;
