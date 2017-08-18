import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Text } from '../../components/common';
import Videos from '../Videos';

class VideosTab extends Component {
  render() {
    return (
      // <Videos
      //   {...this.props}
      //   onVideoAdd={this.props.onVideoAdd}
      // />
      <Text>Hello</Text>
    );
  }
}

VideosTab.propTypes = {
  ...NavPropTypes,
  onVideoAdd: PropTypes.func,
};

export default connect(null, nav)(VideosTab);
