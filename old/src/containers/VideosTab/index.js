import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Videos from '../Videos';

class VideosTab extends Component {
  render() {
    return <Videos {...this.props} />;
  }
}

VideosTab.propTypes = {
  channel: PropTypes.object,
  onSelectVideo: PropTypes.func,
  conversation: PropTypes.object,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps)(VideosTab);
