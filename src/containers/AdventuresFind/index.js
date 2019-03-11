import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import styles from './styles';
import { Text } from '../../components/common';

class AdventuresFind extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Adventures Find!</Text>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  me: auth.user,
});

export default translate()(connect(mapStateToProps)(AdventuresFind));
