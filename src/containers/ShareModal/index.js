import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Share, Linking, Platform, Clipboard } from 'react-native';
import PropTypes from 'prop-types';
import Communications from 'react-native-communications';
// import SendSMS from 'react-native-sms';
import { MessageDialog } from 'react-native-fbsdk';

import { send } from './sendSms';

import Analytics from '../../utils/analytics';
import SharePopup from './SharePopup';
import { toastAction, setNoBackgroundAction } from '../../actions/auth';

function getMessage(friend) {
  return `Hi ${friend ? friend.first_name : 'friend'}, check out this video ${friend ? friend.url : ''}`;
}

class ShareModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: false,
    };

    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    this.shareLinkWithShareDialog = this.shareLinkWithShareDialog.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Share Modal');
  }

  handleDismiss() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  handleComplete() {
    if (this.props.onComplete) {
      this.props.onComplete();
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
      contentTitle: message,
      quote: message,
    };

    if (Platform.OS === 'android') {
      setTimeout(() => this.handleComplete(), 100);
    }

    MessageDialog.canShow(shareLinkContent).then((canShow)=>{
      if (canShow) {
        MessageDialog.show(shareLinkContent).then((result) => {
          if (result.isCancelled) {
            LOG('cancelled fb messenger');
            this.handleDismiss();
          } else {
            LOG('successful fb messenger');
            this.handleComplete();
          }
        }).catch((error) => {
          LOG('error', error);
          this.handleDismiss();
        });
      } else {
        LOG('no canShow');
        this.handleDismiss();
      }
    }).catch(() => {
      LOG('catch canShow');
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
    if (!friend) return;
    this.handleHide;
    LOG(JSON.stringify(friend));
    if (!friend) {
      this.handleDismiss();
      return;
    }
    const message = getMessage(friend);
    if (type === 'message') {
      // For Android, just call the normal linking sms:{phone}?body={message}
      // We don't import react-native-sms on Android, so don't try to call it
      if (Platform.OS === 'android') {
        send(this.props.phoneNumber, message).then(() => {
          this.handleComplete();
        }).catch(() => {
          this.handleDismiss();
        });
        // Linking.openURL(`sms:${this.props.phoneNumber}?body=${encodeURIComponent(message)}`).then(() => {
        //   this.handleComplete();
        // }).catch(() => {
        //   this.handleDismiss();
        // });
      } else {
        send(this.props.phoneNumber, message).then(() => {
          // On iOS, wrap the complete in a timeout to fix navigation stuff
          setTimeout(() => {
            this.handleComplete();
          }, 1000);
        }).catch(() => {
          this.handleDismiss();
        });
        // SendSMS.send({
        //   body: message,
        //   recipients: [this.props.phoneNumber],
        //   successTypes: ['sent', 'queued', 'inbox', 'outbox', 'draft'],
        // }, (completed, cancelled, error) => {
        //   LOG(completed, cancelled, error);
        //   if (completed) {
        //     LOG('completed message');
        //     if (Platform.OS === 'ios') {
        //       setTimeout(() => {
        //         this.handleComplete();
        //       }, 1000);
        //     } else {
        //       this.handleComplete();
        //     }
        //   } else {
        //     LOG('failed message');
        //     this.handleDismiss();
        //   }
        //   // if (error) {
        //   //   LOG('errror sending message', error);
        //   // }
        // });
      }

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
    if (!this.props.isVisible) return null;
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
  onCancel: PropTypes.func, // Redux
  onComplete: PropTypes.func, // Redux
  friend: PropTypes.object, // Redux
  phoneNumber: PropTypes.string, // Redux
};

const mapStateToProps = ({ contacts }) => ({
  isVisible: contacts.showShareModal,
  ...contacts.shareModalProps,
});

export default connect(mapStateToProps)(ShareModal);
