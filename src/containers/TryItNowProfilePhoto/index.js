import React, { Component } from 'react';
import { Image, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { updateMe } from '../../actions/auth';
import ImagePicker from '../../components/ImagePicker';
import Analytics from '../../utils/analytics';
import { navigateBack, navigateResetHome } from '../../actions/nav';

import { Flex, Icon, Button, Text } from '../../components/common';
import SafeArea from '../../components/SafeArea';
import VOKE_FIRST_NAME from '../../../images/vokebot_whole.png';
import st from '../../st';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';

class TryItNowProfilePhoto extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUri: null,
      firstName: props.user.first_name,
      lastName: props.user.last_name,
      disableNext: false,
      isLoading: false,
      disableSecondClick: false,
    };

    this.renderImagePicker = this.renderImagePicker.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.addProfile = this.addProfile.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.TryItNowProfilePhoto);
  }

  uploadImage(uri) {
    if (!uri) return;
    const updateData = {
      avatar: {
        fileName: `${this.props.user.first_name}_${
          this.props.user.last_name
        }.png`,
        // fileName: `new_user_${Date.now()}.png`,
        uri,
        // base64: data.imageBinary,
      },
    };
    this.props.dispatch(updateMe(updateData));
  }

  handleImageChange(data) {
    this.setState({ imageUri: data.uri });
    // this.uploadImage(data.uri);
  }

  addProfile() {
    const { t, dispatch } = this.props;
    const { imageUri } = this.state;
    if (imageUri) {
      if (this.state.disableSecondClick) {
        return;
      }
      this.uploadImage(this.state.imageUri);
      this.setState({
        disableNext: false,
        disableSecondClick: true,
        isLoading: false,
      });
      dispatch(navigateResetHome());
      setTimeout(() => this.setState({ disableSecondClick: false }), 1000);
    } else {
      dispatch(navigateResetHome());
    }
  }

  renderImagePicker() {
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          {this.state.imageUri ? (
            <Image source={{ uri: this.state.imageUri }} style={styles.image} />
          ) : (
            <Flex align="center" justify="center">
              <Icon name="camera-alt" style={styles.photoIcon} size={52} />
            </Flex>
          )}
        </Flex>
      </ImagePicker>
    );
  }

  render() {
    const { t } = this.props;
    return (
      <View style={styles.container}>
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <View style={[st.bgBlue, st.f1]}>
            <Flex style={{ marginTop: 70 }}>
              <Flex align="center" justify="center">
                <Flex style={styles.chatBubble}>
                  <Text style={styles.chatText}>
                    Add a photo so your friends can recognize you.
                  </Text>
                </Flex>
                <Flex style={styles.chatTriangle} />
              </Flex>
              <Image
                resizeMode="contain"
                source={VOKE_FIRST_NAME}
                style={styles.imageLogo}
              />
            </Flex>
            <Flex
              value={1}
              align="center"
              justify="center"
              self="stretch"
              style={styles.inputs}
            >
              {this.renderImagePicker()}
            </Flex>
            <Flex value={1} justify="end">
              <Button
                text="Continue"
                type="filled"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.addProfile}
              />
            </Flex>
          </View>
          <Flex style={[st.abstl]}>
            <SignUpHeaderBack
              onPress={() => this.props.dispatch(navigateBack())}
            />
          </Flex>
          <Flex style={[st.abstr, st.pr3, st.pt3]}>
            <Button type="transparent" text="Skip" onPress={this.addProfile} />
          </Flex>
        </SafeArea>
      </View>
    );
  }
}

TryItNowProfilePhoto.propTypes = {
  hideBack: PropTypes.bool,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  user: auth.user || {},
});

export default translate('signUp')(
  connect(mapStateToProps)(TryItNowProfilePhoto),
);
