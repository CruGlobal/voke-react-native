import { ReactText } from 'react';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
  ...theme,
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingOption: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.l,
  },
  iconGlobe: {
    color: theme.colors.white,
    marginRight: 6,
  },

  langOption: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 14,
    flexDirection: 'row',
    width: '100%',
  },
  langOptionText: {
    color: theme.colors.secondary,
    fontSize: theme.fontSizes.m,
  },
  langOptionCheckmark: {
    color: theme.colors.secondary,
    alignSelf: 'center',
    paddingLeft: theme.spacing.s,
    opacity: 0.5,
  },
};

export default styles;
