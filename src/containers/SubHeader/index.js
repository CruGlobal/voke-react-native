import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Button } from '../../components/common';

class SubHeader extends Component {

  render() {
    return (
      <Flex align="center" justify="center" style={styles.container}>
        <Flex direction="row" align="center" justify="center">
          <Flex align="center" value={1}>
            <Button
              text="All"
              type="transparent"
              onPress={() => {}}
            />
          </Flex>
          <Flex align="center" value={1}>
            <Button
              text="Featured"
              type="transparent"
              onPress={() => {}}
            />
          </Flex>
        </Flex>
      </Flex>
    );
  }
}

SubHeader.propTypes = {
  dispatch: PropTypes.func.isRequired, // Redux
};

export default connect()(SubHeader);
