import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import theme from '../../theme';
import { Text, Touchable } from '../common';

class LoadMore extends Component {
  render() {
    return (
      <Touchable style={styles.container} onPress={this.props.onLoad}>
        <View style={styles.wrapper}>
          <Text style={styles.text}>
            Load More
          </Text>
        </View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // Need to invert this because the list view is inverted
    transform: [{ scaleY: -1 }],
    alignItems: 'center',
    marginBottom: 10,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.secondaryColor,
    borderRadius: 20,
    height: 35,
    width: 120,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    color: theme.lightText,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

LoadMore.propTypes = {
  onLoad: PropTypes.func,
};

export default LoadMore;