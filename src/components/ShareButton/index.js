import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Share } from 'react-native';

import { Button } from '../common';

// See http://facebook.github.io/react-native/releases/0.45/docs/share.html#share
export default class ShareButton extends Component {
  
  constructor(props) {
    super(props);
    this.handleShare = this.handleShare.bind(this);
  }

  handleShare() {
    const { message, title, url } = this.props;
    const newMessage = url ? `${message} ${url}` : message;
    Share.share({
      message: newMessage,
      title: title || 'Check this out on Voke!',
      url,
    }, {
      dialogTitle: 'Share',
    }).then(({ action, activityType }) => {
      if (action === Share.sharedAction) {
        console.warn('shared!', activityType);
      } else {
        console.warn('not shared!');
      }
    }).catch((err) => console.warn('Share Error', err));
  }
  render() {
    return (
      <Button
        icon="share"
        size={24}
        onPress={this.handleShare}
      />
    );
  }
}

ShareButton.propTypes = {
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
  url: PropTypes.string,
};
