import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import nav, { NavPropTypes } from '../../actions/nav';
import Analytics from '../../utils/analytics';

import SettingsList from '../../components/SettingsList';
import Header from '../Header';
import CONSTANTS from '../../constants';

class Acknowledgements extends Component {
  constructor(props) {
    super(props);

    this.handleLink = this.handleLink.bind(this);
  }

  componentDidMount() {
    Analytics.screen(Analytics.s.Acknowledgements);
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    const { t } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          leftBack={true}
          title={t('title.acknowledgements')}
          light={true}
        />
        <SettingsList
          items={[
            {
              name: 'Crashlytics',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.CRASHLYTICS),
            },
            {
              name: 'React Native',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE),
            },
            {
              name: 'Firebase',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FIREBASE),
            },
            {
              name: 'react-native-animatable',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_ANIMATABLE),
            },
            {
              name: 'react-native-communications',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_COMMUNICATIONS),
            },
            {
              name: 'react-native-contacts',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_CONTACTS),
            },
            {
              name: 'react-native-device-info',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_DEVICE_INFO),
            },
            {
              name: 'react-native-fabric',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FABRIC),
            },
            {
              name: 'react-native-fbsdk',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FBSDK),
            },
            {
              name: 'react-native-fetch-blob',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FETCH_BLOB),
            },
            {
              name: 'react-native-google-analytics-bridge',
              onPress: () =>
                this.handleLink(
                  CONSTANTS.WEB_URLS.REACT_NATIVE_GOOGLE_ANALYTICS,
                ),
            },
            {
              name: 'react-native-image-crop-picker',
              onPress: () =>
                this.handleLink(
                  CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_CROP_PICKER,
                ),
            },
            {
              name: 'react-native-image-picker',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_PICKER),
            },
            {
              name: 'react-navigation',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NAVIGATION),
            },
            {
              name: 'react-native-push-notifications',
              onPress: () =>
                this.handleLink(
                  CONSTANTS.WEB_URLS.REACT_NATIVE_PUSH_NOTIFICATIONS,
                ),
            },
            {
              name: 'react-native-spinkit',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_SPINKIT),
            },
            {
              name: 'react-native-swipe-list-view',
              onPress: () =>
                this.handleLink(
                  CONSTANTS.WEB_URLS.REACT_NATIVE_SWIPE_LIST_VIEW,
                ),
            },
            {
              name: 'react-native-vector-icons',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_VECTOR_ICONS),
            },
            {
              name: 'react-redux',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_REDUX),
            },
            {
              name: 'rn-viewpager',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_VIEW_PAGER),
            },
            {
              name: 'react-native-firebase',
              onPress: () =>
                this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FIREBASE),
            },
          ]}
        />
      </View>
    );
  }
}

Acknowledgements.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(Acknowledgements),
);
