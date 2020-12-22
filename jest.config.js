const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
	...tsjPreset,
	preset: 'react-native',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	transform: {
		...tsjPreset.transform,
		'^.+\\.(js|jsx)$':
			'<rootDir>/node_modules/react-native/jest/preprocessor.js',
	},
	globals: {
		'ts-jest': {
			babelConfig: true,
		},
	},
	// This is the only part which you can keep
	// from the above linked tutorial's config:
	cacheDirectory: '.jest/cache',
	setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
