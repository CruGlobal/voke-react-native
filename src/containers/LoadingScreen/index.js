import React, { Component } from 'react';
// import { Image } from 'react-native';

import styles from './styles';
import { Flex, Loading } from '../../components/common';
import StatusBar from '../../components/StatusBar';
// import LOADING from '../../../images/box.gif';

class LoadingScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <StatusBar />
        <Loading />

      </Flex>
    );
    // <Image style={{ width: 150, height: 150 }} source={LOADING} />
  }
}

export default LoadingScreen;
