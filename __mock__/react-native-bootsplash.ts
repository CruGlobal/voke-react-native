jest.mock('react-native-bootsplash', () => (
	{
		show: jest.fn(),
		hide: jest.fn(),
		getVisibilityStatus: jest.fn(),
	}));