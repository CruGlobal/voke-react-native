import React, { Component } from 'react';
import { Linking, View } from 'react-native';
import { connect } from 'react-redux';
import Communications from 'react-native-communications';
import { translate } from 'react-i18next';

import { navigateTop } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';
import theme from '../../theme';

const EMAIL = ['support@vokeapp.com'];
const REPORT_TITLE = 'I would like to report a user';
const EMAIL_US_TITLE = 'Email to Voke Support';
const FEATURE_REQUEST_TITLE = 'Feature Request for Voke';

class Help extends Component {
  componentDidMount() {
    Analytics.screen(Analytics.s.Help);
  }

  handleLink = url => {
    Linking.openURL(url);
  };

  handleShare = c => {
    let title;
    if (c === 'feature') {
      title = FEATURE_REQUEST_TITLE;
    } else if (c === 'report') {
      title = REPORT_TITLE;
    } else {
      title = EMAIL_US_TITLE;
    }
    Communications.email(EMAIL, null, null, title, null);
  };

  render() {
    const { t, dispatch } = this.props;
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
                onPress={() => dispatch(navigateTop())}
              />
            )
          }
          leftBack={true}
          title={t('title.help')}
          light={true}
        />
        <SettingsList
          items={[
            {
              name: t('visitWebsite'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.HELP),
            },
            {
              name: t('visitFAQ'),
              onPress: () => this.handleLink(CONSTANTS.WEB_URLS.FAQ),
            },
            {
              name: t('featureRequest'),
              onPress: () => this.handleShare('feature'),
            },
            {
              name: t('report'),
              onPress: () => this.handleShare('report'),
            },
            {
              name: t('email'),
              onPress: () => this.handleShare('emailUs'),
            },
          ]}
        />
      </View>
    );
  }
}

export default translate('settings')(connect()(Help));
