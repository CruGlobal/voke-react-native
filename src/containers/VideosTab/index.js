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
        channel={this.props.channel}
        onSelectVideo={this.props.onSelectVideo}
        conversation={this.props.conversation}
      />
    );
  }
}

VideosTab.propTypes = {
  ...NavPropTypes,
  channel: PropTypes.object,
  onSelectVideo: PropTypes.func,
  conversation: PropTypes.object,
};

const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(
  mapStateToProps,
  nav,
)(VideosTab);
