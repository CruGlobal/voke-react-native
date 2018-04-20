import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';

import Analytics from '../../utils/analytics';
import styles from './styles';
// import { getMe, facebookLoginAction, anonLogin } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import LOGO from '../../../images/initial_voke.png';

class TryItNowName extends Component {

  state = {
    isLoading: false,
    name: '',
  };

  componentDidMount() {
    Analytics.screen('Try It Now - Name');
  }

  login = () => {
    if (this.state.name) {
      this.setState({ isLoading: true });
      // this.props.dispatch(tryItNowCreate(this.state.name)).then((results) => {
      //   this.setState({ isLoading: false });
      //   // LOG('login results', results);
      //   this.props.navigateResetHome();
      // }).catch(() => {
      //   this.setState({ isLoading: false });
      // });
      setTimeout(() => {
        this.setState({ isLoading: false });
      }, 2000);
    } else {
      Alert.alert('', 'Please enter a name to continue');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <Flex direction="column" align="center" justify="end" style={styles.logoWrapper}>
            <Image resizeMode="contain" source={LOGO} style={styles.imageLogo} />
          </Flex>
          <Flex align="center" style={styles.actions}>
            <SignUpInput
              value={this.state.name}
              onChangeText={(t) => this.setState({ name: t })}
              placeholder="Name"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit={true}
            />
            <Flex style={styles.buttonWrapper}>
              <Button
                text="Sign In"
                disabled={this.state.isLoading}
                buttonTextStyle={styles.signInButtonText}
                style={styles.signInButton}
                onPress={this.login}
              />
            </Flex>
          </Flex>
        </TouchableOpacity>
      </Flex>
    );
  }
}

TryItNowName.propTypes = {
  ...NavPropTypes,
};
const mapStateToProps = (state, { navigation }) => ({
  ...(navigation.state.params || {}),
});

export default connect(mapStateToProps, nav)(TryItNowName);
