import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import { Text, Flex } from '../../components/common';
import ShareButton from '../../components/ShareButton';

class Message extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params.name,
  // });
  render() {
    // const { messages = [] } = this.props.navigation.state.params;
    const { messages = [] } = this.props;
    return (
      <View style={styles.container}>
        <Flex value={1} direction="column" align="end" justify="end">
          {
            messages.map((m) => (
              <Flex direction="row" key={m.id}>
                <Text>{m.text}</Text>
                <ShareButton message="Share this with you" title="Hey!" url="https://www.facebook.com" />
              </Flex>
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
  ...NavPropTypes,
};

export default connect(null, nav)(Message);
