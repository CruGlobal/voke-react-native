import React, { Component } from 'react';
import { Linking, Image } from 'react-native';
import styles from './styles'
import { Flex, Text, Icon } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { iconsMap } from '../../utils/iconMap'

function setButtons() {
  return {
    leftButtons: [{
      title: 'Menu', // for a textual button, provide the button title (label)
      id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
    }],
  };
}

class Profile extends Component {

  static navigatorStyle = {
    navBarNoBorder: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageSource: null,
      imageData: null,
    };

    this.handleLink = this.handleLink.bind(this);
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }
  handleLink(url) {
    Linking.openURL(url);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  renderImagePicker() {
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          <Image source={require('../../../images/vokeLogo.png')}>
          </Image>
          <Flex align="center" justify="center" style={styles.imageCover}>
            <Icon name="camera-alt" style={styles.imageIcon} size={30} />
          </Flex>
        </Flex>
      </ImagePicker>
    );
  }

  handleImageChange(data) {
    this.setState({
      imageSource: null,
      imageData: data,
    });
  }

  render() {
    return (
      <Flex direction="column" style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.imageWrapper}>
          {this.renderImagePicker()}
        </Flex>
        <Flex value={2} style={styles.infoWrapper}>

        </Flex>
      </Flex>
    );
  }
}

export default Profile;
