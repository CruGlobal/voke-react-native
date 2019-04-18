import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { Flex, Text, Touchable } from '../../components/common';
import st from '../../st';
import SafeArea from '../../components/SafeArea';

const DEFAULT_TIMEOUT = 5000;

class ToastManager extends Component {
  state = { isVisible: false, text: '' };
  timeout = null;

  componentDidUpdate(prevProps) {
    const {
      toastProps: { text, timeout },
    } = this.props;
    if (!prevProps.toastProps.text && text) {
      this.setState({ isVisible: true, text });
      this.timeout = setTimeout(() => {
        // TODO: Animate fade out
        this.setState({ isVisible: false, text: '' });
      }, timeout || DEFAULT_TIMEOUT);
    }
  }

  close = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible, text } = this.state;
    if (!isVisible) {
      return null;
    }
    return (
      <Flex style={[st.abs, st.top(0)]} animation="fadeIn">
        <SafeArea style={[st.fw100]}>
          <Touchable style={[st.p4, st.bgOrange]} onPress={this.close}>
            <Flex align="center" justify="center">
              <Text style={[st.white, st.fs4, st.tac]}>{text}</Text>
            </Flex>
          </Touchable>
        </SafeArea>
      </Flex>
    );
  }
}

const mapStateToProps = ({ overlays }) => ({
  toastProps: overlays.toastProps || {},
});
export default translate('overlays')(connect(mapStateToProps)(ToastManager));
