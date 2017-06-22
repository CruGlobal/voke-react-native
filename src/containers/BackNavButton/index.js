import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';

import { backAction } from '../../actions/navigation';

function BackNavButton({ dispatch, ...rest }) {
  return (
    <Button
      text=""
      type="header"
      icon=""
      style={{ paddingRight: 10 }}
      iconStyle={{}}
      {...rest}
      onPress={() => dispatch(backAction())}
    />
  );
}

export default connect()(BackNavButton);
