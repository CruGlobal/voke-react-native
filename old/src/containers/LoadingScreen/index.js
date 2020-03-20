import React, { Component } from 'react';

import VOKE_LOADING from '../../../images/goDeeper.png';
import styles from './styles';
import { Image, Flex } from '../../components/common';
import StatusBar from '../../components/StatusBar';

class LoadingScreen extends Component {
  render() {
    return (
      <Flex align="center" justify="center" value={1} style={styles.container}>
        <StatusBar />
        <Image source={VOKE_LOADING} style={{}} />
      </Flex>
    );
    // <Image style={{ width: 150, height: 150 }} source={LOADING} />
  }
}

export default LoadingScreen;
