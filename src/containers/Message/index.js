import React, { Component } from 'react';
import { View, Button } from 'react-native';

import { Text, Flex } from '../../components/common';

class Message extends Component {
  static navigationOptions = {
    title: 'Chat',
  };
  render() {
    const { id, messages = [] } = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    return (
      <View>
        <Text>Inside message view! ID: {id}</Text>
        <Flex direction="column">
          {
            messages.map((m) => (
              <Text key={m.id}>{m.text}</Text>
            ))
          }
        </Flex>
        <Button
          onPress={() => goBack()}
          title="Back"
        />
      </View>
    );
  }
}
export default Message;