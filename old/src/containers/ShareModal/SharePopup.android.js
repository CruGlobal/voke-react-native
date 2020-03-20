import React, { Component } from 'react';
import { ScrollView, Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

// import { COLORS } from '../../theme';
// import MESSAGES from '../../../images/icon-messages.png';
// import WHATSAPP from '../../../images/icon-whatsapp.png';
// import MAIL from '../../../images/icon-mail.png';
import FB from '../../../images/icon-faceboomessenger.png';
import styles from './styles';
import { Flex, Icon, Text, Button, Touchable } from '../../components/common';

class SharePopup extends Component {
  render() {
    const { t, isHidden, onShare, onDismiss } = this.props;
    if (isHidden) return null;

    return (
      <Flex align="center" justify="center" style={styles.container}>
        <ScrollView style={styles.androidModal}>
          <Flex
            direction="column"
            value={1}
            align="start"
            justify="center"
            animation="slideInUp"
            duration={500}
          >
            <Touchable onPress={() => onShare('message')}>
              <Flex
                direction="row"
                align="center"
                style={styles.androidShareRow}
              >
                <Icon
                  type="FontAwesome"
                  style={styles.androidIcons}
                  size={30}
                  name="comment-o"
                />
                <Text style={styles.androidIconText}>{t('message')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('copy')}>
              <Flex
                direction="row"
                align="center"
                style={styles.androidShareRow}
              >
                <Icon
                  style={styles.androidIcons}
                  size={30}
                  name="content-copy"
                />
                <Text style={styles.androidIconText}>{t('copy')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('whatsapp')}>
              <Flex
                direction="row"
                align="center"
                style={styles.androidShareRow}
              >
                <Icon
                  type="FontAwesome"
                  style={[styles.androidIcons, { color: '#009846' }]}
                  size={30}
                  name="whatsapp"
                />
                <Text style={styles.androidIconText}>{t('whatsapp')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('fb')}>
              <Flex
                direction="row"
                align="center"
                style={styles.androidShareRow}
              >
                <Flex
                  align="center"
                  justify="center"
                  style={styles.androidImageWrap}
                >
                  <Image source={FB} style={styles.androidImageStyle} />
                </Flex>
                <Text style={styles.androidIconText}>{t('messenger')}</Text>
              </Flex>
            </Touchable>
            <Button
              text={t('cancel')}
              buttonTextStyle={styles.buttonText}
              style={styles.button}
              onPress={onDismiss}
            />
          </Flex>
        </ScrollView>
      </Flex>
    );
  }
}

SharePopup.propTypes = {
  onDismiss: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  isHidden: PropTypes.bool,
};

export default translate('sharePopup')(SharePopup);
