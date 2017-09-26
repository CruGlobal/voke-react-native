import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';
import Communications from 'react-native-communications';
import Share, {ShareSheet} from 'react-native-share';

import Analytics from '../../utils/analytics';
import theme, {COLORS, DEFAULT} from '../../theme';
import MESSAGES from '../../../images/icon-messages.png';
import WHATSAPP from '../../../images/icon-whatsapp.png';
import MAIL from '../../../images/icon-mail.png';
import FB from '../../../images/icon-faceboomessenger.png';
import styles from './styles';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import { Flex, Icon, Text, Button, Touchable } from '../../components/common';

class ShareModal extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    screenBackgroundColor: 'transparent',
    modalPresentationStyle: 'overFullScreen',
  };

  constructor(props) {
    super(props);
    this.state = {
      isMore: false,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleShare = this.handleShare.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Share Modal');
  }

  dismissModal() {
    Navigation.dismissModal({ animationType: 'none' });
  }

  handleDismiss() {
    this.props.onDismiss;
    this.dismissModal();
  }

  handleShare(type) {
    let shareOptions = {
      title: 'React Native',
      message: 'Hola mundo',
      url: 'http://facebook.github.io/react-native/',
      subject: 'Share Link',
    };
    if (type === 'message') {
      LOG('shareing', type);
      Communications.text(this.props.shareWith.toString(), this.props.message);
      this.dismissModal();
    } else if (type=== 'mail') {
      Share.shareSingle(Object.assign(shareOptions, {
        'social': 'email',
      }));
      // Communications.email(null, null, null, null, this.props.message);
      this.dismissModal();
      LOG('shareing', type);
    } else if (type=== 'whatsapp') {
      LOG('shareing', type);
    } else if (type=== 'fb') {
      LOG('shareing', type);
    } else {
      LOG('shareing', type);
      this.props.onMore();
      this.dismissModal();
    }
  }

  handleSelect() {
    this.dismissModal();
  }

  render() {
    LOG(this.props.shareWith);
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="center" justify="center" style={styles.modal}>
          <Flex direction="row" value={1} style={{borderColor: COLORS.LIGHT_GREY, borderBottomWidth: 1, width: DEFAULT.FULL_WIDTH}} align="center" justify="center">
            <Touchable onPress={()=> this.handleShare('message')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={MESSAGES} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Message</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={()=> this.handleShare('mail')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={MAIL} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Email</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={()=> this.handleShare('whatsapp')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={WHATSAPP} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>WhatsApp</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={()=> this.handleShare('fb')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={FB} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Messenger</Text>
              </Flex>
            </Touchable>
          </Flex>
          <Flex value={1} style={{alignSelf: 'flex-start'}} direction="row" align="center" justify="center">
            <Touchable onPress={()=> this.handleShare('more')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex align="center" style={styles.iconWrap}>
                  <Flex align="center" justify="center" style={[styles.iconStyle, {backgroundColor: COLORS.WHITE}]} >
                    <Icon style={{color: COLORS.CHARCOAL}} size={30} name="more-horiz" />
                  </Flex>
                </Flex>
                <Text style={styles.iconText}>More</Text>
              </Flex>
            </Touchable>
          </Flex>
        </Flex>
        <Flex align="center" justify="center">
          <Button
            text="Cancel"
            buttonTextStyle={styles.buttonText}
            style={styles.button}
            onPress={this.handleDismiss}
          />
        </Flex>
      </Flex>
    );
  }
}

ShareModal.propTypes = {
  ...NavPropTypes,
  message: PropTypes.string,
  title: PropTypes.string,
  onDismiss: PropTypes.func,
  onMore: PropTypes.func,
  shareWith: PropTypes.string,
};

export default connect(null, nav)(ShareModal);
