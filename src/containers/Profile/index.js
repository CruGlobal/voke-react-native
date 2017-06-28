import React, { Component } from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import styles from './styles';
import { Flex, Icon, Button, Text } from '../../components/common';
import ImagePicker from '../../components/ImagePicker';
import { iconsMap } from '../../utils/iconMap';

import VOKE_LOGO from '../../../images/vokeLogo.png';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import theme from '../../theme'

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: iconsMap['ios-arrow-back'], // for icon button, provide the local image asset name
    }],
  };
}

const user = {
  fullName: 'Ben Gauthier',
  email: 'ben@ben.com',
};

class Profile extends Component {

  static navigatorStyle = {
    navBarNoBorder: true,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
      editName: false,
      editEmail: false,
      editPassword: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.renderEditName = this.renderEditName.bind(this);
    this.renderEditEmail = this.renderEditEmail.bind(this);
    this.renderEditPassword = this.renderEditPassword.bind(this);
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

  renderEditName() {
    return (
      <Flex>
        <Text style={{color: 'black'}}>EDIT NAME</Text>
      </Flex>
    );
  }

  renderEditEmail() {
    return (
      <Flex>
        <Text style={{color: 'black'}}>EDIT EMAIL</Text>
      </Flex>
    );
  }

  renderEditPassword() {
    return (
      <Flex>
        <Text style={{color: 'black'}}>EDIT PASSWORD</Text>
      </Flex>
    );
  }

  render() {
    const { editName, editEmail, editPassword } = this.state;

    return (
      <Flex direction="column" style={styles.container}>
        <Flex value={1} align="center" justify="center" style={styles.imageWrapper}>
          {this.renderImagePicker()}
        </Flex>
        <Flex value={2} style={styles.infoWrapper}>
          <Button
            text={user.fullName}
            icon="person"
            iconStyle={styles.inputIcon}
            buttonTextStyle={styles.buttonText}
            style={styles.inputButton}
            onPress={() => this.setState({ editName: !editName, editEmail: false, editPassword: false })}
          />
          {
            editName ? this.renderEditName() : null
          }
          <Button
            text={user.email}
            icon="mail-outline"
            iconStyle={styles.inputIcon}
            buttonTextStyle={styles.buttonText}
            style={styles.inputButton}
            onPress={() => this.setState({ editEmail: !editEmail, editName: false, editPassword: false })}
          />
          {
            editEmail ? this.renderEditEmail() : null
          }
          <Button
            text="**********"
            icon="security"
            iconStyle={styles.inputIcon}
            buttonTextStyle={styles.buttonText}
            style={styles.inputButton}
            onPress={() => this.setState({ editPassword: !editPassword, editName: false, editEmail: false })}
          />
          {
            editPassword ? this.renderEditPassword() : null
          }
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
