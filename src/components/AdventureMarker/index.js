import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Touchable, VokeIcon } from '../../components/common';

// Coordinate helpers
const vCenter = (height, size) => height / 2 - size / 2;
const hCenter = (width, size) => width / 2 - size / 2;
const coord = (width, height, x, y, size) => ({
  top: vCenter(height, size) + y,
  left: hCenter(width, size) + x,
});


class AdventureMarker extends Component {

  getIcon = (c) => {
    if (c['required?']) {
      if (c['completed?']) {
        return ('marker-completed');
      } else if (c.isActive) {
        return ('marker-active');
      } else {
        return ('marker-inactive');
      }
    } else {
      if (c['completed?']) {
        return ('optional-completed');
      } else {
        return ('optional-active');
      }
    }
  }

  render() {
    const { onPress, width, height, challenge } = this.props;

    return (
      <Touchable
        isAndroidOpacity={true}
        onPress={onPress}
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            position: 'absolute',
            width: 50,
            height: 50,
            ...coord(width, height, challenge.point_x, challenge.point_y, 50),
          },
        ]}>
        <VokeIcon name={this.getIcon(challenge)} />
      </Touchable>
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
