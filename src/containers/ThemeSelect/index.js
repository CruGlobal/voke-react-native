import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {  getSelectedThemeVideos } from '../../actions/videos';

import { navMenuOptions } from '../../utils/menu';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Navigation } from 'react-native-navigation';
import theme, { COLORS } from '../../theme';
import ThemeList from '../../components/ThemeList';

class ThemeSelect extends Component {

  static navigatorButtons = {
    rightButtons: [{
      title: 'Done',
      id: 'home',
    }],
  };

  static navigatorStyle = {
    navBarBackgroundColor: COLORS.TRANSPARENT,
    navBarTextColor: theme.textColor,
    navBarRightButtonColor: theme.textColor,
    navBarRightButtonFontSize: 14,
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleDismiss() {
    this.props.onDismissLightBox();
    Navigation.dismissLightBox();
  }

  handleSelect(tag) {
    console.warn('selected', tag);
    this.props.onSelect(tag);
    Navigation.dismissLightBox();
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'home') {
        Navigation.dismissLightBox({
          animationType: 'slide-down',
        });
      }
    }
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
  onDismissLightBox: PropTypes.func,
};

export default connect(null, nav)(ThemeSelect);
