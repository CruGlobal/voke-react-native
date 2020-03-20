import React, { Component } from 'react';
import PropTypes from 'prop-types';
import theme, { COLORS } from '../../theme';
import { Flex } from '../common';

class TabBarIndicator extends Component {
  render() {
    return (
      <Flex
        direction="row"
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      >
        <Flex
          value={1}
          style={
            this.props.index === 0
              ? { height: 4, backgroundColor: COLORS.YELLOW }
              : { height: 4, backgroundColor: theme.secondaryColor }
          }
        />
        <Flex
          value={1}
          style={
            this.props.index === 1
              ? { height: 4, backgroundColor: COLORS.YELLOW }
              : { height: 4, backgroundColor: theme.secondaryColor }
          }
        />
      </Flex>
    );
  }
}

TabBarIndicator.propTypes = {
  index: PropTypes.number.isRequired,
};

export default TabBarIndicator;
