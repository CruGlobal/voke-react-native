import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { translate } from 'react-i18next';

import { navigateTop, navigatePush } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';
import theme from '../../theme';
import { buildTrackingObj } from '../../utils/common';
import st from '../../st';

const VERSION_BUILD = DeviceInfo.getReadableVersion();

class About extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.About);
  }

  handleLink = url => {
    Linking.openURL(url);
  };

  render() {
    const { t, dispatch } = this.props;
    return (
      <View style={[st.f1]}>
        <Header
          right={
            theme.isAndroid ? (
              undefined
            ) : (
              <Button
                type="transparent"
                text={t('done')}
                buttonTextStyle={{ padding: 10, fontSize: 16 }}
                onPress={() => dispatch(navigateTop())}
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
                dispatch(
                  navigatePush('voke.SignUpWelcome', {
                    noSignIn: true,
                    trackingObj: buildTrackingObj('about', 'whyvoke'),
                  }),
                ),
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
              onPress: () => dispatch(navigatePush('voke.Acknowledgements')),
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

export default translate('settings')(connect()(About));
