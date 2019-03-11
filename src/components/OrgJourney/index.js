import React, { Component } from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';

import styles from './styles';
import { Flex, Text, Touchable } from '../common';

class OrgJourney extends Component {
  press = () => this.props.onPress(this.props.item);

  render() {
    const { item } = this.props;

    return (
      <Touchable onPress={this.press}>
        <Flex align="center" justify="center" style={styles.container}>
          {/* source={{
              uri:
                'https://www.tripsavvy.com/thmb/qSHJzk19KBq_LAuGDTriGhElfL8=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/GlacierNationalParkMontana-FengWeiPhotography-Getty-5711489a3df78c3fa2b5d2a2.jpg',
            }} */}
          <Image
            source={{ uri: item.image.medium }}
            style={[styles.absolute, styles.image]}
          />
          <View style={[styles.absolute, styles.overlay]} />
          <Text style={styles.title}>{(item.name || '').toUpperCase()}</Text>
          <Text style={styles.slogan}>{item.slogan}</Text>
        </Flex>
      </Touchable>
    );
  }
}

OrgJourney.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func,
};

export default OrgJourney;
