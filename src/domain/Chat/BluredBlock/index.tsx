import React from 'react';
import { Image as ReactNativeImage, StyleSheet, View } from 'react-native';
import { isAndroid } from 'utils/constants';
import { BlurView } from '@react-native-community/blur';
import VokeIcon from 'components/VokeIcon';
import ui from 'utils/ui';

import styles from './styles';

const BluredBlock = (): React.ReactElement => (
  <View style={styles.bluredBlock}>
    <>
      {isAndroid && (
        // On Android Gaussian blur slows down scrolling,
        // so we have to create pseudo-blur effect.
        <ReactNativeImage
          source={ui.bluredText}
          resizeMode={'repeat'}
          resizeMethod={'resize'}
          style={styles.bluredImage}
        />
      )}
      {!isAndroid && (
        <BlurView
          blurType="light"
          blurAmount={2}
          style={StyleSheet.absoluteFill}
        />
      )}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,.2)',
        }}
      />
      <VokeIcon name="lock" size={16} style={styles.icon} />
    </>
  </View>
);

export default BluredBlock;
