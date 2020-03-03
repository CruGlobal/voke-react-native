import React, { Component } from 'react';
import { Linking, View, Alert } from 'react-native';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import { translate } from 'react-i18next';

import { navigateTop, navigatePush, navigateBack } from '../../actions/nav';
import Analytics from '../../utils/analytics';
import SettingsList from '../../components/SettingsList';
import Button from '../../components/Button';
import CONSTANTS from '../../constants';
import Header from '../Header';
import theme from '../../theme';
import st from '../../st';
import Flex from '../../components/Flex';
import { Text } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import { getOldConversations } from '../../actions/auth';

class OldConversations extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = () => {
    const { t, dispatch } = this.props;
    dispatch(getOldConversations())
      .then(() => {
        Alert.alert(t('sentOldConversations'));
        dispatch(navigateBack());
      })
      .catch(() => {
        Alert.alert(t('error.somethingWentWrong'));
      });
  };

  handleCreate = () => {
    this.props.dispatch(
      navigatePush('voke.SignUpAccount', { isFromOldConversations: true }),
    );
  };

  render() {
    const { t, dispatch, me } = this.props;
    return (
      <View style={[st.f1, st.bgBlue]}>
        <Header leftBack={true} light={true} />
        <Flex align="center" justify="center" self="stretch" value={0.5}>
          <Text style={[st.fs3, st.tac, st.ph2, st.pv2]}>
            {me.email
              ? `${t('oldConversationsDescription')} ${me.email}`
              : t('oldConversationsCreateAccount')}
          </Text>
          {me.email ? (
            <Button
              text="Send"
              style={[st.w(st.fullWidth - 40), st.tac, st.aic]}
              onPress={() => this.handleSubmit()}
            />
          ) : (
            <Button
              text="Create Account"
              style={[st.w(st.fullWidth - 40), st.tac, st.aic]}
              onPress={() => this.handleCreate()}
            />
          )}
        </Flex>
      </View>
    );
  }
}

const mapStateToProps = ({ auth }, { navigation }) => ({
  ...(navigation.state.params || {}),
  me: auth.user,
});

export default translate('settings')(
  connect(mapStateToProps)(OldConversations),
);
