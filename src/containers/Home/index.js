import React, { Component } from 'react';
import { View, Button } from 'react-native';

import { Text } from '../../components/common';

class Home extends Component {
  static navigationOptions = {
    title: 'Home',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello, Message App!</Text>
        <Button
          onPress={() => navigate('Message', {
            id: '414',
            messages: [
              { id: '1', text: 'test 1' },
              { id: '2', text: 'test 2' },
              { id: '3', text: 'test 3' },
              { id: '4', text: 'test 4' },
            ],
          })}
          title="Chat with Asher"
        />
        <Button
          onPress={() => navigate('Message', {
            id: '415',
            messages: [
              { id: '1', text: 'test message 2 - 1' },
              { id: '2', text: 'test message 2 - 2' },
              { id: '3', text: 'test message 2 - 3' },
              { id: '4', text: 'test message 2 - 4' },
            ],
          })}
          title="Chat with Ben"
        />
      </View>
    );
  }
}
export default Home;