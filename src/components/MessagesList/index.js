
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView, Platform } from 'react-native';
import debounce from 'lodash/debounce';

import styles from './styles';
import MessageItem from '../MessageItem';
import Loading from '../Loading';

class MessagesList extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.text !== r2.text,
    });
    this.state = {
      refreshing: false,
      dataSource: ds.cloneWithRows(props.items),
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleLoadMore = debounce(this.handleLoadMore.bind(this), 50);
    this.renderRow = this.renderRow.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
  }

  componentDidMount() {
    this.scrollEnd(false);
  }

  // Debounce this function so it doesn't run too many times
  handleLoadMore() {
    if (this.props.hasMore && !this.props.isLoadingMore) {
      this.props.onLoadMore();
    }
  }

  handleScroll({ nativeEvent }) {
    const { contentOffset } = nativeEvent;
    // This means the user is close to the top of the page
    if (contentOffset.y <= 10) {
      this.handleLoadMore();
    }
  }

  renderRow(message) {
    return (
      <MessageItem
        item={message}
        user={this.props.user}
        onSelectVideo={() => this.props.onSelectVideo(message)}
      />
    );
  }

  scrollEnd(isAnimated) {
    // Somehow check if the listview is in the middle
    // if (this.listView) {
    //   setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
    // }
    setTimeout(() => {
      this.listView.scrollToEnd({ animated: isAnimated });
    }, Platform.OS === 'ios' ? 50 : 250);
  }

  render() {
    const { isLoadingMore, hasMore } = this.props;
    return (
      <ListView
        ref={(c) => this.listView = c}
        renderHeader={isLoadingMore ? () => (
          <View style={{ paddingTop: 15 }}><Loading /></View>
        ) : undefined}
        enableEmptySections={true}
        onScroll={hasMore ? this.handleScroll : undefined}
        scrollEventThrottle={30}
        contentContainerStyle={styles.content}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

MessagesList.propTypes = {
  items: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
};

export default MessagesList;
