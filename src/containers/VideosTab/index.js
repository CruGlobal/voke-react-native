import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import Videos from '../Videos';

class VideosTab extends Component {
  render() {
    return (
      <Videos
        {...this.props}
        onVideoShare={this.props.onVideoShare}
      />
    );
  }
}

VideosTab.propTypes = {
  ...NavPropTypes,
  onVideoShare: PropTypes.func,
};

export default connect(null, nav)(VideosTab);
