import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import theme, { COLORS } from '../../theme';
import { Loading, Text, Touchable } from '../common';

class LoadMore extends Component {
  renderLoading() {
    return (
      <View style={styles.wrapper}>
        {
          !this.props.isLoading ? (
            <Text style={styles.text}>
              Load More
            </Text>
          ) : (
            <Loading size="small" />
          )
        }
      </View>
    );
  }
  render() {
    return (
      <Touchable
        style={styles.container}
        onPress={() => {
          this.props.onLoad();
        }}
        disabled={this.props.isLoading === true}
        accessibilityTraits="button"
      >
        {this.renderLoading()}
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.GREY,
    borderRadius: 15,
    height: 30,
    width: 120,
    paddingLeft: 10,
    paddingRight: 10,
  },
  text: {
    color: theme.lightText,
    fontSize: 13,
  },
});

LoadMore.propTypes = {
  onLoad: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default LoadMore;