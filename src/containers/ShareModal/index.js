import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Share, Linking, Alert, Platform, Clipboard } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import Communications from 'react-native-communications';
// import {ShareSheet} from 'react-native-share';
import SendSMS from 'react-native-sms';
import { MessageDialog } from 'react-native-fbsdk';

import Analytics from '../../utils/analytics';
import SharePopup from './SharePopup';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { toastAction, setNoBackgroundAction } from '../../actions/auth';

function getMessage(friend) {
  return `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''}`;
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

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.shareLinkWithShareDialog = this.shareLinkWithShareDialog.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Share Modal');
  }

  onNavigatorEvent(event) {
    if (event.id === 'backPress') {
      this.handleDismiss();
    }
  }

  handleDismiss() {
    this.props.onCancel();
    if (Platform.OS === 'ios') {
      Navigation.dismissModal({ animationType: 'none' });
    }
  }
  
  handleComplete() {
    this.props.onComplete();
    if (Platform.OS === 'ios') {
      Navigation.dismissModal({ animationType: 'none' });
    }
  }

  handleHide() {
    this.setState({ isHidden: true });
  }

  shareLinkWithShareDialog(message, url) {
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: url,
      contentDescription: message,
      // contentTitle: message,
      // quote: message,
    };

    MessageDialog.canShow(shareLinkContent).then((canShow)=>{
      if (canShow) {
        MessageDialog.show(shareLinkContent).then((result) => {
          if (result.isCancelled) {
            this.handleDismiss();
            LOG('cancelled fb messenger');
          } else {
            this.handleComplete();
            LOG('successful fb messenger');
          }
        }).catch((error) => {
          this.handleDismiss();
          LOG('error', error);
        });
      } else {
        this.handleDismiss();
      }
    }).catch(() => {
      this.handleShare('custom');
    });
  }

  openUrl(url) {
    // whatsapp does not work with canopenurl for some reason
    Linking.openURL(url).then(() => {
      this.handleComplete();
    }).catch(() => {
      this.handleShare('custom');
    });
    // Linking.canOpenURL(url).then((isSupported) => {
    //   if (isSupported) {
    //     Linking.openURL(url);
    //     this.handleComplete();
    //   } else {
    //     Alert.alert('Oops', 'We can\'t find this app on your device, please try another option');
    //   }
    // }).catch(() => {
    //   this.handleDismiss();
    // });
  }

  handleShare(type) {
    // Make sure no background actions happen while doing share stuff
    this.props.dispatch(setNoBackgroundAction(true));
    const friend = this.props.friend;
    LOG(JSON.stringify(friend));
    if (!friend) {
      this.handleDismiss();
      return;
    }
    const message = getMessage(friend);
    if (type === 'message') {
      // This could also be done with Linking.openURL('sms://?body=message');
      SendSMS.send({
        body: message,
        recipients: [this.props.phoneNumber],
        successTypes: ['sent', 'queued', 'inbox', 'outbox', 'draft'],
      }, (completed, cancelled, error) => {
        LOG(completed, cancelled, error);
        if (completed) {
          LOG('completed message');
          this.handleComplete();
        } else {
          LOG('failed message');
          this.handleDismiss();
        }
        // if (error) {
        //   LOG('errror sending message', error);
        // }
      });
      
    } else if (type === 'mail') {
      // This could also be done with Linking.openURL('mailto://?body=message');
      Communications.email(null, null, null, null, message);
      this.handleComplete();
    } else if (type === 'whatsapp') {
      let whatsappMessage = encodeURIComponent(message);
      // LOG(whatsappMessage);
      const url = `whatsapp://send?text=${whatsappMessage}`;
      this.openUrl(url);
    } else if (type === 'fb') {
      this.shareLinkWithShareDialog(message, friend.url);
      // const url = 'https://m.me';
      // this.openUrl(url);
    } else if (type === 'copy') {
      Clipboard.setString(message);
      if (Platform.OS === 'android') {
        this.props.dispatch(toastAction('Copied!'));
      }
      this.handleComplete();
    } else {
      this.handleHide();
      Share.share({
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
        if (results.action === Share.sharedAction) {
          this.handleComplete();
        } else {
          this.handleDismiss();
        }
      }).catch(() => {
        this.handleDismiss();
      });
    }
  }

  render() {
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
