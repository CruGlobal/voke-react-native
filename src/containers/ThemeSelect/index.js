import React, { Component } from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Analytics from '../../utils/analytics';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';
import ThemeList from '../../components/ThemeList';

class ThemeSelect extends Component {

  static navigatorStyle = {
    navBarHidden: true,
  };

  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleClose(options) {
    if (Platform.OS === 'android') {
      Navigation.dismissModal(options);
    } else {
      Navigation.dismissLightBox(options);
    }
  }

  handleDismiss() {
    this.props.onDismiss();
    this.handleClose();
  }

  handleSelect(tag) {
    LOG('selected', tag);
    this.props.onSelect(tag);
    this.handleClose();
  }

  componentDidMount() {
    Analytics.screen('Theme Select');
  }

  render() {
    return (
      <ThemeList items={this.props.themes} onDismiss={this.handleDismiss} onSelectTheme={this.handleSelect} />
    );
  }
}

ThemeSelect.propTypes = {
  ...NavPropTypes,
  themes: PropTypes.array,
  onSelect: PropTypes.func,
  onDismiss: PropTypes.func,
};

export default connect(null, nav)(ThemeSelect);
