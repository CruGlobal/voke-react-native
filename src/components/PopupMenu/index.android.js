import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findNodeHandle, UIManager, Alert } from 'react-native';
import { translate } from 'react-i18next';

import { exists, isFunction } from '../../utils/common';

import { Flex, Touchable, Icon } from '../common';

// Android only component
class PopupMenu extends Component {
  constructor(props) {
    super(props);

    this.handeError = this.handeError.bind(this);
    this.handleItemPress = this.handleItemPress.bind(this);
    this.handlePress = this.handlePress.bind(this);
  }

  handeError() {
    Alert.alert('Error', 'Uh oh! It looks like something went wrong.');
  }

  handleItemPress(e, i) {
    if (exists(i) && i >= 0) {
      const action = this.props.actions[i] || {};
      if (action.onPress && isFunction(action.onPress)) {
        action.onPress();
      }
    }
  }

  handlePress() {
    const actionNames = this.props.actions.map(a => a.name);
    UIManager.showPopupMenu(
      findNodeHandle(this.menu),
      actionNames,
      this.handeError,
      this.handleItemPress,
    );
  }

  render() {
    return (
      <Touchable onPress={this.handlePress} borderless={true}>
        <Flex self="end" style={{ paddingHorizontal: 10 }}>
          <Icon ref={c => (this.menu = c)} name="more-vert" size={28} />
        </Flex>
      </Touchable>
    );
  }
}

PopupMenu.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      onPress: PropTypes.func.isRequired,
    }),
  ).isRequired,
};

export default translate()(PopupMenu);
