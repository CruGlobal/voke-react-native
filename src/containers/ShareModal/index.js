import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Share, Linking, Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import Communications from 'react-native-communications';
// import {ShareSheet} from 'react-native-share';
import SendSMS from 'react-native-sms';

import Analytics from '../../utils/analytics';
import SharePopup from './SharePopup';
import nav, { NavPropTypes } from '../../actions/navigation_new';

function getMessage(friend) {
  return `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''} `;
}

class ShareModal extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overFullScreen',
  };

  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Share Modal');
  }

  dismissModal() {
    Navigation.dismissModal({ animationType: 'none' });
  }

  handleDismiss() {
    this.props.onCancel();
    this.dismissModal();
  }

  handleComplete() {
    this.props.onComplete();
    this.dismissModal();
  }

  handleHide() {
    this.setState({isHidden: true});
  }

  openUrl(url) {
    Linking.canOpenURL(url).then((isSupported) => {
      if (isSupported) {
        Linking.openURL(url);
        this.handleComplete();
      } else {
        Alert.alert('Oops', 'We can\'t find this app on your device, please try another option');
      }
    }).catch(() => {
      this.handleDismiss();
    });
  }

  handleShare(type) {
    const friend = this.props.friend;
    LOG(JSON.stringify(friend));
    if (!friend) {
      this.handleDismiss();
      return;
    }
    const message = getMessage(friend);
    if (type === 'message') {
      // LOG('shareing', type);
      SendSMS.send({
        body: message,
        recipients: [this.props.phoneNumber],
        successTypes: ['sent', 'queued'],
      }, (completed, cancelled, error) => {
        if (completed) {
          this.handleComplete();
        } else {
          this.handleDismiss();
        }
        // LOG('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
      });
    } else if (type=== 'mail') {
      Communications.email(null, null, null, null, message);
      this.handleComplete();
      // LOG('shareing', type);
    } else if (type=== 'whatsapp') {
      const url = `whatsapp://send?text=${message}`;
      this.openUrl(url);
      // LOG('shareing', type);
    } else if (type=== 'fb') {
      const url = 'https://m.me';
      this.openUrl(url);
      // LOG('shareing', type);
    } else {
      // LOG('shareing', type);
      this.handleHide();
      Share.share(
        {
          message: message,
          title: 'Check this out',
        },
        {
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter',
            'com.apple.uikit.activity.CopyToPasteboard',
            'com.google.Drive.ShareExtension',
            'com.apple.UIKit.activity.PostToFacebook',
            'com.apple.UIKit.activity.PostToFlickr',
            'com.apple.UIKit.activity.PostToVimeo',
            'com.apple.UIKit.activity.PostToWeibo',
            'com.apple.UIKit.activity.AirDrop',
            'com.apple.UIKit.activity.PostToSlack',
          ],
        }).then((results) => {
        if (results.action === 'sharedAction') {
          this.handleComplete();
        } else {
          this.handleDismiss();
        }
      });
    }
  }

  render() {
    LOG(this.props.shareWith);
    return (
      <SharePopup
        onShare={this.handleShare}
        onDismiss={this.handleDismiss}
        isHidden={this.state.isHidden}
      />
    );
  }
}

ShareModal.propTypes = {
  ...NavPropTypes,
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  friend: PropTypes.object.isRequired,
  onDismiss: PropTypes.func,
  onMore: PropTypes.func,
  phoneNumber: PropTypes.string.isRequired,
};

export default connect(null, nav)(ShareModal);
