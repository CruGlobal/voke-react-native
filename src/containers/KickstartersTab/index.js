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
      <Text style={{ fontSize: 24, color: 'white' }}>The odds of you explained...</Text>
    );
  }
}

KickstartersTab.propTypes = {
  ...NavPropTypes,
  onSelect: PropTypes.func.isRequired,
};

export default connect(null, nav)(KickstartersTab);
