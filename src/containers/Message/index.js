import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Text, Flex } from '../../components/common';

class Message extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  });
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

Message.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Message);