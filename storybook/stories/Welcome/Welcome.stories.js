import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { storiesOf } from '@storybook/react-native';
import Button from 'components/Button';

storiesOf('Welcome', module).add('to Storybook', () => <Button />);
