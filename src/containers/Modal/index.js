import React, { Component } from 'react';
import { Image } from 'react-native';
import { translate } from 'react-i18next';
import PropTypes from 'prop-types';

import Analytics from '../../utils/analytics';
import CONTACTS_PERMISSION from '../../../images/contacts-permission.png';
import styles from './styles';
import { Flex, Text, Button } from '../../components/common';
import theme from '../../theme';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMore: false,
    };
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleMore = this.handleMore.bind(this);
  }

  componentDidMount() {
    Analytics.screen('Contact Permission Modal');
  }

  dismissModal() {
    this.props.onClose();
  }

  handleDismiss() {
    this.props.onDismiss();
    this.dismissModal();
  }

  handleSelect() {
    this.props.getContacts();
    this.dismissModal();
  }

  handleMore() {
    this.setState({ isMore: true });
  }

  render() {
    const { t } = this.props;
    return (
      <Flex animation="fadeIn" align="center" justify="center" style={styles.container}>
        <Flex direction="column" align="center" justify="center" style={styles.modal}>
          {
            this.state.isMore ? (
              <Flex align="center">
                <Text style={styles.titleMore}>
                  Voke helps you start deeper conversations in two ways:
                </Text>
                <Text style={styles.showMoreDescription}>
                  1. By finding friends in your contacts you can share with.
                  {'\n'}
                  2. To be encouraged when your friends are using Voke.
                </Text>
                {/* <Text style={styles.showMoreDescriptionSmall}>
                  Right now it is not possible to use Voke without access to your contacts.
                  Pinky Promise: Voke does not keep or share your contacts.
                </Text> */}
              </Flex>
            ) : (
              <Flex align="center">
                {
                  !theme.isAndroid ? (
                    <Image source={CONTACTS_PERMISSION} style={styles.permissionImage} />
                  ) : null
                }
                <Text style={styles.title}>Use Address Book?</Text>
                <Text style={styles.description}>Voke uses your contacts to make sharing quick and easy.</Text>
              </Flex>
            )
          }
          <Flex direction="row" align="center" justify="center" style={styles.buttonsWrap}>
            <Flex value={1} align="center" justify="center">
              <Button
                text={this.state.isMore ? t('notNow') : t('tellMeMore')}
                buttonTextStyle={styles.buttonText}
                style={styles.button}
                onPress={this.state.isMore ? this.handleDismiss : this.handleMore}
              />
            </Flex>
            <Flex value={1} align="center" justify="center">
              <Button
                text={this.state.isMore ? t('giveAccess') : t('ok')}
                buttonTextStyle={styles.buttonText2}
                style={styles.button2}
                onPress={this.handleSelect}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

Modal.propTypes = {
  getContacts: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default translate()(Modal);
