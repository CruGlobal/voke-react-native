import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Button } from '../common';

class LoadMore extends Component {
  render() {
    return (
      <Button
        text="Load More"
        type="filled"
        preventTimeout={2500}
        buttonTextStyle={styles.text}
        onPress={this.props.onLoad}
        style={styles.wrapper}
      />
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    width: 120,
    alignSelf: 'center',
    marginVertical: 12,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

LoadMore.propTypes = {
  onLoad: PropTypes.func,
};

export default LoadMore;