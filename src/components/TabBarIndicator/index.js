import React, { Component } from 'react';
import PropTypes from 'prop-types';
import theme, {COLORS} from '../../theme';
import { Flex } from '../common';

class TabBarIndicator extends Component {
  render() {
    return (
      <Flex direction="row">
        <Flex value={1} style={this.props.index === 0 ? {height: 4, backgroundColor: COLORS.YELLOW} : {height: 4, backgroundColor: theme.secondaryColor}}></Flex>
        <Flex value={1} style={this.props.index === 1 ? {height: 4, backgroundColor: COLORS.YELLOW} : {height: 4, backgroundColor: theme.secondaryColor}}></Flex>
      </Flex>
    );
  }
}

TabBarIndicator.propTypes = {
  index: PropTypes.number.isRequired,
};

export default TabBarIndicator;
