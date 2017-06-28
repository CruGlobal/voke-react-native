
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListView, Platform } from 'react-native';
import styles from './styles';
import MessageItem from '../MessageItem';

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

    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.scrollEnd = this.scrollEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
  }

  componentDidMount() {
    this.scrollEnd(false);
  }

  handleRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      // this.props.dispatch(newSuggestionAction());
      this.setState({ refreshing: false });
    }, 500);
  }

  renderRow(message) {
    return  <MessageItem item={message} />;
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
    return (
      <ListView
        ref={(c) => this.listView = c}
        enableEmptySections={true}
        contentContainerStyle={styles.content}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    );
  }
}

MessagesList.propTypes = {
  items: PropTypes.array.isRequired, // Redux
};

export default MessagesList;
