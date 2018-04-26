import React, { Component } from 'react';
import { Image, TouchableOpacity, Keyboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { CREATE_ANON_USER } from '../../constants';

import Analytics from '../../utils/analytics';
import styles from './styles';
import { createAccountAction, updateMe } from '../../actions/auth';
import nav, { NavPropTypes } from '../../actions/nav';
import { Flex, Button } from '../../components/common';
import SignUpInput from '../../components/SignUpInput';
import SignUpHeaderBack from '../../components/SignUpHeaderBack';
import VOKE_FIRST_NAME from '../../../images/voke_firstname.png';

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
      let nameData = {
        me: {
          first_name: this.state.name,
        },
      };
      this.props.dispatch(createAccountAction(null, null, true)).then((results) => {
        LOG('login results', results);
        this.props.dispatch({ type: CREATE_ANON_USER });
        this.props.dispatch(updateMe(nameData)).then(()=>{
          this.setState({ isLoading: false });
          this.props.navigateResetHome();
        }).catch(() => {
          this.setState({ isLoading: false });
          Alert.alert('', 'There was an error, please try again');
        });
      }).catch(() => {
        this.setState({ isLoading: false });
      });
    } else {
      Alert.alert('', 'Please enter a name to continue');
    }
  }

  render() {
    return (
      <Flex style={styles.container} value={1} align="center">
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <SignUpHeaderBack onPress={() => this.props.navigateBack()} />
          <Flex value={1} direction="column" align="center" justify="end" style={styles.logoWrapper}>
            <Image resizeMode="contain" source={VOKE_FIRST_NAME} style={styles.imageLogo} />
          </Flex>
          <Flex align="center" justify="start" value={4} align="center" style={styles.actions}>
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
                text="Next"
                type="filled"
                disabled={this.state.isLoading || !this.state.name}
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
