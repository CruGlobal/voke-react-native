
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView, TextInput, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import MessageItem from '../MessageItem';
import theme from '../../theme';

// import { navigateAction } from '../../actions/navigation';

import { Flex, Touchable, Text, Separator, RefreshControl } from '../../components/common';


class MessagesList extends Component { // eslint-disable-line

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
    setTimeout(() => this.listView.scrollToEnd({ animated: isAnimated }), 50);
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={60}>
        <ListView
          ref={(c) => this.listView = c}
          style={{ flex: undefined }}
          enableEmptySections={true}
          contentContainerStyle={styles.content}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
        />
        <Flex style={styles.inputWrap}>
          <TextInput
            onFocus={() => this.scrollEnd(true)}
            onBlur={() => this.scrollEnd(true)}
            multiline={true}
            placeholder="New Message"
            placeholderTextColor={theme.primaryColor}
            style={styles.chatBox}
            autoCorrect={true}
          />
        </Flex>
      </KeyboardAvoidingView>
    );
  }
}

MessagesList.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(MessagesList);
