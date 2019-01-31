import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import ThemeList from '../../components/ThemeList';

class ThemeSelect extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.ThemeSelect);
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleDismiss = () => {
    this.props.onDismiss();
    this.handleClose();
  };

  handleSelect = tag => {
    this.props.onSelect(tag);
    this.handleClose();
  };

  render() {
    return (
      <ThemeList
        items={this.props.themes}
        onDismiss={this.handleDismiss}
        onSelectTheme={this.handleSelect}
      />
    );
  }
}

ThemeSelect.propTypes = {
  themes: PropTypes.array,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default ThemeSelect;
