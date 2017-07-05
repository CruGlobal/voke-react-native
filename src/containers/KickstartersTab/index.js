import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import nav, { NavPropTypes } from '../../actions/navigation_new';

import styles from './styles';
import { Flex, Text } from '../../components/common';

class KickstartersTab extends Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <Flex self="stretch" align="center" justify="center" value={1} style={styles.content}>
          <Text style={{ fontSize: 24 }}>The odds of you explained...</Text>
        </Flex>
      </ScrollView>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
};

export default connect(null, nav)(KickstartersTab);
