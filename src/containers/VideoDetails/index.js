import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import WebviewVideo from '../../components/WebviewVideo';
import { Icon, Flex, Touchable } from '../../components/common';
import { backAction } from '../../actions/navigation';

class VideoDetails extends Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params.video.title || 'test',
  // });
  static navigatorStyle = {
    navBarHidden: true,
  };
  render() {
    // const video = this.props.navigation.state.params.video;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Flex style={styles.video}>
          <WebviewVideo
            type="youtube"
            url="https://www.youtube.com/watch?v=cUYSGojUuAU"
            start={5}
            onChangeState={(videoState) => console.warn(videoState)}
          />
          <View style={styles.backHeader}>
            <Touchable onPress={() => this.props.dispatch(backAction())}>
              <Icon name="arrow-back" size={28} style={styles.backIcon} />
            </Touchable>
          </View>
        </Flex>
        <Flex>
        </Flex>
      </View>
    );
  }
}

VideoDetails.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(VideoDetails);
