import React, { forwardRef } from 'react';
import { Text as RNText, StyleProp, TextStyle } from 'react-native';
import st from '../../st';

const Text = forwardRef(
  (
    { children, style, ...rest }: { children: React.ReactNode; style: StyleProp<TextStyle>; [x:string]: any },
    ref: React.Ref<RNText>,
  ) => {
    return (
      <RNText ref={ref} {...rest} style={[st.black, st.fontMain, style]}>
        {children}
      </RNText>
    );
  },
);

Text.displayName = 'Text';
export default Text;
