import React from 'react';
import { View } from 'react-native';
import theme from 'utils/theme';

interface Props {
  isFilled: boolean;
}

const ProgressDots = React.memo(function ({ isFilled }: Props) {
  return (
    <View
      style={{
        backgroundColor: isFilled ? theme.colors.primary : 'transparent',
        borderColor: isFilled ? theme.colors.primary : theme.colors.grey,
        borderWidth: 1,
        borderStyle: 'solid',
        marginRight: theme.spacing.s,
        width: 10,
        height: 10,
        borderRadius: theme.radius.xxl,
      }}
    />
  );
});

export default ProgressDots;
