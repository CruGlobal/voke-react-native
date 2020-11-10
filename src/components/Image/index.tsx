import React from 'react';
import {
  Image as ReactNativeImage,
  StyleProp,
  ImageStyle,
  ImagePropsBase,
  ViewStyle,
  TextStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';

// const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

interface ImageProps extends ImagePropsBase {
  source?: object;
  uri?: string;
  style?: StyleProp<ImageStyle | ViewStyle | TextStyle>;
}
function Image({ source, uri, style, ...rest }: ImageProps) {
  // thumbnailAnimated = new Animated.Value(0);

  /* const imageAnimated = new Animated.Value(0);

  function onImageLoad() {
    Animated.timing(imageAnimated, {
      toValue: 1,
      duration: 150,
    }).start();
  } */
  let src = source;
  if (uri) {
    src = { uri: uri };
  }

  const isRemoteImage = src?.uri && src.uri.startsWith('http');
  const isSourceNull = !src?.uri;

  return (
    <>
      {!isRemoteImage || isSourceNull ? (
        <ReactNativeImage {...rest} source={src} style={style} />
      ) : (
        // Only use FastImage for remote images
        // https://github.com/DylanVann/react-native-fast-image
        // TODO: Delete this repo. Too many bugs!
        <FastImage
          style={style}
          source={src}
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
