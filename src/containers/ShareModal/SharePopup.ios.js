import React, { Component } from 'react';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import theme, { COLORS } from '../../theme';
import MESSAGES from '../../../images/icon-messages.png';
import WHATSAPP from '../../../images/icon-whatsapp.png';
import MAIL from '../../../images/icon-mail.png';
import FB from '../../../images/icon-faceboomessenger.png';
import styles from './styles';
import { Flex, Icon, Text, Button, Touchable } from '../../components/common';

class SharePopup extends Component {
  render() {
    if (this.props.isHidden)  return null;

    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="center" justify="center" style={styles.modal} animation="slideInUp" duration={500}>
          <Flex direction="row" value={1} style={{borderColor: COLORS.LIGHT_GREY, borderBottomWidth: 1, width: theme.fullWidth}} align="center" justify="center">
            <Touchable onPress={() => this.props.onShare('message')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={MESSAGES} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Message</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => this.props.onShare('mail')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={MAIL} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Email</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => this.props.onShare('whatsapp')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={WHATSAPP} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>WhatsApp</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => this.props.onShare('fb')} >
              <Flex align="center" style={styles.shareAction} >
                <Flex style={styles.iconWrap}>
                  <Image source={FB} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>Messenger</Text>
              </Flex>
            </Touchable>
          </Flex>
          <Flex value={1} style={{alignSelf: 'flex-start'}} direction="row" align="center" justify="center">
            <Touchable onPress={() => this.props.onShare('more')} >
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
        <Flex align="center" justify="center" style={styles.buttonWrap}>
          <Button
            text="Cancel"
            buttonTextStyle={styles.buttonText}
            style={styles.button}
            onPress={this.props.onDismiss}
          />
        </Flex>
      </Flex>
    );
  }
}

SharePopup.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  isHidden: PropTypes.bool,
};

export default SharePopup;
