import React from 'react';
import Button from '../../components/Button';
import { connect } from 'react-redux';

import { backAction } from '../../actions/navigation';

function BackNavButton({ dispatch, ...rest }) {
  return (
    <Button
      text="Back"
      type="header"
      style={{ paddingRight: 10 }}
      {...rest}
      onPress={() => dispatch(backAction())}
    />
  );
}

export default connect()(BackNavButton);
