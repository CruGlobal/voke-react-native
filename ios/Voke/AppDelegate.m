/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import "Orientation.h"
#import <React/RCTPushNotificationManager.h>
#import "Firebase.h"
#import "RNFirebaseLinks.h"

#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <AVFoundation/AVFoundation.h>

#import <React/RCTRootView.h>

#import "ADBMobile.h"
@implementation AppDelegate

const NSString *MH_ADOBE_ANAYLYTICS_FILENAME_KEY = @"ADB Mobile Config";

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase
  [FIROptions defaultOptions].deepLinkURLScheme = @"org.cru.voke";
  [FIRApp configure];
  
  NSURL *jsCodeLocation;
  
  // jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  

  #ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Voke"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [UIColor colorWithRed:0.27 green:0.78 blue:0.91 alpha:1.0];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  
  [Fabric with:@[[Crashlytics class]]];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
  NSError *setCategoryError = nil;
  [audioSession setCategory:AVAudioSessionCategoryPlayback
                      error:&setCategoryError];
  
  return YES;
}

// FOR REACT NATIVE ORIENTATION
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}


- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                openURL:url
                                                      sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                                             annotation:options[UIApplicationOpenURLOptionsAnnotationKey]
                  ];
  // Add any custom logic here.
  // Firebase Dynamic Links

  if (!handled) {
    handled = [[RNFirebaseLinks instance] application:application openURL:url options:options];
  }
  return handled;
}

// Firebase Dynamic Links
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler {
  return [[RNFirebaseLinks instance] application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

// Required to register for notifications
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RCTPushNotificationManager didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}


- (void)configureAdobeAnalytics {
  NSBundle *bundle = [NSBundle mainBundle];
  NSString *filename = [bundle objectForInfoDictionaryKey:MH_ADOBE_ANAYLYTICS_FILENAME_KEY];
  NSString *filepath = [bundle pathForResource:filename ofType:@"json"];
  
  [ADBMobile overrideConfigPath:filepath];
}


@end
