# Voke App

React Native application for an iOS and Android version of the Voke messaging application

![Demo](/docs/demo.gif?raw=true)

## Getting Started

To get started running and building the Voke application, you need to have a few things installed

- Node and npm
- Xcode (for iOS build)
- Android SDK
- react-native-cli (Run `npm install -g react-native-cli`)

Check out the [Getting Started](https://facebook.github.io/react-native/docs/getting-started.html) guides for iOS/Android based on your OS



## Running the application

#### For iOS:

- Open the `ios/Voke.xcodeproj` file with Xcode
- Go to Product -> Schemes -> Manage Schemes
- It should look like this. ![Manage Schemes](/docs/ios-manage-schemes.png?raw=true)
- Go ahead and run the project, make sure the `Voke` scheme is selected.
  - If you get an error about "`RCT/RCTBridgeModule.h` not found", try changing the scheme to `React` and building that, then switch back to `Voke` and try building again.
  - If the issue still persists, you can click `Edit Scheme` for Voke and uncheck `Paralllize Build`
- It should build on whichever device you selected.
- You can also `Edit Scheme` to change to a release build when you want to build a release version on a device.

#### For Android:

- Make sure you have the Android build-tools installed from the sdk for version `25.0.2` along with all the other steps from the react-native documentation.
- Connect your android device or emulator and make sure it shows up in your terminal when you run `adb devices`
- Run `npm run android`
- *Note: You can also use Android Studio to run the application instead of the terminal*



## Debugging

You must run the application in in Dev mode to see logs.

You can use the built in Chrome Debugger for a lot of things by shaking the device and selecting **Debug JS Remotely**.

You can also install [reactotron](https://github.com/infinitered/reactotron) to see a lot of detail remotely through that application. It will automatically find your device when you run the app.

You can enable **Hot Reloading** by shaking the device and enabling it from there.



## Notes

iOS builds can only be run on a Mac.