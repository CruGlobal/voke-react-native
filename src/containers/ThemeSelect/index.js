import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import ThemeList from '../../components/ThemeList';

class ThemeSelect extends Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  handleDismiss() {
    this.props.onDismiss();
    this.handleClose();
  }

  handleSelect(tag) {
    // LOG('selected', tag);
    this.props.onSelect(tag);
    this.handleClose();
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.ThemeSelect);
  }

  render() {
    return (
      <ThemeList items={this.props.themes} onDismiss={this.handleDismiss} onSelectTheme={this.handleSelect} />
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
