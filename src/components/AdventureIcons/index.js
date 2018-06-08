import React, { Component } from 'react';
import { Image, Alert, View } from 'react-native';
import PropTypes from 'prop-types';
import { Touchable, Flex } from '../../components/common';
import ADVENTURE_1 from '../../../images/adventure1.png';
import ADVENTURE_2 from '../../../images/adventure2.png';
import ADVENTURE_3 from '../../../images/adventure3.png';
import LOCK from '../../../images/lockedAdventure.png';

class AdventureIcons extends Component {

  handlePress =() => {
    if (this.props.adventures[0].state !== 'completed') {
      Alert.alert('This challenge is locked!');
    } else {
      Alert.alert('Coming Soon');
    }
  }

  renderAdventures = () => {
    return (
      this.props.adventures.map((i) =>
        <Touchable onPress={()=>{}}>
          <View style={{marginHorizontal: 5, marginVertical: 5}}>
            <Image source={ADVENTURE_1} />
          </View>
        </Touchable>
      )
    );
  }

  render() {
    return (
      <Flex direction="column" style={{position: 'absolute', top: 5, right: 5, zIndex: 100000}}>
        {
          this.props.adventures.length > 2 ? (
            <Touchable onPress={this.handlePress}>
              <View style={{marginHorizontal: 5, marginVertical: 5}}>
                <Image source={ADVENTURE_3} />
                <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
              </View>
            </Touchable>
          ) : (
            <View>
              <Touchable onPress={this.handlePress}>
                <View style={{marginHorizontal: 5, marginVertical: 5}}>
                  <Image source={ADVENTURE_3} />
                  <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
                </View>
              </Touchable>
              <Touchable onPress={this.handlePress}>
                <View style={{marginHorizontal: 5, marginVertical: 5}}>
                  <Image source={ADVENTURE_2} />
                  {
                    this.props.adventures[0] && this.props.adventures[0].state !== 'completed' ? (
                      <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
                    ) : null
                  }
                </View>
              </Touchable>
            </View>
          )
        }
        {this.renderAdventures()}
      </Flex>
    );
  }
}

AdventureIcons.propTypes = {
  adventures: PropTypes.array.isRequired,
};

export default AdventureIcons;
