import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import {COLORS, DEFAULT} from '../../theme';
import MESSAGES from '../../../images/icon-messages.png';
import WHATSAPP from '../../../images/icon-whatsapp.png';
import MAIL from '../../../images/icon-mail.png';
import FB from '../../../images/icon-faceboomessenger.png';
import styles from './styles';
import { Flex, Icon, Text, Button, Touchable } from '../../components/common';

class SharePopup extends Component {
  render() {
    if (this.props.isHidden) {
      return null;
    } else {
      return (
        <Flex align="center" justify="center" style={styles.container}>
          <ScrollView style={styles.androidModal}>
            <Flex direction="column" value={1} align="center" justify="center">
              <Touchable onPress={() => this.props.onShare('message')} >
                <Flex direction="row" align="center" >
                  <Icon type="FontAwesome" style={styles.androidIcons} size={30} name="comment-o"  />
                  <Text style={styles.iconText}>Message</Text>
                </Flex>
              </Touchable>
              <Touchable onPress={() => this.props.onShare('mail')} >
                <Flex direction="row" align="center" >
                  <Icon type="FontAwesome" style={styles.androidIcons} size={30} name="mail" />
                  <Text style={styles.iconText}>Email</Text>
                </Flex>
              </Touchable>
              <Touchable onPress={() => this.props.onShare('whatsapp')} >
                <Flex direction="row" align="center" >
                  <Icon type="FontAwesome" style={styles.androidIcons} size={30} name="whatsapp" />
                  <Text style={styles.iconText}>WhatsApp</Text>
                </Flex>
              </Touchable>
              <Touchable onPress={() => this.props.onShare('fb')} >
                <Flex direction="row" align="center" >
                  <Icon type="FontAwesome" style={styles.androidIcons} size={30} name="facebook"  />
                  <Text style={styles.iconText}>Messenger</Text>
                </Flex>
              </Touchable>
              <Touchable onPress={() => this.props.onShare('more')} >
                <Flex direction="row" align="center" >
                  <Icon style={styles.androidIcons} size={30} name="more-horiz" />
                  <Text style={styles.iconText}>More</Text>
                </Flex>
              </Touchable>
              <Button
                text="Cancel"
                buttonTextStyle={styles.buttonText}
                style={styles.button}
                onPress={this.props.onDismiss}
              />
            </Flex>
          </ScrollView>
        </Flex>
      );
    }
  }
}

SharePopup.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  isHidden: PropTypes.bool,
};

export default SharePopup;
