import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../common';
import styles from './styles';

export default class PillButton extends Component {
  render() {
    const { filled, ...rest } = this.props;
    return (
      <Button
        {...rest}
        iconStyle={{ paddingRight: 0 }}
        style={[styles.button, filled ? null : styles.empty]}
        buttonTextStyle={[filled ? null : styles.emptyText]}
      />
    );
  }
}

PillButton.propTypes = {
  filled: PropTypes.bool,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
