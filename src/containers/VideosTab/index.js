import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import nav, { NavPropTypes } from '../../actions/nav';
import Videos from '../Videos';

class VideosTab extends Component {
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

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(VideosTab);
