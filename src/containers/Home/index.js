import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { navigateAction } from '../../actions/navigation';

import { Text } from '../../components/common';

const CONVERSATIONS = {
  id1: {
    id: 'id1',
    name: 'Asher',
    messages: [
      { id: '1', text: 'test 1' },
      { id: '2', text: 'test 2' },
      { id: '3', text: 'test 3' },
      { id: '4', text: 'test 4' },
    ],
  },
  id2: {
    id: 'id2',
    name: 'Ben',
    messages: [
      { id: '1', text: 'test message 2 - 1' },
      { id: '2', text: 'test message 2 - 2' },
      { id: '3', text: 'test message 2 - 3' },
      { id: '4', text: 'test message 2 - 4' },
    ],
  },
};

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    const { dispatch } = this.props;
    return (
      <View>
        <Text>Hello, Message App!</Text>
        <Button
          onPress={() => dispatch(navigateAction('Message', CONVERSATIONS.id1))}
          title="Chat with Asher"
        />
        <Button
          onPress={() => dispatch(navigateAction('Message', CONVERSATIONS.id2))}
          title="Chat with Ben"
        />
      </View>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Home);