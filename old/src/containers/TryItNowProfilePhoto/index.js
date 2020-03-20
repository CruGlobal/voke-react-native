import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import styles from './styles';
import { updateMe } from '../../actions/auth';
import ImagePicker from '../../components/ImagePicker';
import Analytics from '../../utils/analytics';
import { navigateBack, navigateResetHome } from '../../actions/nav';

import { Image, View, Flex, Icon, Button, Text } from '../../components/common';
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
    const { dispatch, user } = this.props;
    if (!uri) return;
    const updateData = {
      avatar: {
        fileName: `${user.first_name}_${user.last_name}.png`,
        uri,
      },
    };
    dispatch(updateMe(updateData));
  }

  handleImageChange(data) {
    this.setState({ imageUri: data.uri });
  }

  addProfile() {
    const { dispatch } = this.props;
    const { imageUri, disableSecondClick } = this.state;
    if (imageUri) {
      if (disableSecondClick) {
        return;
      }
      this.uploadImage(imageUri);
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
    const { imageUri } = this.state;
    return (
      <ImagePicker onSelectImage={this.handleImageChange}>
        <Flex align="center" justify="center" style={styles.imageSelect}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
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
    const { t, dispatch, disableBack } = this.props;
    return (
      <View style={styles.container}>
        <SafeArea style={[st.f1, st.bgDarkBlue]} top={[st.bgBlue]}>
          <View style={[st.bgBlue, st.f1]}>
            <Flex style={[st.mt(70)]}>
              <Flex align="center" justify="center">
                <Flex style={styles.chatBubble}>
                  <Text style={styles.chatText}>{t('addPhoto')}</Text>
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
                text={t('continue')}
                type="filled"
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.addProfile}
              />
            </Flex>
          </View>
          {disableBack ? null : (
            <Flex style={[st.abstl]}>
              <SignUpHeaderBack onPress={() => dispatch(navigateBack())} />
            </Flex>
          )}
          <Flex style={[st.abstr, st.pr3, st.pt3]}>
            <Button
              type="transparent"
              text={t('skip')}
              onPress={this.addProfile}
            />
          </Flex>
        </SafeArea>
      </View>
    );
  }
}

TryItNowProfilePhoto.propTypes = {
  disableBack: PropTypes.bool,
};
const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  user: auth.user || {},
});

export default translate('tryItNow')(
  connect(mapStateToProps)(TryItNowProfilePhoto),
);
