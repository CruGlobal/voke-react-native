import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { Text, Flex } from '../../components/common';

class Message extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
  });
  render() {
    const { messages = [] } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <Flex value={1} direction="column" align="end" justify="end">
          {
            messages.map((m) => (
              <Text key={m.id}>{m.text}</Text>
            ))
          }
        </Flex>
        <Flex align="center">
          <Text>Input box</Text>
        </Flex>
      </View>
    );
  }
}

Message.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Message);