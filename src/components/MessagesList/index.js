
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ListView } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import MessageItem from '../MessageItem';

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ dataSource: this.state.dataSource.cloneWithRows(nextProps.items) });
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

  render() {
    return (
      <View style={styles.container}>
        <ListView
          style={{ flex: 1 }}
          enableEmptySections={true}
          contentContainerStyle={styles.content}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          inverted={true}
        />
        <Flex style={{ height: 50 }}><Text>KEYBOARD!</Text></Flex>
      </View>
    );
  }
}

MessagesList.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
  items: PropTypes.array.isRequired, // Redux
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(MessagesList);
