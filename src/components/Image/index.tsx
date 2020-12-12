import React from 'react';
import {
  Image as ReactNativeImage,
  StyleProp,
  ImageStyle,
  ImagePropsBase,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  ImageURISource,
} from 'react-native';
import FastImage from 'react-native-fast-image';

// const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

interface ImageProps extends ImagePropsBase {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle | ViewStyle | TextStyle>;
}
function Image({ source, style, ...rest }: ImageProps) {
  // thumbnailAnimated = new Animated.Value(0);

  /* const imageAnimated = new Animated.Value(0);

  function onImageLoad() {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 150,
    }).start();
  } */

  // Cherry-pick type variation.
  // https://www.typescriptlang.org/docs/handbook/advanced-types.html
  const sourceObj = source as ImageURISource;

  // Be aware: uri can be number (local image id)!
  const isRemoteImage = sourceObj?.uri && sourceObj.uri.startsWith('http');

  return (
    <>
      {!isRemoteImage ? (
        <ReactNativeImage {...rest} source={source} style={style} />
      ) : (
        // Only use FastImage for remote images
        // https://github.com/DylanVann/react-native-fast-image
        // TODO: Delete this repo. Too many bugs!
        <FastImage
          style={style}
          source={source}
          {...rest}
          /* style={[{
            // opacity: imageAnimated
          }, style]} */
          // onLoad={onImageLoad}
        />
      )}
    </>
  );
}

export default React.memo(Image);
