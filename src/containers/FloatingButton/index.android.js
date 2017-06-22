import React, { Component } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ActionButton from 'react-native-action-button';

import { navigateAction } from '../../actions/navigation';

import { Icon } from '../../components/common';
import theme, { COLORS } from '../../theme';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const ICON_SIZE = 26;

// https://github.com/mastermoo/react-native-action-button
class FloatingButton extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <ActionButton
        backdrop={<View style={{ position: 'absolute', height: deviceHeight, width: deviceWidth, top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)'}} />}
        buttonColor={COLORS.WHITE}
        useNativeFeedback={true}
        icon={<Icon size={ICON_SIZE} name="add" style={{ color: theme.primaryColor }} />}
      >
        <ActionButton.Item
          title="Find and Share Videos"
          onPress={() => dispatch(navigateAction('About'))}
        >
          <Icon size={ICON_SIZE} name="local-movies" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          title="Invite Friends"
          onPress={() => dispatch(navigateAction('About'))}
        >
          <Icon size={ICON_SIZE} name="person-add" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

const styles = StyleSheet.create({
  actionButtonIcon: {
    height: 22,
    color: theme.primaryColor,
  },
});

export default connect()(FloatingButton);
