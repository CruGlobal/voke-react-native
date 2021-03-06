import React, { useEffect, useState } from 'react';
import { RefreshControl as RNRefreshControl } from 'react-native';
import { bots } from 'assets';
import st from 'utils/st';

import Image from '../Image';

function RefreshControl(props) {
  const [showImage, setShowImage] = useState(false);
  const timeout = null;

  useEffect(() => {
    if (props.refreshing) {
      if (this.timeout) clearTimeout(this.timeout);
      setShowImage(true);
    } else if (!props.refreshing) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => setShowImage(false), 1000);
    }
    return (cleanUp = () => {
      if (this.timeout) clearTimeout(this.timeout);
    });
  }, [props]);

  // Android cannot render a gif inside the
  if (st.isAndroid) {
    return <RNRefreshControl {...props} />;
  }
  return (
    <RNRefreshControl
      {...props}
      {...(props.refreshing
        ? {
            tintColor: st.colors.transparent,
            progressBackgroundColor: st.colors.transparent,
            color: [st.colors.transparent],
          }
        : {})}
      style={[st.aic, st.jcc, st.ass]}
    >
      {showImage ? (
        <Image
          resizeMode="contain"
          source={bots.animated}
          style={[st.h(50), st.abs, st.asc, { top: 5 }]}
        />
      ) : null}
    </RNRefreshControl>
  );
}

export default RefreshControl;
