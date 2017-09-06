import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import Videos from '../Videos';
import theme from '../../theme';

class VideosTab extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarButtonColor: theme.lightText,
    navBarTextColor: theme.headerTextColor,
    navBarBackgroundColor: theme.headerBackgroundColor,
  };
  render() {
    return (
      <Videos
        {...this.props}
        onSelectVideo={this.props.onSelectVideo}
      />
    );
  }
}

VideosTab.propTypes = {
  ...NavPropTypes,
  onSelectVideo: PropTypes.func,
};

export default connect(null, nav)(VideosTab);
