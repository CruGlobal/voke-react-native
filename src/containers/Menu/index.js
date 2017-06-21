import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { navigateAction } from '../../actions/navigation';

import { Text } from '../../components/common';
import SettingsList from '../../components/SettingsList';

class Menu extends Component {
  static navigationOptions = {
    title: 'Menu',
  };
  render() {
    const { dispatch } = this.props;
    return (
      <View style={styles.container}>
        <SettingsList
          items={[
            { name: 'Profile', onPress: () => dispatch(navigateAction('Home')) },
            { name: 'About', onPress: () => dispatch(navigateAction('Home')) },
            { name: 'Write a Review', onPress: () => dispatch(navigateAction('Home')) },
            { name: 'Acknowledgements', onPress: () => dispatch(navigateAction('Home')) },
            { name: 'Help', onPress: () => dispatch(navigateAction('Home')) },
            { name: 'Sign Out', onPress: () => dispatch(navigateAction('Home')) },
          ]}
        />
      </View>
    );
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(Menu);
