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
    Analytics.screen(Analytics.s.About);
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
              name: t('why'),
              onPress: () =>
                navigatePush('voke.SignUpWelcome', {
                  noSignIn: true,
                }),
            },
            {
              name: t('website'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.VOKE),
            },
            {
              name: t('followFb'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FACEBOOK),
            },
            {
              name: t('tos'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.TERMS),
            },
            {
              name: t('privacy'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.PRIVACY),
            },
            {
              name: t('acknowledgements'),
              onPress: () => navigatePush('voke.Acknowledgements'),
            },
            {
              name: t('version', { build: VERSION_BUILD }),
              onPress: () => {},
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

export default translate('settings')(connect(mapStateToProps, nav)(About));
