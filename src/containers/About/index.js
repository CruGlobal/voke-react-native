import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { translate } from 'react-i18next';

import nav, { NavPropTypes } from '../../actions/nav';
import Analytics from '../../utils/analytics';

import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';
import theme from '../../theme';

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
    const { t, navigateBack, navigatePush } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          right={
            theme.isAndroid ? (
              undefined
            ) : (
              <Button
                type="transparent"
                text={t('done')}
                buttonTextStyle={{ padding: 10, fontSize: 16 }}
                onPress={() => {
                  // Close out of the settings by going back 2 times
                  navigateBack();
                  navigateBack();
                }}
              />
            )
          }
          leftBack={true}
          title={t('title.about')}
          light={true}
        />
        <SettingsList
          items={[
            {
              name: 'Why Voke?',
              onPress: () =>
                navigatePush('voke.SignUpWelcome', {
                  noSignIn: true,
                }),
            },
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
              name: 'Acknowledgements',
              onPress: () => navigatePush('voke.Acknowledgements'),
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

export default translate()(
  connect(
    mapStateToProps,
    nav,
  )(About),
);
