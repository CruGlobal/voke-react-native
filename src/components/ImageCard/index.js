import React from 'react';
import { View } from 'react-native';
import Image from '../Image';
import st from '../../st';

function ImageCard({ source, style, badge, children, ...rest }) {
  let customStyles = {
    height: st.fullWidth * 0.7 - 30,
    width: st.fullWidth - 30,
    borderRadius: 10,
  }; // default for playlist

  return (
    <View style={[customStyles, style]}>
      <Image source={source} style={[customStyles, style]} />
      {children}
    </View>
  );
}

export default ImageCard;
