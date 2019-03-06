import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import PropTypes from 'prop-types';
import { VokeIcon, Text, Flex } from '../../components/common';

// Coordinate helpers
const vCenter = (height, size) => height / 2 - size / 2;
const hCenter = (width, size) => width / 2 - size / 2;
const coord = (width, height, x, y, size) => ({
  top: vCenter(height, size) + y,
  left: hCenter(width, size) + x,
});

class AdventureMarker extends Component {
  getIcon = c => {
    if (c['required?']) {
      if (c['completed?']) {
        return 'marker-completed';
      } else if (c.isActive) {
        return 'marker-active';
      } else {
        return 'marker-inactive';
      }
    } else {
      if (c['completed?']) {
        return 'optional-completed';
      } else if (c['active?']) {
        return 'optional-active';
      } else {
        return 'optional-inactive';
      }
    }
  };

  render() {
    const { onPress, width, height, challenge } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Flex
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
            ...coord(width, height, challenge.point_x, challenge.point_y, 100),
          }}
        >
          <VokeIcon type="image" name={this.getIcon(challenge)} />
          {challenge['required?'] && !challenge['completed?'] ? (
            <Text
              style={{
                position: 'absolute',
                top: 22,
                fontSize: 15,
                textAlign: 'center',
                opacity: challenge.isActive ? 1 : 0.5,
              }}
            >
              {challenge.position}
            </Text>
          ) : null}
        </Flex>
      </TouchableWithoutFeedback>
    );
  }
}

AdventureMarker.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onPress: PropTypes.func.isRequired,
  challenge: PropTypes.object.isRequired,
};

export default AdventureMarker;
