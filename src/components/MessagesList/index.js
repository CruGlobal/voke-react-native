
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';

import CONSTANTS from '../../constants';
import styles from './styles';
import MessageItem from '../MessageItem';
import LoadMore from '../../components/LoadMore';

class MessagesList extends Component {
  constructor(props) {
    super(props);
    // const ds = new ListView.DataSource({
    //   rowHasChanged: (r1, r2) => r1.id !== r2.id || r1.text !== r2.text,
    // });
    this.state = {
      refreshing: false,
    };

    this.renderLoadMore = this.renderLoadMore.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
    this.renderTypeState = this.renderTypeState.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
  // }

  // componentDidMount() {
  //   this.scrollEnd(false);
  // }

  renderLoadMore() {
    if (this.props.hasMore) {
      return <LoadMore onLoad={this.props.onLoadMore} />;
    }
    return null;
  }

  renderRow({ item }) {
    return (
      <View style={{ transform: [{ scaleY: -1 }]}}>
        <MessageItem
          item={item}
          user={this.props.user}
          messengers={this.props.messengers}
          onSelectVideo={() => this.props.onSelectVideo(item)}
        />
      </View>
    );
  }

  renderTypeState() {
    const { typeState, user, messengers, onSelectVideo } = this.props;
    if (typeState) {
      const item = { type: 'typeState' };
      return (
        <View style={{ transform: [{ scaleY: -1 }]}}>
          <MessageItem
            item={item}
            user={user}
            messengers={messengers}
            onSelectVideo={() => onSelectVideo(item)}
          />
        </View>
      );
    } else return null;
  }

  scrollEnd(isAnimated) {
  //   // Somehow check if the listview is in the middle
  //   if (this.listView) {
  //     setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
  //   }
  //   setTimeout(() => {
  //     this.listView.scrollToEnd({ animated: isAnimated });
  //   }, Platform.OS === 'ios' ? 50 : 250);
  }

  render() {
    const { items } = this.props;
    return (
      <FlatList
        ref={(c) => this.listView = c}
        ListFooterComponent={this.renderLoadMore}
        keyExtractor={(item) => item.id}
        style={{  transform: [{ scaleY: -1 }]}}
        initialNumToRender={CONSTANTS.PAGE_SIZE + 1}
        data={items}
        renderItem={this.renderRow}
        contentContainerStyle={styles.content}
        inverted={true}
        ListHeaderComponent={this.renderTypeState}
      />
    );
  }
}

// <ListView
//   ref={(c) => this.listView = c}
//   renderHeader={isLoadingMore ? () => (
//     <View style={{ paddingTop: 15 }}><Loading /></View>
//   ) : undefined}
//   enableEmptySections={true}
//   onScroll={hasMore ? this.handleScroll : undefined}
//   scrollEventThrottle={30}
//   contentContainerStyle={styles.content}
//   dataSource={this.state.dataSource}
//   renderRow={this.renderRow}
// />

MessagesList.propTypes = {
  items: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  messengers: PropTypes.array.isRequired,
  onSelectVideo: PropTypes.func.isRequired,
  hasMore: PropTypes.bool,
  onLoadMore: PropTypes.func,
  typeState: PropTypes.bool,
};

export default MessagesList;
