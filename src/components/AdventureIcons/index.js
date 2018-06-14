import React, { Component } from 'react';
import { Image, Alert, View } from 'react-native';
import PropTypes from 'prop-types';
import { Touchable, Flex } from '../../components/common';
import ADVENTURE_2 from '../../../images/adventure2.png';
import ADVENTURE_3 from '../../../images/adventure3.png';
import LOCK from '../../../images/lockedAdventure.png';
import COMPLETE from '../../../images/adventureComplete.png';


class AdventureIcons extends Component {

  constructor(props) {
    super(props);
    this.state = {
      adArray: props.adventures,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({adArray: nextProps.adventures});
  }

  handlePress =(target) => {
    this.props.onChangeAdventure(target);
  }

  handleLockedPress = () => {
    Alert.alert('This adventure is locked until you complete the current adventure.');
  }

  renderAdventures = (ads) => {
    const lng = ads.length;
    return (
      ads.map((i, index) =>
        <Touchable key={i.adventure_id} onPress={() => this.handlePress(i)}>
          <View style={{marginHorizontal: 5, marginVertical: 5}}>
            <Image source={{ uri: `${i.icon.medium}`}} style={{height: 48, width: 48}} />
            {
              index < lng - 1 ? (
                <Image source={COMPLETE} style={{position: 'absolute', bottom: 0, right: 0}} />
              ) : null
            }
          </View>
        </Touchable>
      )
    );
  }

  render() {
    return (
      <Flex direction="column" style={{position: 'absolute', top: 5, right: 5, zIndex: 100000}}>
        {this.renderAdventures(this.props.adventures)}
        {
          this.props.adventures.length > 1 ? (
            <Touchable onPress={this.handleLockedPress}>
              <View style={{marginHorizontal: 5, marginVertical: 5}}>
                <Image source={ADVENTURE_3} />
                <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
              </View>
            </Touchable>
          ) : (
            <View>
              <Touchable onPress={this.handleLockedPress}>
                <View style={{marginHorizontal: 5, marginVertical: 5}}>
                  <Image source={ADVENTURE_3} />
                  <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
                </View>
              </Touchable>
              <Touchable onPress={this.handleLockedPress}>
                <View style={{marginHorizontal: 5, marginVertical: 5}}>
                  <Image source={ADVENTURE_2} />
                  <Image source={LOCK} style={{position: 'absolute', bottom: 0, right: 0}} />
                </View>
              </Touchable>
            </View>
          )
        }
      </Flex>
    );
  }
}

AdventureIcons.propTypes = {
  adventures: PropTypes.array.isRequired,
  onChangeAdventure: PropTypes.func.isRequired,
};

export default AdventureIcons;
