import { ReactText } from 'react';
import { Platform } from 'react-native';
import theme from 'utils/theme';
import ui from 'utils/ui';

const styles: { [key: string]: any } = {
	...theme,
	toggle: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	dropdown: {
		position: 'absolute',
		backgroundColor: 'white',
		borderRadius: 4,

		// Shadow
		...Platform.select({
			ios: {
				shadowColor: 'black',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.14,
				shadowRadius: 2,
			},
			android: {
				elevation: 8,
			},
		}),
	},

	option: {
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
