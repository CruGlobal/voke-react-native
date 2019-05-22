import React, { Component } from 'react';
import { Image, StyleSheet } from 'react-native';

import LOGO from '../../../images/voke_logo_words.png';

export default class HeaderLogo extends Component {
  render() {
    return <Image resizeMode="contain" source={LOGO} style={styles.image} />;
  }
}

const styles = StyleSheet.create({
  image: {
    height: 18,
  },
});
