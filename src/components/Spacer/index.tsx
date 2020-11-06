import React from 'react';
import { View } from 'react-native';
type Props = {
  size?: 's' | 'm' | 'l' | 'xl' | 'xxl';
  [x: string]: any;
};

import theme from '../../theme';

const Spacer = ({ size = 'm', ...rest }: Props): React.ReactElement => {
  return (
    <View
      style={{
        minHeight: theme.spacing[size],
      }}
      {...rest}
    />
  );
};

export default Spacer;
