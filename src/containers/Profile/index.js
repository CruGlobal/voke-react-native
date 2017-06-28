import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import { Flex, Icon } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { iconsMap } from '../../utils/iconMap';

import VOKE_LOGO from '../../../images/vokeLogo.png';
import nav, { NavPropTypes } from '../../actions/navigation_new';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
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
      imageUri: null,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  handleImageChange(data) {
    // TODO: Make API call to update image
    this.setState({
      imageUri: data.uri,
    });
  }

  renderImagePicker() {
    const image = this.state.imageUri ? { uri: this.state.imageUri } : VOKE_LOGO;
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          <Image source={image}>
          </Image>
          <Flex align="center" justify="center" style={styles.imageCover}>
            <Icon name="camera-alt" style={styles.imageIcon} size={30} />
          </Flex>
        </Flex>
      </ImagePicker>
    );
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


// Check out actions/navigation_new.js to see the prop types and mapDispatchToProps
Profile.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Profile);