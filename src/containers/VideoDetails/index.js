import React, { Component } from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import { Text, Flex } from '../../components/common';

class VideoDetails extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.video.title || 'test',
  });
  render() {
    const video = this.props.navigation.state.params.video;
    return (
      <View style={styles.container}>
        <Flex value={1} direction="column" align="center" justify="start">
          <Flex style={styles.video}>
            <WebviewVideo />
          </Flex>
          <Flex>
          </Flex>
        </Flex>
      </View>
    );
  }
}

VideoDetails.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(VideoDetails);
