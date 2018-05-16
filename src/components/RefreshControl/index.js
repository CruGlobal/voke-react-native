import React, { Component } from 'react';
import { Image, RefreshControl, StyleSheet } from 'react-native';

import ANIMATION from '../../../images/VokeBotAnimation.gif';
import theme, { COLORS } from '../../theme';

// When the user does a pull to refresh, they will see the native indicator, but once refreshing
// actually begins, switch it out for the image. Then, when it is all done refreshing, leave the
// image there for an extra amount of time
export default class MyRefreshControl extends Component {
  state = { showImage: false };
  timeout = null;

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.refreshing && !this.props.refreshing) {
      if (this.timeout) clearTimeout(this.timeout);
      this.setState({ showImage: true });
    } else if (!nextProps.refreshing && this.props.refreshing) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ showImage: false }), 1000);
    }
  }
  
  render() {
    // Android cannot render a gif inside the 
    if (theme.isAndroid) {
      return <RefreshControl {...this.props} />;
    }
    return (
      <RefreshControl
        {...this.props}
        {...(this.props.refreshing ? {
          tintColor: COLORS.TRANSPARENT,
          progressBackgroundColor: COLORS.TRANSPARENT,
          color: [COLORS.TRANSPARENT],
        } : {})}
        style={styles.control}>
        {
          this.state.showImage ? (
            <Image resizeMode="contain" source={ANIMATION} style={styles.image}  />
          ) : null
        }
      </RefreshControl>
    );
  }
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  image: {
    height: 50,
    position: 'absolute',
    top: 5,
    alignSelf: 'center',
  },
});

MyRefreshControl.propTypes = { ...RefreshControl.propTypes };
MyRefreshControl.defaultProps = {
  progressBackgroundColor: COLORS.WHITE, // Android only
  colors: [COLORS.DARK_BLUE, COLORS.BLUE], // Android only
  tintColor: COLORS.WHITE, // iOS only
};
