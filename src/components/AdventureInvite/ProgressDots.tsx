import React from 'react';
import { View } from 'react-native';
import st from 'utils/st';

const ProgressDots = React.memo(function ({ isFilled }) {
  return (
    <View
      style={[
        isFilled ? st.bgBlue : [st.bgTransparent, st.bw1, st.borderCharcoal],
        st.mr6,
        st.circle(10),
      ]}
    />
  );
});

export default ProgressDots;
