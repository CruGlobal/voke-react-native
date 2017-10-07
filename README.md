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



## Building the application

For iOS, you can run change the scheme to a `Release` version and run the application in Xcode.

For Android, to build to the store, you will have to use the existing android keystore from one of the Cru administrators.

To build to a local device, check that there is a device connected by running `adb devices`, then you can run `npm run android:build`. Make sure you've uninstalled any existing Voke application on the device first.



## Notes

iOS builds can only be run on a Mac.
To build a version that does not have the ugly black flash on startup for iOS you will need to add some custom code into a file located under Node-Modules/React-Native-Navigation. We did not want to fork that repository so if you do npm i you will lose your changes. Go to the file called RCCManager.m under iOS. After line 229 insert the following code to allow for a situation where it cannot find the startup screens and to set a custom background color:   
`  if (splashView == nil)
  {
    UIViewController *splashVC = [[UIViewController alloc] init];
    UIView* baseView = [[UIView alloc] initWithFrame:CGRectMake(0,
      0,
      [[UIScreen mainScreen] applicationFrame].size.width,
      [[UIScreen mainScreen] applicationFrame].size.height)];
    [splashVC.view addSubview:baseView];
    [baseView setBackgroundColor:[UIColor colorWithRed:0.27 green:0.78 blue:0.91 alpha:1.0]];

    id<UIApplicationDelegate> appDelegate = [UIApplication sharedApplication].delegate;
    appDelegate.window.rootViewController = splashVC;
    [appDelegate.window makeKeyAndVisible];
  }`
