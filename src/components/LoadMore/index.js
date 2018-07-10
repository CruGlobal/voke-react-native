import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { translate } from 'react-i18next';

import { Button } from '../common';

class LoadMore extends Component {
  render() {
    return (
      <Button
        text="Load More"
        type="filled"
        isLoading={this.props.isLoading}
        preventTimeout={2500}
        buttonTextStyle={styles.text}
        onPress={this.props.onLoad}
        style={[
          styles.wrapper,
          { paddingBottom: this.props.isLoading ? 15 : undefined },
        ]}
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
    paddingHorizontal: 10,
    height: 35,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

LoadMore.propTypes = {
  onLoad: PropTypes.func,
};

export default translate()(LoadMore);
