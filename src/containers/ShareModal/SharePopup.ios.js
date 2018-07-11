import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
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
    const { t, isHidden, onShare, onDismiss } = this.props;
    if (isHidden) return null;

    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex
          direction="column"
          align="center"
          justify="center"
          style={styles.modal}
          animation="slideInUp"
          duration={500}
        >
          <Flex
            direction="row"
            value={1}
            style={{
              borderColor: COLORS.LIGHT_GREY,
              borderBottomWidth: 1,
              width: theme.fullWidth,
            }}
            align="center"
            justify="center"
          >
            <Touchable onPress={() => onShare('message')}>
              <Flex align="center" style={styles.shareAction}>
                <Flex style={styles.iconWrap}>
                  <Image source={MESSAGES} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>{t('message')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('mail')}>
              <Flex align="center" style={styles.shareAction}>
                <Flex style={styles.iconWrap}>
                  <Image source={MAIL} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>{t('email')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('whatsapp')}>
              <Flex align="center" style={styles.shareAction}>
                <Flex style={styles.iconWrap}>
                  <Image source={WHATSAPP} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>{t('whatsapp')}</Text>
              </Flex>
            </Touchable>
            <Touchable onPress={() => onShare('fb')}>
              <Flex align="center" style={styles.shareAction}>
                <Flex style={styles.iconWrap}>
                  <Image source={FB} style={styles.iconStyle} />
                </Flex>
                <Text style={styles.iconText}>{t('messenger')}</Text>
              </Flex>
            </Touchable>
          </Flex>
          <Flex
            value={1}
            style={{ alignSelf: 'flex-start' }}
            direction="row"
            align="center"
            justify="center"
          >
            <Touchable onPress={() => onShare('more')}>
              <Flex align="center" style={styles.shareAction}>
                <Flex align="center" style={styles.iconWrap}>
                  <Flex
                    align="center"
                    justify="center"
                    style={[
                      styles.iconStyle,
                      { backgroundColor: COLORS.WHITE },
                    ]}
                  >
                    <Icon
                      style={{ color: COLORS.CHARCOAL }}
                      size={30}
                      name="more-horiz"
                    />
                  </Flex>
                </Flex>
                <Text style={styles.iconText}>{t('more')}</Text>
              </Flex>
            </Touchable>
          </Flex>
        </Flex>
        <Flex align="center" justify="center" style={styles.buttonWrap}>
          <Button
            text={t('cancel')}
            buttonTextStyle={styles.buttonText}
            style={styles.button}
            onPress={onDismiss}
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

export default translate('sharePopup')(SharePopup);
