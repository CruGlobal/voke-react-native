import React, { Component } from 'react';
import { Linking, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import nav, { NavPropTypes } from '../../actions/nav';
import Analytics from '../../utils/analytics';

import { vokeIcons } from '../../utils/iconMap';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';

const VERSION_BUILD = DeviceInfo.getReadableVersion();

class About extends Component {

  constructor(props) {
    super(props);
    this.handleLink = this.handleLink.bind(this);
  }


  componentDidMount() {
    Analytics.screen('About');
  }

  handleLink(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            CONSTANTS.IS_ANDROID ? undefined : (
              <Button
                type="transparent"
                text="Done"
                buttonTextStyle={{ padding: 10, fontSize: 16 }}
                onPress={() => {
                  // Close out of the settings by going back 2 times
                  this.props.navigateBack();
                  this.props.navigateBack();
                }}
              />
            )
          }
          leftBack={true}
          title="About"
          light={true}
        />
        <SettingsList
          items={[
            {
              name: 'Visit Voke Website',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.VOKE),
            },
            {
              name: 'Follow us on Facebook',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FACEBOOK),
            },
            {
              name: 'Terms of Service',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.TERMS),
            },
            {
              name: 'Privacy Policy',
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY),
            },
            {
              name: `Version: ${VERSION_BUILD}`,
            },
          ]}
        />
      </View>
    );
  }
}

About.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(About);
