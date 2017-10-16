import React, { Component } from 'react';
import { Linking } from 'react-native';
import { connect } from 'react-redux';
import nav, { NavPropTypes } from '../../actions/navigation_new';
import Analytics from '../../utils/analytics';

import theme from '../../theme';
import SettingsList from '../../components/SettingsList';
import { vokeIcons } from '../../utils/iconMap';
import CONSTANTS from '../../constants';

function setButtons() {
  return {
    leftButtons: [{
      id: 'back', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      icon: vokeIcons['back'], // for icon button, provide the local image asset name
    }],
  };
}

class Acknowledgements extends Component {
  static navigatorStyle = {
    tabBarHidden: true,
    screenBackgroundColor: theme.lightBackgroundColor,
    navBarBackgroundColor: theme.backgroundColor,
    navBarTextColor: theme.textColor,
    navBarButtonColor: theme.textColor,
  };

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.handleLink = this.handleLink.bind(this);
  }

  componentWillMount() {
    this.props.navigator.setButtons(setButtons());
  }

  componentDidMount() {
    Analytics.screen('Acknowledgements');
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'back') {
        this.props.navigateBack();
      }
    }
  }

  render() {
    return (
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
            name: 'react-native-animatable',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_ANIMATABLE),
          },
          {
            name: 'react-native-communications',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_COMMUNICATIONS),
          },
          {
            name: 'react-native-contacts',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_CONTACTS),
          },
          {
            name: 'react-native-device-info',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_DEVICE_INFO),
          },
          {
            name: 'react-native-fabric',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FABRIC),
          },
          {
            name: 'react-native-fbsdk',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FBSDK),
          },
          {
            name: 'react-native-fetch-blob',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_FETCH_BLOB),
          },
          {
            name: 'react-native-google-analytics-bridge',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_GOOGLE_ANALYTICS),
          },
          {
            name: 'react-native-image-crop-picker',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_CROP_PICKER),
          },
          {
            name: 'react-native-image-picker',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_IMAGE_PICKER),
          },
          {
            name: 'react-native-navigation',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_NAVIGATION),
          },
          {
            name: 'react-native-notifications',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_NOTIFICATIONS),
          },
          {
            name: 'react-native-spinkit',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_SPINKIT),
          },
          {
            name: 'react-native-swipe-list-view',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_SWIPE_LIST_VIEW),
          },
          {
            name: 'react-native-vector-icons',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_VECTOR_ICONS),
          },
          {
            name: 'react-redux',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_REDUX),
          },
          {
            name: 'rn-viewpager',
            onPress: () => this.handleLink(CONSTANTS.WEB_URLS.REACT_NATIVE_VIEW_PAGER),
          },
        ]}
      />
    );
  }
}

Acknowledgements.propTypes = {
  ...NavPropTypes,
};

export default connect(null, nav)(Acknowledgements);
