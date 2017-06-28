import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../common';
import styles from './styles';

export default class PillButton extends Component {
  render() {
    return (
      <Button
        {...this.props}
        style={[styles.button, this.props.filled ? null : styles.empty]}
        buttonTextStyle={[styles.buttonText, this.props.filled ? null : styles.emptyText]}
      />
    );
  }
}

PillButton.propTypes = {
  filled: PropTypes.bool,
  // buttonTextStyle: PropTypes.oneOfType(styleTypes),
};
