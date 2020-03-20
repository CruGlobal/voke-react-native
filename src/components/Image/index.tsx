import React from 'react';
import { Image as ReactNativeImage, Animated, StyleProp, ImageStyle, ImagePropsBase } from 'react-native';
import FastImage from 'react-native-fast-image';
import st from '../../st';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

interface ImageProps extends ImagePropsBase {
  source: any;
  style?: StyleProp<ImageStyle>;
}
function Image({ source, style, ...rest }: ImageProps) {
  // thumbnailAnimated = new Animated.Value(0);

  let imageAnimated = new Animated.Value(0);

  function onImageLoad() {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 150,
    }).start();
  }

  const isRemoteImage = source && source.uri && source.uri.startsWith('http');
  const isSourceNull = source && source.uri && source.uri === null;

  return (
    <>
      {!isRemoteImage || isSourceNull ? (
        <ReactNativeImage {...rest} source={source} style={style} />
      ) : (
        // Only use FastImage for remote images
        <AnimatedFastImage {...rest} source={source} style={[{ opacity: imageAnimated }, style]} onLoad={onImageLoad} />
      )}
    </>
  );
}

export default Image;
